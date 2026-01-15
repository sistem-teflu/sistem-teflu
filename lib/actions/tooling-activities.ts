"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ActivitySchema = z.object({
    id: z.coerce.number().optional(),
    component: z.string().min(1, "El componente es requerido (Ej: BOQUILLA)"),
    procedure: z.string().min(5, "El procedimiento debe ser descriptivo"),
});

// --- OBTENER TODAS ---
export async function getToolingActivities() {
    return await prisma.toolingActivity.findMany({
        where: { isActive: true },
        orderBy: { component: 'asc' }
    });
}

// --- GUARDAR (CREAR / EDITAR) ---
export async function saveToolingActivity(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = ActivitySchema.safeParse(rawData);

    if (!validation.success) {
        return { error: "Datos inválidos" };
    }

    const { id, component, procedure } = validation.data;

    try {
        if (id) {
        // Editar
        await prisma.toolingActivity.update({
            where: { id },
            data: { component, procedure }
        });
        } else {
        // Crear
        await prisma.toolingActivity.create({
            data: { component, procedure, isActive: true }
        });
        }

        revalidatePath("/herramentales/actividades");
        return { success: true, message: "Actividad guardada correctamente" };
    } catch (error) {
        return { error: "Error al guardar la actividad" };
    }
}

// --- ELIMINAR (SOFT DELETE) ---
export async function deleteToolingActivity(id: number) {
    try {
        // Usamos soft delete para no romper historiales antiguos
        await prisma.toolingActivity.update({
            where: { id },
            data: { isActive: false }
        });
        revalidatePath("/herramentales/actividades");
        return { success: true, message: "Actividad eliminada" };
    } catch (error) {
        return { error: "Error al eliminar" };
    }
}