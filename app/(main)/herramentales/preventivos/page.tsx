import { getToolingOrders, getToolingCatalog } from "@/lib/actions/tooling";
import { getMechanics } from "@/lib/actions/work-orders"; // Reutilizamos la de mecánicos
import { getSession } from "@/lib/auth";
import { CreateToolingDialog } from "@/components/tooling/create-tooling-dialog";
import { ToolingClient } from "@/components/tooling/tooling-client";
import { redirect } from "next/navigation";

export default async function ToolingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Cargamos datos en paralelo para mayor velocidad
  const [orders, toolings, technicians] = await Promise.all([
    getToolingOrders(),
    getToolingCatalog(),
    getMechanics()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Preventivos de Herramentales</h2>
          <p className="text-muted-foreground">
            Control de vida útil y checklists de mantenimiento.
          </p>
        </div>
        {/* Pasamos los catálogos al diálogo de creación */}
        <CreateToolingDialog toolings={toolings} technicians={technicians} />
      </div>

      {/* Pasamos las órdenes a la tabla cliente */}
      <ToolingClient orders={orders} userId={session.userId} role={session.role} />
    </div>
  );
}