"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher"; // Asegúrate de tener configurado lib/pusher.ts

// 1. FUNCIÓN CENTRAL PARA ENVIAR (La usaremos en todos lados)
export async function sendNotification(userId: string, title: string, message: string, link: string) {
    try {
        // A. Guardar en BD
        const notif = await prisma.notification.create({
            data: { userId, title, message, link }
        });

        // B. Disparar evento en tiempo real
        await pusherServer.trigger(`channel-user-${userId}`, 'new-notification', {
            id: notif.id,
            title: notif.title,
            message: notif.message,
            link: notif.link,
            createdAt: notif.createdAt,
            isRead: false
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error enviando notificación:", error);
        return { success: false };
    }
}

// 2. OBTENER MIS NOTIFICACIONES (Solo las no leídas)
export async function getMyNotifications() {
    const session = await getSession();
    if (!session) return [];

    return await prisma.notification.findMany({
        where: { userId: session.userId, isRead: false },
        orderBy: { createdAt: "desc" },
        take: 10
    });
}

// 3. MARCAR COMO LEÍDA
export async function markAsRead(id: number) {
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    revalidatePath("/");
}