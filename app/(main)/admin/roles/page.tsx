import { getRoles } from "@/lib/actions/roles";
import { RoleDialog } from "@/components/roles/role-dialog";
import { DataTable } from "@/components/ui/data-table"; // Asegúrate de importar tu DataTable
import { columns } from "@/components/roles/columns";

export default async function RolesPage() {
    const roles = await getRoles();

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Roles y Permisos</h2>
            <p className="text-muted-foreground">
                Administra los niveles de acceso a los módulos del sistema.
            </p>
            </div>
            {/* Componente para CREAR rol */}
            <RoleDialog />
        </div>

        {/* Tabla de Datos */}
        <DataTable columns={columns} data={roles}  />
        </div>
    );
}