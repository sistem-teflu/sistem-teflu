import { getMachines } from "@/lib/actions/machines";
import { MachineDialog } from "@/components/machines/machine-dialog";
import { MachinesClient } from "@/components/machines/machines-client";

export default async function MachinesPage() {
    const machines = await getMachines();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Catálogo de Máquinas</h2>
                    <p className="text-muted-foreground">
                        Gestión de equipos, procesos y disponibilidad.
                    </p>
                </div>
                <MachineDialog />
            </div>

            <MachinesClient data={machines} />
        </div>
    );
}