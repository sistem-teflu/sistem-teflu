import { getSession } from "@/lib/auth";
import { getMachines } from "@/lib/actions/work-orders";
import prisma from "@/lib/prisma";
import { CreateOrderForm } from "@/components/produccion/create-order-form";
import { redirect } from "next/navigation";

export default async function CreateOrderPage() {
    const session = await getSession();
    
    if (!session) {
        redirect("/login");
    }

    const [userData, machines] = await Promise.all([
        // --- CORRECCIÓN AQUÍ ---
        // Buscamos por 'iduser' usando 'session.userId'
        prisma.user.findUnique({ 
            where: { iduser: session.userId } 
        }), 
        getMachines()
    ]);

    // Si a pesar de esto no aparece (raro), mostramos error
    if (!userData) return <div className="p-8 text-red-500">Error: No se pudo cargar la información del usuario.</div>;

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Solicitud de Mantenimiento</h1>
                <p className="text-muted-foreground">
                    Complete el formulario para reportar fallas en los equipos de producción.
                </p>
            </div>

            <CreateOrderForm user={userData} machines={machines} />
        </div>
    );
}