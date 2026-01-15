"use client";

import { useState } from "react";
import { deleteToolingActivity } from "@/lib/actions/tooling-activities";
import { ActivityDialog } from "./activity-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ActivityActions({ activity }: { activity: any }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const res = await deleteToolingActivity(activity.id);
        setLoading(false);
        if(res.success) toast.success("Eliminado correctamente");
        else toast.error("Error al eliminar");
    };

    return (
        <div className="flex items-center gap-2 justify-end">
            {/* EDITAR */}
            <ActivityDialog 
                activity={activity} 
                trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8" suppressHydrationWarning={true}>
                        <Edit className="h-4 w-4" />
                    </Button>
                }
            />

            {/* ELIMINAR */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" suppressHydrationWarning={true}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta actividad dejará de aparecer en las nuevas órdenes de mantenimiento.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => { e.preventDefault(); handleDelete(); }} 
                            className="bg-red-600 hover:bg-red-700"
                            disabled={loading}
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