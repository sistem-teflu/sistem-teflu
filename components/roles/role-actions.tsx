"use client";

import { useState } from "react";
import { deleteRole } from "@/lib/actions/roles";
import { RoleDialog } from "@/components/roles/role-dialog";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner"; // O usa alert() si no tienes sonner

interface RoleActionsProps {
    role: any;
}

export function RoleActions({ role }: RoleActionsProps) {
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteRole(role.id);
            if (result?.success) {
                setOpenAlert(false);
                toast.success("El rol ha sido eliminado");
            } else {
                toast.error(result?.error || "Error al eliminar el rol");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 justify-end">
        {/* Botón Editar (Reutilizamos tu Dialog existente) */}
        <RoleDialog 
            role={role} 
            trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8" suppressHydrationWarning={true}>
                <Edit className="h-4 w-4" />
            </Button>
            } 
        />

        {/* Botón Eliminar con Confirmación */}
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará el rol <strong>{role.name}</strong> y sus permisos permanentemente.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                onClick={(e) => {
                    e.preventDefault(); // Evita que se cierre automático para manejar el loading
                    handleDelete();
                }}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sí, eliminar
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
    );
}