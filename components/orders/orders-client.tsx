"use client";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "@/components/orders/columns";

export function OrdersClient({ orders, mechanics }: { orders: any[], mechanics: any[] }) {
    const columns = getColumns(mechanics);
    return <DataTable columns={columns} data={orders} />;
}