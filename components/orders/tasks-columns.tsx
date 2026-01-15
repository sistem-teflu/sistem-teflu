"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TaskSheet } from "./task-sheet"; // Componente nuevo
import { ORDER_STATUSES } from "@/lib/constants";
import { AlertTriangle } from "lucide-react";

export const getTaskColumns = (currentUserId: string, currentUserRole: string): ColumnDef<any>[] => [
    {
        accessorKey: "folio",
        header: "Folio",
        cell: ({ row }) => <span className="font-mono font-bold">#{row.original.folio}</span>,
    },
    {
        accessorKey: "machine.code",
        header: "Equipo",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold">{row.original.machine.code}</span>
                <span className="text-xs text-muted-foreground">{row.original.machine.process}</span>
            </div>
        ),
    },
    {
        accessorKey: "descripcion",
        header: "Prioridad / Falla",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.causaParo && (
                    <Badge variant="destructive" className="h-5 px-1 animate-pulse">PARO</Badge>
                )}
                <span className="truncate max-w-50" title={row.original.descripcion}>
                    {row.original.descripcion}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const statusKey = row.original.status as keyof typeof ORDER_STATUSES;
            const config = ORDER_STATUSES[statusKey] || { label: statusKey, color: "bg-gray-500" }; 
            return <Badge className={`${config.color} text-white hover:${config.color}`}>{config.label}</Badge>;
        },
    },
    {
        id: "actions",
        header: "Acción Requerida",
        cell: ({ row }) => (
        <TaskSheet 
            order={row.original} 
            currentUserId={currentUserId} 
            currentUserRole={currentUserRole} // <--- Pasamos el rol
        />
        ),
    },
];