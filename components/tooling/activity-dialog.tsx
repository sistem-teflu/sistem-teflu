"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveToolingActivity } from "@/lib/actions/tooling-activities";
import { Plus, Loader2, Save, Edit } from "lucide-react";
import { toast } from "sonner";

interface Props {
    activity?: any; // Si viene, es edición
    trigger?: React.ReactNode;
}

export function ActivityDialog({ activity, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        if (activity?.id) formData.append("id", activity.id.toString());

        const res = await saveToolingActivity(null, formData);
        
        setLoading(false);
        if (res.success) {
            setOpen(false);
            toast.success(res.message);
        } else {
            toast.error(res.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button suppressHydrationWarning={true}>
                        <Plus className="mr-2 h-4 w-4" /> Nueva Actividad
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{activity ? "Editar Actividad" : "Nueva Actividad de Rutina"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Componente / Título</Label>
                        <Input 
                            name="component" 
                            defaultValue={activity?.component} 
                            placeholder="Ej. BOQUILLA, MANDRIL" 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Procedimiento Detallado</Label>
                        <Textarea 
                            name="procedure" 
                            defaultValue={activity?.procedure} 
                            placeholder="Describa qué se debe revisar..." 
                            className="h-32"
                            required 
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} suppressHydrationWarning={true}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}