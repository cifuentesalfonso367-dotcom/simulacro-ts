import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { Role } from '@prisma/client';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    const requesterRole = request.headers.get('x-user-role') as Role;
    const requesterId = request.headers.get('x-user-id') as string;

    // Filtros base: Solo traer horarios activos
    const whereClause: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (requesterRole === 'EMPLOYEE') {
      // Si es empleado, solo ve las tareas asignadas a él mismo
      whereClause.userId = requesterId;
    } else if (targetUserId) {
      // Si es admin/manager y busca un usuario específico
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
    const { title, description, startTime, endTime, userIds } = body;

    const targetIds = userIds || (body.userId ? [body.userId] : []);

    if (!title || !startTime || !endTime || targetIds.length === 0) {
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
        userId: { in: targetIds },
        status: 'ACTIVE',
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      },
      include: { user: true }
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, message: `El usuario ${conflict.user.name} ya tiene un horario asignado en ese lapso` },
        { status: 409 }
      );
    }

    const newSchedules = await Promise.all(
      targetIds.map(async (uid: string) => {
        const newSchedule = await prisma.schedule.create({
          data: {
            title,
            description,
            startTime: start,
            endTime: end,
            userId: uid,
          },
          include: {
            user: {
              select: { id: true, name: true, email: true },
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

        return newSchedule;
      })
    );

    return NextResponse.json(
      { success: true, message: 'Horarios creados exitosamente', data: newSchedules },
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