"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher"; // Asegúrate de tener configurado lib/pusher.ts
import webpush from 'web-push';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

// 1. FUNCIÓN CENTRAL PARA ENVIAR (La usaremos en todos lados)
export async function sendNotification(userId: string, title: string, message: string, link: string) {
    try {
        // A. Guardar en BD (Igual que antes)
        const notif = await prisma.notification.create({
            data: { userId, title, message, link }
        });

        // B. Pusher (WebSocket para cuando la app está abierta)
        await pusherServer.trigger(`channel-user-${userId}`, 'new-notification', { ...notif, isRead: false });

        // C. === NUEVO: WEB PUSH (Para cuando la app está cerrada) ===
        // Buscar todas las suscripciones (celular, laptop) de ese usuario
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId }
        });

        // Enviar a todos los dispositivos
        const payload = JSON.stringify({ title, body: message, url: link });
        
        subscriptions.forEach(sub => {
        const pushConfig = {
            endpoint: sub.endpoint,
            keys: { auth: sub.auth, p256dh: sub.p256dh }
        };
        
        webpush.sendNotification(pushConfig, payload).catch(err => {
            console.error("Error enviando push", err);
            if (err.statusCode === 410) {
                // Si devuelve 410, la suscripción ya no existe (borrar de BD)
                prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(console.error);
            }
        });
        });

        return { success: true };
    } catch (error) {
        console.error("Error general:", error);
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

export async function savePushSubscription(sub: any) {
    const session = await getSession();
    if (!session) return { error: "No sesión" };

    try {
        await prisma.pushSubscription.upsert({
            where: { endpoint: sub.endpoint },
            update: { 
                userId: session.userId,
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
            },
            create: {
                userId: session.userId,
                endpoint: sub.endpoint,
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
            }
        });
        return { success: true };
    } catch (error) {
        return { error: "Error guardando sub" };
    }
}