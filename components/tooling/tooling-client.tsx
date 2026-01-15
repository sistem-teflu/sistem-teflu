"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TaskSheet } from "@/components/orders/task-sheet"; // Reutilizamos el TaskSheet
import { ORDER_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Definición de columnas específica para Herramentales
const getColumns = (currentUserId: string, currentUserRole: string): ColumnDef<any>[] => [
    {
        accessorKey: "folio",
        header: "Folio",
        cell: ({ row }) => <span className="font-mono font-bold">#{row.original.folio.toString().padStart(6, '0')}</span>,
    },
    {
        accessorKey: "tooling.code",
        header: "Herramental",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold">{row.original.tooling.code}</span>
                <span className="text-xs text-muted-foreground truncate max-w-50">{row.original.tooling.description}</span>
            </div>
        ),
    },
    {
        accessorKey: "technician.name",
        header: "Técnico",
        cell: ({ row }) => row.original.technician ? row.original.technician.name : "Sin asignar",
    },
    {
        accessorKey: "date_create",
        header: "Fecha",
        cell: ({ row }) => <span className="text-xs">{format(new Date(row.original.date_create), "dd MMM yyyy", { locale: es })}</span>
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const statusKey = row.original.status as keyof typeof ORDER_STATUSES;
            const config = ORDER_STATUSES[statusKey] || { label: row.original.status, color: "bg-gray-500" };
            return <Badge className={`${config.color} text-white hover:${config.color}`}>{config.label}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <TaskSheet 
                order={row.original} 
                currentUserId={currentUserId} 
                currentUserRole={currentUserRole} 
            />
        ),
    },
];

export function ToolingClient({ orders, userId, role }: { orders: any[], userId: string, role: string }) {
    const columns = getColumns(userId, role);
    return <DataTable columns={columns} data={orders} />;
}