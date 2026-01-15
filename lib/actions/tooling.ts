"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendNotification } from "@/lib/actions/notifications";
import { VALIDATOR_ROLES } from "@/lib/constants";

// 1. CREAR ORDEN Y ASIGNAR
export async function createToolingOrder(toolingId: number, technicianId: string) {
    try {
        // A. Obtenemos las actividades base
        const activities = await prisma.toolingActivity.findMany({ where: { isActive: true } });

        // B. Creamos la orden
        const order = await prisma.toolingOrder.create({
            data: {
                toolingId,
                technicianId,
                status: "ASIGNADA",
                // C. Pre-llenamos el checklist copiando las actividades
                checks: {
                create: activities.map(act => ({
                    component: act.component,
                    procedure: act.procedure,
                    status: "PENDIENTE"
                }))
                }
            },
            include: { tooling: true }
        });

        // D. Notificar al técnico
        await sendNotification(technicianId, "Mtto. Herramental", `Revisar herramental ${order.tooling.code}`, "/mis-tareas");

        revalidatePath("/herramentales/preventivos");
        return { success: true, message: "Orden creada" };
    } catch (error) {
        return { error: "Error al crear orden" };
    }
}

// 2. TÉCNICO: GUARDAR AVANCE (Checklist)
export async function saveToolingChecklist(orderId: number, checks: any[], piezas: number) {
    try {
        // Actualizar piezas
        await prisma.toolingOrder.update({
            where: { id: orderId },
            data: { piezasProducidas: piezas, status: "EN_PROCESO" }
        });

        // Actualizar cada linea del checklist
        for (const check of checks) {
            await prisma.toolingCheck.update({
                where: { id: check.id },
                data: { status: check.status, comments: check.comments }
            });
        }
        
        revalidatePath("/mis-tareas");
        return { success: true };
    } catch (error) {
        return { error: "Error al guardar" };
    }
}

// 3. TÉCNICO: FINALIZAR
export async function finishToolingOrder(orderId: number) {
    const order = await prisma.toolingOrder.update({
        where: { id: orderId },
        data: { status: "POR_VALIDAR", date_finish: new Date() },
        include: { technician: true, tooling: true }
    });

    // Notificar validadores
    const validators = await prisma.user.findMany({ 
        where: { role: { name: { in: VALIDATOR_ROLES } } } 
    });

    for(const v of validators) {
        await sendNotification(v.iduser, "Validar Herramental", `Orden #${order.folio} terminada por ${order.technician?.name}`, "/mis-tareas");
    }
    return { success: true };
}

// 4. GETTERS
export async function getToolingOrders() {
    return await prisma.toolingOrder.findMany({
        include: { 
            tooling: true, 
            technician: true, 
            validator: true,
            checks: {
                orderBy: { id: 'asc' } // Para que la lista salga ordenada
            }
        },
        orderBy: { date_create: 'desc' }
    });
}

export async function getToolingCatalog() {
    return await prisma.tooling.findMany({ where: { isActive: true } });
}

// 5. SUPERVISOR: VALIDAR Y CERRAR (NUEVO)
export async function validateToolingOrder(orderId: number) {
    const session = await getSession();
    if (!session) return { error: "Sin sesión" };

    try {
        await prisma.toolingOrder.update({
            where: { id: orderId },
            data: {
                status: "CERRADA",
                validatorId: session.userId,
                // fechaValidacion: new Date() // Si agregaste este campo al schema
            }
        });
        revalidatePath("/herramentales/preventivos");
        revalidatePath("/mis-tareas");
        return { success: true, message: "Mantenimiento validado y cerrado" };
    } catch (error) {
        return { error: "Error al validar" };
    }
}

export async function getToolingOrderById(id: number) {
    const session = await getSession();
    if (!session) return null;

    return await prisma.toolingOrder.findUnique({
        where: { id },
        include: {
            tooling: true,
            technician: true,
            validator: true,
            checks: {
                orderBy: { id: 'asc' } // Importante el orden
            }
        }
    });
}