"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { ROLES_WITH_FULL_ACCESS } from "@/lib/constants";

// Esquema de validación
const UserSchema = z.object({
    iduser: z.string().optional(),
    nomina: z.string().min(1, "La nómina es requerida"),
    name: z.string().min(1, "El nombre es requerido"),
    apellidos: z.string().min(1, "Los apellidos son requeridos"),
    email: z.string().email("Correo inválido").optional().or(z.literal("")),
    numero: z.string().optional(),
    puesto: z.string().min(1, "El puesto es requerido"),
    departamento: z.string().min(1, "El departamento es requerido"),
    roleId: z.coerce.number().min(1, "Debes seleccionar un rol"),
    password: z.string().optional(),
    cumple: z.string().optional(),
});

// --- OBTENER USUARIOS (CON SEGURIDAD DE ROLES) ---
export async function getUsers() {
    const session = await getSession();
    
    // Si no hay sesión, retornamos vacío por seguridad
    if (!session) return [];

    // Verificamos si el usuario actual tiene permisos para ver inactivos
    const canSeeInactive = ROLES_WITH_FULL_ACCESS.includes(session.role);

    return await prisma.user.findMany({
        where: {
            // Si tiene permiso, ve todo (where: {}). Si no, solo status: true
            ...(canSeeInactive ? {} : { status: true }),
        },
        include: {
            role: true, // Incluimos el rol para mostrar el nombre en la tabla
        },
        orderBy: { date_create: "desc" },
    });
}

// --- GUARDAR (CREAR O EDITAR) ---
export async function saveUser(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = UserSchema.safeParse(rawData);

    if (!validation.success) {
        return { error: "Datos inválidos", details: validation.error.format() };
    }

    const data = validation.data;
    const birthdayDate = data.cumple ? new Date(data.cumple) : null;

    try {
        if (data.iduser) {
            // --- EDITAR ---
            // Solo actualizamos password si el usuario escribió una nueva
            const updateData: any = { 
                ...data, 
                cumple: birthdayDate 
            };
            delete updateData.iduser; // No actualizamos el ID
            delete updateData.password; // Lo manejamos aparte

            if (data.password && data.password.length > 0) {
                updateData.password = await bcrypt.hash(data.password, 10);
            }

            await prisma.user.update({
                where: { iduser: data.iduser },
                data: updateData,
            });

            revalidatePath("/admin/usuarios");
            return { success: true, message: "Usuario actualizado correctamente" };

        } else {
            // --- CREAR ---
            if (!data.password) {
                return { error: "La contraseña es obligatoria para nuevos usuarios" };
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);

            await prisma.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                    email: data.email || null, // Manejar string vacío como null
                    cumple: birthdayDate
                },
            });

            revalidatePath("/admin/usuarios");
            return { success: true, message: "Usuario creado exitosamente" };
        }
    } catch (error: any) {
        // Manejo de error de duplicados (Prisma P2002)
        if (error.code === 'P2002') {
            return { error: "Ya existe un usuario con esa nómina o correo." };
        }
        console.error(error);
        return { error: "Error interno del servidor" };
    }
}

// --- CAMBIAR STATUS (SOFT DELETE) ---
export async function toggleUserStatus(iduser: string, currentStatus: boolean) {
    try {
        await prisma.user.update({
            where: { iduser },
            data: { 
                status: !currentStatus,
                date_delete: !currentStatus ? null : new Date() // Si desactivamos, guardamos fecha
            },
        });
        revalidatePath("/admin/usuarios");
        return { success: true };
    } catch (error) {
        return { error: "Error al cambiar el estatus del usuario" };
    }
}