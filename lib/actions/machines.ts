"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { ROLES_WITH_FULL_ACCESS } from "@/lib/constants";

const MachineSchema = z.object({
    id: z.coerce.number().optional(),
    code: z.string().min(1, "El código es requerido"),
    process: z.string().min(1, "El proceso es requerido"),
    status: z.string(),
    operator: z.string().optional(),
});

// --- OBTENER MÁQUINAS ---
export async function getMachines() {
    const session = await getSession();
    if (!session) return [];

    const isAdmin = ROLES_WITH_FULL_ACCESS.includes(session.role);

    return await prisma.machine.findMany({
        where: {
        // Si es admin ve todas (incluso inactivas), si no, solo activas
        ...(isAdmin ? {} : { isActive: true }),
        },
        orderBy: { process: "asc" },
    });
}

// --- GUARDAR (CREAR / EDITAR) ---
export async function saveMachine(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = MachineSchema.safeParse(rawData);

    if (!validation.success) {
        return { error: "Datos inválidos" };
    }

    const { id, code, process, status, operator } = validation.data;

    try {
        if (id) {
            await prisma.machine.update({
                where: { id },
                data: { code, process, status, operator },
            });
        } else {
            await prisma.machine.create({
                data: { code, process, status, operator, isActive: true },
            });
        }

        revalidatePath("/admin/maquinas");
        return { success: true, message: "Máquina guardada correctamente" };
    } catch (error) {
        console.error(error);
        return { error: "Error al guardar. Verifica que el código no esté duplicado." };
    }
}

// --- TOGGLE ACTIVE (SOFT DELETE) ---
export async function toggleMachineActive(id: number, currentStatus: boolean) {
    try {
        await prisma.machine.update({
            where: { id },
            data: { isActive: !currentStatus },
        });
        revalidatePath("/admin/maquinas");
        return { success: true };
    } catch (error) {
        return { error: "Error al actualizar estado" };
    }
}