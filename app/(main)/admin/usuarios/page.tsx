import { getUsers } from "@/lib/actions/users";
import { getRoles } from "@/lib/actions/roles"; // Reutilizamos tu action de roles
import { UserDialog } from "@/components/users/user-dialog";
import { DataTable } from "@/components/ui/data-table"; // Usamos tu DataTable genérico
import { getColumns } from "@/components/users/columns";
import { UsersClient } from "@/components/users/users-client";

export default async function UsersPage() {
  // Obtenemos datos en paralelo para ser más rápidos
    const [users, roles] = await Promise.all([
        getUsers(),
        getRoles()
    ]);

    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Directorio de Usuarios</h2>
                    <p className="text-muted-foreground">
                        Administra el personal, sus roles y accesos al sistema.
                    </p>
                </div>
                <UserDialog roles={roles} />
            </div>

            <UsersClient users={users} roles={roles} />
        </div>
    );
}