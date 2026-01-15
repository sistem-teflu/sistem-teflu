"use server";

import prisma from "@/lib/prisma"; // Asegúrate que esta ruta sea correcta
import { createSession, logout } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
    nomina: z.string().min(1, "La nómina es requerida"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export async function loginAction(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { error: "Datos inválidos" };
    }

    const { nomina, password } = result.data;

    try {
        // PASO 1: Agregar include: { role: true }
        const user = await prisma.user.findUnique({
            where: { nomina },
            include: { role: true } // <--- ESTO ES LO QUE FALTABA
        });

        if (!user) {
            return { error: "Credenciales incorrectas" };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { error: "Credenciales incorrectas" };
        }

        // PASO 2: Acceder a user.role.name
        await createSession({
            userId: user.iduser.toString(),
            name: user.name,
            role: user.role.name,
            email: user.email || "Sin correo"
        });

    } catch (error) {
        console.error("Login error:", error);
        return { error: "Error interno del servidor" };
    }

    // CAMBIO: Redirigir a /dashboard (que coincide con tu carpeta app/(main)/dashboard)
    redirect("/");
}

export async function logoutAction() {
    await logout();
    return { success: true };
}