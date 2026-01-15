"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, Hash, Briefcase, MapPin, Cake } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserDetailsDialogProps {
    user: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
    if (!user) return null;

    const iniciales = `${user.name[0]}${user.apellidos[0]}`.toUpperCase();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Ficha del Usuario</DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col items-center gap-4 py-4">
                    <Avatar className="h-24 w-24 border-2 border-gray-100 shadow-md">
                        <AvatarImage src={user.img || ""} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">{iniciales}</AvatarFallback>
                    </Avatar>
                    
                    <div className="text-center">
                        <h3 className="text-xl font-bold">{user.name} {user.apellidos}</h3>
                        <div className="flex justify-center gap-2 mt-2">
                            <Badge variant="secondary">{user.role.name}</Badge>
                            <Badge className={user.status ? "bg-green-500" : "bg-red-500"}>
                                {user.status ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Cake className="h-3 w-3 text-pink-500"/> Cumpleaños
                        </span>
                        <p className="font-medium">
                            {user.cumple 
                                ? format(new Date(user.cumple), "dd 'de' MMMM", { locale: es }) // Ej: 15 de enero
                                : "No registrado"
                            }
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3"/> Nómina</span>
                        <p className="font-medium">{user.nomina}</p>
                    </div>
                    
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Briefcase className="h-3 w-3"/> Puesto</span>
                        <p className="font-medium">{user.puesto}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> Departamento</span>
                        <p className="font-medium">{user.departamento}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> Teléfono</span>
                        <p className="font-medium">{user.numero || "N/A"}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> Correo</span>
                        <p className="font-medium">{user.email || "Sin correo registrado"}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3"/> Fecha Alta</span>
                        <p className="text-sm">
                            {format(new Date(user.date_create), "PPP", { locale: es })}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}