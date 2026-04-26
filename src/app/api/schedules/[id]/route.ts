import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { Role } from '@prisma/client';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { params } = context;
  const { id: scheduleId } = await params;
  try {
    const requesterRole = request.headers.get('x-user-role') as Role;
    const requesterId = request.headers.get('x-user-id') as string;

    if (requesterRole === 'EMPLOYEE') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado para eliminar horarios' },
        { status: 403 }
      );
    }

    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule || existingSchedule.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, message: 'Horario no encontrado o ya cancelado' },
        { status: 404 }
      );
    }

    // Aplicar Soft Delete
    await prisma.schedule.update({
      where: { id: scheduleId },
      data: { status: 'CANCELLED' },
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE_SCHEDULE',
        entity: 'Schedule',
        entityId: scheduleId,
        userId: requesterId,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Horario cancelado exitosamente' },
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