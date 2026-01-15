"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/machines/columns";

export function MachinesClient({ data }: { data: any[] }) {
    return <DataTable columns={columns} data={data} />;
}