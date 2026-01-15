import { getToolingActivities } from "@/lib/actions/tooling-activities";
import { ActivityDialog } from "@/components/tooling/activity-dialog";
import { ActivitiesClient } from "@/components/tooling/activities-client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ActivitiesPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const activities = await getToolingActivities();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Plantilla de Actividades</h2>
                    <p className="text-muted-foreground">
                        Configura los puntos de revisión que aparecerán en los mantenimientos de herramentales.
                    </p>
                </div>
                <ActivityDialog />
            </div>

            <ActivitiesClient data={activities} />
        </div>
    );
}