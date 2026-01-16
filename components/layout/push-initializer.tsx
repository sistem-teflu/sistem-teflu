"use client";

import { useEffect } from "react";
import { savePushSubscription } from "@/lib/actions/notifications";

// Función helper para convertir la llave pública
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushInitializer() {
    useEffect(() => {
        // Solo ejecutar en navegador y si soporta Service Worker
        if ('serviceWorker' in navigator && 'PushManager' in window) {
        
        // 1. Registrar Service Worker
        navigator.serviceWorker.register('/sw.js')
        .then(async (registration) => {
            
            // 2. Pedir Permiso al Usuario
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
            // 3. Suscribirse al PushManager del navegador
                const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
                };
                
                const subscription = await registration.pushManager.subscribe(subscribeOptions);
                
                // 4. Guardar suscripción en nuestra BD
                await savePushSubscription(JSON.parse(JSON.stringify(subscription)));
                console.log("Push Notification suscrito!");
            }
        })
        .catch(err => console.error("Error SW:", err));
        }
    }, []);

    return null; // Este componente no renderiza nada visual
}