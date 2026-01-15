"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getMyNotifications, markAsRead } from "@/lib/actions/notifications";
import { pusherClient } from "@/lib/pusher";
import Link from "next/link";
import { toast } from "sonner";

export function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNew, setHasNew] = useState(false); // Estado para controlar el punto rojo

    // 1. Carga inicial
    useEffect(() => {
        const fetchNotifs = async () => {
            const data = await getMyNotifications();
            setNotifications(data);
            if (data.length > 0) setHasNew(true);
        };
        fetchNotifs();
    }, []);

    // 2. Escuchar Tiempo Real
    useEffect(() => {
        if (!userId) return;

        const channelName = `channel-user-${userId}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind('new-notification', (data: any) => {
            // SONIDO DE NOTIFICACIÓN (Opcional, ayuda mucho en celular)
            // const audio = new Audio('/sounds/notification.mp3'); 
            // audio.play().catch(e => console.log("Audio play failed"));

            toast.info(data.title, { description: data.message });
            
            setNotifications((prev) => [data, ...prev]);
            setHasNew(true); // <--- ACTIVAR PUNTO ROJO
        });

        return () => {
        pusherClient.unsubscribe(channelName);
        };
    }, [userId]);

    const handleRead = async (n: any) => {
        await markAsRead(n.id);
        const updated = notifications.filter(x => x.id !== n.id);
        setNotifications(updated);
        
        // Si ya no hay notificaciones en la lista, quitamos el punto rojo
        if (updated.length === 0) setHasNew(false);
        
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative" suppressHydrationWarning={true}>
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {/* EL CÍRCULO ROJO */}
                    {hasNew && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 shadow-lg">
                <div className="p-4 border-b font-semibold flex justify-between items-center">
                    <span>Notificaciones</span>
                    {notifications.length > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{notifications.length}</span>}
                </div>
                <div className="max-h-75 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            Todo limpio. No tienes notificaciones.
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div 
                                key={n.id} 
                                className="p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors relative"
                                onClick={() => handleRead(n)}
                            >
                                <div className="absolute left-2 top-4 h-2 w-2 rounded-full bg-blue-500" /> {/* Indicador de no leído interno */}
                                <Link href={n.link || "#"} className="block pl-4">
                                    <div className="font-semibold text-sm">{n.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-2">{n.message}</div>
                                    <div className="text-[10px] text-right text-gray-400 mt-1">Ahora mismo</div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}