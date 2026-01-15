import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// Instancia para el SERVIDOR (Permite enviar notificaciones)
// Solo se usa en Server Actions
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
})

// Instancia para el CLIENTE (Permite escuchar notificaciones)
// Se usa en componentes React ("use client")
export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    }
)