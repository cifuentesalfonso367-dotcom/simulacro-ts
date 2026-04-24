import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(): Promise<NextResponse<ApiResponse<{ accessToken: string }>>> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No se encontró token de actualización' },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token de actualización inválido o expirado' },
        { status: 401 }
      );
    }

    // Opcional: Verificar que el usuario sigue existiendo y está activo en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { status: true, role: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Usuario inactivo o no encontrado' },
        { status: 401 }
      );
    }

    // Emitir nuevo Access Token
    const newAccessToken = signAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: user.role, // Actualizamos el rol por si hubo cambios en la base de datos
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Token renovado exitosamente',
        data: { accessToken: newAccessToken } 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor', error: errorMessage },
      { status: 500 }
    );
  }
}