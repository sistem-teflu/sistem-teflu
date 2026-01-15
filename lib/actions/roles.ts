"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validaciones
const PermissionSchema = z.object({
    module: z.string(),
    canView: z.boolean(),
    canCreate: z.boolean(),
    canEdit: z.boolean(),
    canDelete: z.boolean(),
});

const RoleSchema = z.object({
    id: z.number().optional(), // Opcional si es crear
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    permissions: z.array(PermissionSchema),
});

// --- OBTENER ROLES ---
export async function getRoles() {
    return await prisma.role.findMany({
        include: {
            permissions: true,
            _count: { select: { users: true } } // Para saber cuántos usuarios tienen este rol
        },
        orderBy: { id: "asc" }
    });
}

// --- GUARDAR (CREAR O EDITAR) ---
export async function saveRole(prevState: any, formData: FormData) {
    // Convertimos el FormData complejo a un objeto JS
    const rawData = {
        id: formData.get("id") ? Number(formData.get("id")) : undefined,
        name: formData.get("name"),
        // Los permisos vienen como JSON stringificado desde el cliente
        permissions: JSON.parse(formData.get("permissions") as string),
    };

    const validation = RoleSchema.safeParse(rawData);

    if (!validation.success) {
        return { error: "Datos inválidos", details: validation.error.format() };
    }

    const { id, name, permissions } = validation.data;

    try {
        if (id) {
            // --- EDITAR ---
            await prisma.$transaction(async (tx) => {
                // 1. Actualizar nombre
                await tx.role.update({ where: { id }, data: { name } });
                
                // 2. Borrar permisos viejos y poner los nuevos (es más fácil que actualizar uno por uno)
                await tx.permission.deleteMany({ where: { roleId: id } });
                await tx.permission.createMany({
                    data: permissions.map(p => ({ ...p, roleId: id }))
                });
            });
        } else {
            // --- CREAR ---
            await prisma.role.create({
                data: {
                    name,
                    permissions: {
                        create: permissions
                    }
                }
            });
        }

        revalidatePath("/admin/roles");
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: "Error al guardar el rol. Verifica que el nombre no esté duplicado." };
    }
}

// --- ELIMINAR ---
export async function deleteRole(id: number) {
    try {
        await prisma.role.delete({ where: { id } });
        revalidatePath("/admin/roles");
        return { success: true };
    } catch (error) {
        return { error: "No se puede eliminar el rol porque tiene usuarios asignados." };
    }
}