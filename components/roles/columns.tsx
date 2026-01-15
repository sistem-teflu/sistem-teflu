"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { RoleActions } from "./role-actions"; // Importamos el componente del paso 1

// Definimos el tipo de datos que esperamos (basado en Prisma)
export type RoleData = {
    id: number;
    name: string;
    permissions: { canView: boolean }[];
    _count: { users: number };
};

export const columns: ColumnDef<RoleData>[] = [
    {
        accessorKey: "name",
        header: "Rol",
        cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2 font-medium">
            <Shield className="h-4 w-4 text-blue-600" />
            {row.getValue("name")}
            </div>
        );
        },
    },
    {
        accessorKey: "users", // Usamos un accessor virtual para ordenar si quisieras
        header: "Usuarios Asignados",
        cell: ({ row }) => {
        const count = row.original._count.users;
        return (
            <Badge variant={count > 0 ? "secondary" : "outline"}>
            {count} Usuarios
            </Badge>
        );
        },
    },
    {
        id: "permissions",
        header: "Permisos Activos",
        cell: ({ row }) => {
        // Contamos cuántos módulos puede VER este rol
        const viewCount = row.original.permissions.filter((p) => p.canView).length;
        return (
            <span className="text-sm text-muted-foreground">
            Acceso a {viewCount} módulos
            </span>
        );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <RoleActions role={row.original} />, // Usamos el componente de acciones
    },
];