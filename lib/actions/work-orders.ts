"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { calcularTurno } from "@/lib/utils"; // Importa tu función
import { sendNotification } from "@/lib/actions/notifications";
import { VALIDATOR_ROLES } from "@/lib/constants";

// Esquema simple
const OrderSchema = z.object({
    machineId: z.coerce.number().min(1, "Selecciona una máquina"),
    descripcion: z.string().min(5, "Describe la falla detalladamente"),
    causaParo: z.coerce.boolean(),
});

export async function createWorkOrder(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "No hay sesión activa" };

    // 1. Obtener datos automáticos del usuario actual para asegurar consistencia
    const user = await prisma.user.findUnique({
        where: { iduser: session.userId } 
    });

    if (!user) return { error: "Usuario no encontrado" };

    // 2. Calcular datos automáticos
    const turnoActual = calcularTurno();
    
    // 3. Validar formulario
    const rawData = {
        machineId: formData.get("machineId"),
        descripcion: formData.get("descripcion"),
        causaParo: formData.get("causaParo") === "on", // Checkbox envía "on" si está activo
    };

    const validation = OrderSchema.safeParse(rawData);
    if (!validation.success) {
        return { error: "Datos inválidos", details: validation.error.format() };
    }

    try {
        const newOrder = await prisma.workOrder.create({
            data: {
                userId: user.iduser,
                area: user.departamento, // Se toma del usuario logueado
                turno: turnoActual,      // Calculado
                machineId: validation.data.machineId,
                descripcion: validation.data.descripcion,
                causaParo: validation.data.causaParo,
                status: "PENDIENTE"
            }
        });

        revalidatePath("/produccion/crear-orden");
        return { success: true, message: `Orden #${newOrder.folio} creada exitosamente` };
        
    } catch (error) {
        console.error(error);
        return { error: "Error al crear la orden de trabajo" };
    }
}

// Helper para llenar el select
export async function getMachines() {
    return await prisma.machine.findMany({
        where: { isActive: true }, // Solo mostrar máquinas activas para crear órdenes
        orderBy: { code: 'asc' }
    });
}

export async function getWorkOrders() {
    const session = await getSession();
    if (!session) return [];

    // Aquí podrías filtrar si el usuario es un técnico y solo quiere ver las suyas
    // Por ahora traemos todas las recientes primero.
    return await prisma.workOrder.findMany({
        include: {
            machine: true,
            user: true, // Solicitante
            mechanic: true // Técnico asignado
        },
        orderBy: { date_create: "desc" }
    });
}

// --- OBTENER MECÁNICOS (USUARIOS DE MTTO) ---
export async function getMechanics() {
    // Filtramos usuarios cuyo rol tenga que ver con Mantenimiento
    // Ajusta el filtro según cómo nombraste tus roles (ej: "TECNICO", "MANTENIMIENTO")
    // Si no tienes roles definidos aún, trae todos.
    return await prisma.user.findMany({
        where: {
            role: {
                name: { in: ["TECNICO", "SUPERVISOR MTTO"] } 
                // O usa un array: name: { in: ["TECNICO", "SUPERVISOR MTTO"] }
            },
            status: true
        }
    });
}

// --- ASIGNAR TÉCNICO ---
export async function assignTechnician(orderId: number, mechanicId: string) {
    try {
        // 1. Actualizar la orden
        const order = await prisma.workOrder.update({
            where: { id: orderId },
            data: {
                mechanicId: mechanicId,
                status: "ASIGNADA",
            },
            include: { machine: true } // Traemos datos de la máquina para el mensaje
        });

        // 2. ENVIAR NOTIFICACIÓN AL TÉCNICO (AQUÍ ESTABA FALTANDO)
        await sendNotification(
            mechanicId, // ID del técnico (Session del cel)
            "Nueva Orden Asignada",
            `Te han asignado la máquina ${order.machine.code}.`,
            "/mis-tareas"
        );

        revalidatePath("/mantenimiento/ordenes");
        return { success: true, message: "Técnico asignado correctamente" };
    } catch (error) {
        console.error(error);
        return { error: "Error al asignar técnico" };
    }
}

// --- ELIMINAR ORDEN ---
export async function deleteWorkOrder(orderId: number) {
    try {
        await prisma.workOrder.delete({
            where: { id: orderId }
        });
        revalidatePath("/mantenimiento/ordenes");
        return { success: true, message: "Orden eliminada" };
    } catch (error) {
        return { error: "Error al eliminar la orden" };
    }
}

// --- EDITAR ORDEN (BÁSICO) ---
// Solo permitimos editar descripción y máquina si hubo error en captura
export async function updateOrderBasic(orderId: number, formData: FormData) {
    const descripcion = formData.get("descripcion") as string;
    const machineId = Number(formData.get("machineId"));

    try {
        await prisma.workOrder.update({
            where: { id: orderId },
            data: {
                descripcion,
                machineId
            }
        });
        revalidatePath("/mantenimiento/ordenes");
        return { success: true, message: "Orden actualizada" };
    } catch (error) {
        return { error: "Error al actualizar" };
    }
}


export async function getMyPendingTasks() {
    const session = await getSession();
    if (!session) return [];

    // Verificamos si el usuario actual es un Validador (Supervisor/Admin)
    const isValidator = VALIDATOR_ROLES.includes(session.role);

    return await prisma.workOrder.findMany({
        where: {
            OR: [
                // CASO 1: Soy Técnico asignado (Ver mis reparaciones)
                {
                    mechanicId: session.userId,
                    status: { in: ["ASIGNADA", "EN_PROCESO"] }
                },
                
                // CASO 2: Soy el Creador de la orden (Ver mis solicitudes)
                {
                    userId: session.userId,
                    status: "POR_VALIDAR"
                },

                // CASO 3 (NUEVO): Soy Supervisor y hay órdenes por validar (de cualquiera)
                isValidator ? {
                    status: "POR_VALIDAR"
                } : {} // Si no es validador, este bloque no agrega nada
            ]
        },
        include: {
            machine: true,
            user: true,
            mechanic: true
        },
        orderBy: { date_create: "desc" }
    });
}