"use client";

import { DataTable } from "@/components/ui/data-table";
import { getColumns, UserData } from "@/components/users/columns";

interface UsersClientProps {
    users: UserData[];
    roles: any[];
}

export function UsersClient({ users, roles }: UsersClientProps) {
    // Aquí SÍ podemos llamar a getColumns porque estamos en un Client Component
    const columns = getColumns(roles);

    return (
        <DataTable columns={columns} data={users} />
    );
}