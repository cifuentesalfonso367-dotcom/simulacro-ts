import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { Role } from '@prisma/client';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    // Filtros base: Solo traer horarios activos
    const whereClause: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (targetUserId) {
      whereClause.userId = targetUserId;
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(
      { success: true, message: 'Horarios obtenidos', data: schedules },
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

export async function POST(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const requesterRole = request.headers.get('x-user-role') as Role;
    const requesterId = request.headers.get('x-user-id') as string;

    if (requesterRole === 'EMPLOYEE') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado para crear horarios' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, startTime, endTime, userId } = body;

    if (!title || !startTime || !endTime || !userId) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return NextResponse.json(
        { success: false, message: 'La hora de inicio debe ser menor a la hora de fin' },
        { status: 400 }
      );
    }

    // Validación de conflictos
    const conflict = await prisma.schedule.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, message: 'El usuario ya tiene un horario asignado en ese lapso' },
        { status: 409 }
      );
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_SCHEDULE',
        entity: 'Schedule',
        entityId: newSchedule.id,
        userId: requesterId,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Horario creado exitosamente', data: newSchedule },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor', error: errorMessage },
      { status: 500 }
    );
  }
}