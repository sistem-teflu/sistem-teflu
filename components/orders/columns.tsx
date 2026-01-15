"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "./order-actions";
import { ORDER_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Clock, User } from "lucide-react";

// Función helper para pasar los mecánicos a las acciones
// Similar a como hicimos con roles
export const getColumns = (mechanics: any[]): ColumnDef<any>[] => [
    {
        accessorKey: "folio",
        header: "Folio",
        cell: ({ row }) => {
            const folio = row.getValue("folio") as number;
            // Formato 001234
            return <span className="font-mono font-bold text-lg">#{folio.toString().padStart(6, '0')}</span>;
        },
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
        header: "Falla Reportada",
        cell: ({ row }) => (
            <div className="max-w-75 truncate" title={row.getValue("descripcion")}>
                {row.original.causaParo && (
                    <Badge variant="destructive" className="mr-2 text-[10px] px-1 py-0 h-4">PARO</Badge>
                )}
                <span className="text-sm">{row.getValue("descripcion")}</span>
            </div>
        ),
    },
    {
        accessorKey: "date_create",
        header: "Fecha",
        cell: ({ row }) => {
            const date = new Date(row.getValue("date_create"));
            return (
                <div className="text-xs text-muted-foreground flex flex-col">
                    <span className="font-medium text-foreground">{format(date, "dd MMM yyyy", { locale: es })}</span>
                    <span>{format(date, "HH:mm")} • {row.original.turno}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }) => {
            const statusKey = row.getValue("status") as keyof typeof ORDER_STATUSES;
            const config = ORDER_STATUSES[statusKey] || ORDER_STATUSES.PENDIENTE;
            
            return (
                <Badge className={`${config.color} hover:${config.color} border-0 text-white`}>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "mechanic",
        header: "Técnico",
        cell: ({ row }) => {
            const mechanic = row.original.mechanic;
            return mechanic ? (
                <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3 text-blue-600" />
                    {mechanic.name.split(" ")[0]} {mechanic.apellidos.split(" ")[0]}
                </div>
            ) : (
                <span className="text-xs italic text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Sin asignar
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <OrderActions order={row.original} mechanics={mechanics} />,
    },
];