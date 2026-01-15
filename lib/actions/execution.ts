"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { sendNotification } from "@/lib/actions/notifications";
import { VALIDATOR_ROLES } from "@/lib/constants";

// --- CREAR NOTIFICACIÓN (Helper interno) ---
async function createNotification(userId: string, title: string, message: string, link: string) {
    const notif = await prisma.notification.create({
        data: { userId, title, message, link }
    });
    
    await pusherServer.trigger(`channel-user-${userId}`, 'new-notification', {
        id: notif.id,
        title: notif.title,
        message: notif.message,
        link: notif.link,
        createdAt: notif.createdAt
    });
}

// 1. TÉCNICO: INICIAR TRABAJO
export async function startWorkOrder(orderId: number) {
    try {
        await prisma.workOrder.update({
        where: { id: orderId },
        data: {
            status: "EN_PROCESO",
            fechaInicio: new Date(),
        }
        });
        revalidatePath("/mantenimiento/ordenes");
        return { success: true };
    } catch (error) {
        return { error: "Error al iniciar orden" };
    }
}

// 2. TÉCNICO: FINALIZAR REPARACIÓN
export async function finishWorkOrder(orderId: number, formData: FormData) {
    const diagnostico = formData.get("diagnostico") as string;
    const actividades = formData.get("actividades") as string;
    const refacciones = formData.get("refacciones") as string;
    const causaRaiz = formData.get("causaRaiz") as string;

    try {
        const order = await prisma.workOrder.update({
            where: { id: orderId },
            data: {
                status: "POR_VALIDAR", // Cambia a espera de firma
                fechaFin: new Date(),
                diagnostico,
                actividades,
                refacciones,
                causaRaiz
            },
            include: { 
                user: true,      // Solicitante
                mechanic: true,  // Técnico (Nombre)
                machine: true    // Máquina (Código)
            }
        });

        const techName = order.mechanic 
        ? `${order.mechanic.name} ${order.mechanic.apellidos}` 
        : "Un técnico";

        // NOTIFICAR AL SOLICITANTE (Producción)
        await sendNotification(
            order.userId,
            "Máquina Lista",
            // Mensaje personalizado
            `${techName} terminó la orden #${order.folio} de la máquina ${order.machine.code}.`,
            "/mis-tareas"
        );

        const supervisors = await prisma.user.findMany({
            where: {
                role: {
                    name: { in: VALIDATOR_ROLES } // Busca usuarios con estos roles
                },
                status: true // Solo activos
            }
        });
        for (const sup of supervisors) {
            // Evitamos duplicar si el supervisor es el mismo que el creador
            if (sup.iduser !== order.userId) {
                await sendNotification(
                    sup.iduser,
                    "Validación Requerida",
                    `${techName} terminó la orden #${order.folio} en la máquina ${order.machine.code}. Se requiere validación de supervisor.`,
                    "/mis-tareas"
                );
            }
        }

        revalidatePath("/mantenimiento/ordenes");
        return { success: true, message: "Orden enviada a validación" };
    } catch (error) {
        console.error(error);
        return { error: "Error al finalizar orden" };
    }
}

// 3. PRODUCCIÓN: VALIDAR Y CERRAR
export async function validateWorkOrder(orderId: number, comentarios: string) {
    const session = await getSession();
    if (!session) return { error: "Sin sesión" };

    try {
        await prisma.workOrder.update({
        where: { id: orderId },
        data: {
            status: "CERRADA", // ESTADO FINAL
            validadoPorId: session.userId,
            fechaValidacion: new Date(),
            comentariosEntrega: comentarios
        }
        });
        revalidatePath("/produccion/mis-ordenes");
        return { success: true, message: "Orden cerrada exitosamente" };
    } catch (error) {
        return { error: "Error al validar" };
    }
}