"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ActivityActions } from "./activity-actions";

const columns: ColumnDef<any>[] = [
    {
        accessorKey: "component",
        header: "Componente",
        cell: ({ row }) => <span className="font-bold">{row.getValue("component")}</span>,
    },
    {
        accessorKey: "procedure",
        header: "Procedimiento",
        cell: ({ row }) => (
            <p className="text-sm text-muted-foreground max-w-125 truncate" title={row.getValue("procedure")}>
                {row.getValue("procedure")}
            </p>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <ActivityActions activity={row.original} />,
    },
];

export function ActivitiesClient({ data }: { data: any[] }) {
    return <DataTable columns={columns} data={data} />;
}