"use client";

import { useState } from "react";
import { toggleUserStatus } from "@/lib/actions/users";
import { UserDialog } from "./user-dialog";
import { UserDetailsDialog } from "./user-details-dialog";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Power, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserActionsProps {
    user: any;
    roles: any[];
}

export function UserActions({ user, roles }: UserActionsProps) {
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleToggleStatus = async () => {
        setLoading(true);
        const result = await toggleUserStatus(user.iduser, user.status);
        setLoading(false);

        if (result.success) {
            toast.success(`Usuario ${user.status ? 'desactivado' : 'activado'} correctamente`);
        } else {
            toast.error("Error al cambiar estatus");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer" suppressHydrationWarning={true}>
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* VER DETALLES */}
                    <DropdownMenuItem onClick={() => setShowDetails(true)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                    </DropdownMenuItem>
                    {/* EDITAR (Usamos el Dialog como Trigger manual) */}
                    <div onSelect={(e) => e.preventDefault()}>
                        <UserDialog 
                            user={user} 
                            roles={roles} 
                            trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                            } 
                        />
                    </div>
                    <DropdownMenuSeparator />
                    {/* TOGGLE STATUS */}
                    <DropdownMenuItem 
                        onClick={handleToggleStatus} 
                        disabled={loading}
                        className="cursor-pointer"
                        variant={`${user.status ? 'destructive' : 'default'}`}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Power className="mr-2 h-4 w-4" />}
                        {user.status ? "Desactivar Usuario" : "Reactivar Usuario"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Modal de Detalles (Renderizado condicionalmente) */}
            <UserDetailsDialog 
                user={user} 
                open={showDetails} 
                onOpenChange={setShowDetails} 
            />
        </>
    );
}