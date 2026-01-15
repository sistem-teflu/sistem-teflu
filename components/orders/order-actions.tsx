"use client";

import { useState } from "react";
import { deleteWorkOrder } from "@/lib/actions/work-orders";
import { AssignDialog } from "./assign-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, UserCog, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

interface OrderActionsProps {
    order: any;
    mechanics: any[];
}

export function OrderActions({ order, mechanics }: OrderActionsProps) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDelete = async () => {
        const res = await deleteWorkOrder(order.id);
        if (res.success) toast.success("Orden eliminada");
        else toast.error("Error al eliminar");
        setShowDeleteAlert(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" suppressHydrationWarning={true}>
                        <span className="sr-only">Acciones</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* ASIGNAR TÉCNICO (Usamos el Dialog como item controlado) */}
                    <div onSelect={(e) => e.preventDefault()}>
                        <AssignDialog 
                            orderId={order.id} 
                            currentMechanicId={order.mechanicId}
                            mechanics={mechanics}
                            trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                    <UserCog className="mr-2 h-4 w-4" /> Asignar Técnico
                                </DropdownMenuItem>
                            }
                        />
                    </div>

                    {/* EDITAR (TODO: Crear modal de edición similar a CreateOrderForm) */}
                    <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
                        <Edit className="mr-2 h-4 w-4" /> Editar (Próximamente)
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    {/* ELIMINAR */}
                    <DropdownMenuItem 
                        onClick={() => setShowDeleteAlert(true)} 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ALERTA DE ELIMINACIÓN */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Orden #{order.folio}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción borrará permanentemente el registro de la orden.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}