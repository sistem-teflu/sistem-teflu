"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";

// Tipo de dato
export type UserData = {
    iduser: string;
    nomina: string;
    name: string;
    apellidos: string;
    email: string | null;
    puesto: string;
    status: boolean;
    role: { name: string };
    img?: string | null;
    cumple?: string | Date | null;
};

// Necesitamos pasar los roles disponibles al componente de acciones, 
// así que creamos una función que devuelve las columnas
export const getColumns = (roles: any[]): ColumnDef<UserData>[] => [
    {
        accessorKey: "name",
        header: "Usuario",
        cell: ({ row }) => {
            const user = row.original;
            const iniciales = `${user.name[0]}${user.apellidos[0]}`.toUpperCase();
            
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        {/* Si img es null, pasamos undefined o cadena vacía */}
                        <AvatarImage src={user.img || ""} />
                        <AvatarFallback>{iniciales}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.name} {user.apellidos}</span>
                        <span className="text-xs text-muted-foreground">
                            {user.email || "Sin correo"}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "nomina",
        header: "Nómina",
    },
    {
        accessorKey: "puesto",
        header: "Puesto",
    },
    {
        accessorKey: "role.name",
        header: "Rol",
        cell: ({ row }) => <Badge variant="outline">{row.original.role.name}</Badge>,
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
            <Badge className={row.original.status ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                {row.original.status ? "Activo" : "Inactivo"}
            </Badge>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <UserActions user={row.original} roles={roles} />,
    },
];