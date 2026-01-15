"use client";
import { DataTable } from "@/components/ui/data-table";
import { getTaskColumns } from "@/components/orders/tasks-columns";

export function TasksClient({ tasks, currentUserId, currentUserRole }: { tasks: any[], currentUserId: string, currentUserRole: string }) {
    const columns = getTaskColumns(currentUserId, currentUserRole);
    return <DataTable columns={columns} data={tasks} />;
}