import { getMyPendingTasks } from "@/lib/actions/work-orders";
import { getSession } from "@/lib/auth";
import { TasksClient } from "@/components/orders/tasks-client";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default async function MyTasksPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const tasks = await getMyPendingTasks();

    return (
        <div className="container mx-auto py-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Mis Pendientes</h1>
                <p className="text-muted-foreground">
                    Ordenes que requieren tu atención inmediata (Reparación o Validación).
                </p>
            </div>

            {tasks.length > 0 ? (
                <TasksClient 
                    tasks={tasks} 
                    currentUserId={session.userId} 
                    currentUserRole={session.role} // <--- Pasamos el rol desde la sesión
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-muted/20">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold">¡Estás al día!</h3>
                    <p className="text-muted-foreground">No tienes órdenes ni validaciones pendientes.</p>
                </div>
            )}
        </div>
    );
}