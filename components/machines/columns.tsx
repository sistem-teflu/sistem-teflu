"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Power, User } from "lucide-react";
import { MachineDialog } from "./machine-dialog";
import { toggleMachineActive } from "@/lib/actions/machines";
import { MACHINE_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

// Tipo de dato
export type MachineData = {
    id: number;
    code: string;
    process: string;
    status: string;
    isActive: boolean;
    operator?: string | null;
};

// Componente de Acciones
const MachineActions = ({ machine }: { machine: MachineData }) => {
    const handleToggle = async () => {
        const result = await toggleMachineActive(machine.id, machine.isActive);
        if (result.success) {
            toast.success(`Máquina ${machine.isActive ? 'desactivada' : 'activada'}`);
        } else {
            toast.error("Error al cambiar estado");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                {/* EDITAR */}
                <div onSelect={(e) => e.preventDefault()}>
                    <MachineDialog 
                        machine={machine} 
                        trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                        } 
                    />
                </div>

                {/* SOFT DELETE */}
                <DropdownMenuItem onClick={handleToggle} className="cursor-pointer text-red-600">
                    <Power className="mr-2 h-4 w-4" />
                    {machine.isActive ? "Desactivar Máquina" : "Reactivar Máquina"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<MachineData>[] = [
    {
        accessorKey: "code",
        header: "Código",
        cell: ({ row }) => <span className="font-bold">{row.getValue("code")}</span>,
    },
    {
        accessorKey: "process",
        header: "Proceso",
    },
    {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }) => {
            const statusValue = row.getValue("status") as string;
            const statusInfo = MACHINE_STATUSES.find(s => s.value === statusValue);
            
            return (
                <Badge className={`${statusInfo?.color || "bg-gray-500"} hover:opacity-90`}>
                    {statusInfo?.label || statusValue}
                </Badge>
            );
        },
    },
    {
        accessorKey: "operator",
        header: "Operador",
        cell: ({ row }) => {
            const op = row.original.operator;
            return op ? (
                <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3 text-muted-foreground" /> {op}
                </div>
            ) : (
                <span className="text-xs text-muted-foreground italic">Sin asignar</span>
            );
        },
    },
    {
        id: "isActive",
        header: "Sistema",
        cell: ({ row }) => row.original.isActive ? 
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Activa</Badge> : 
        <Badge variant="destructive">Inactiva</Badge>
    },
    {
        id: "actions",
        cell: ({ row }) => <MachineActions machine={row.original} />,
    },
];