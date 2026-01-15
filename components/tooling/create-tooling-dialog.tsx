"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createToolingOrder } from "@/lib/actions/tooling";
import { Plus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface Props {
    toolings: any[];
    technicians: any[];
}

export function CreateToolingDialog({ toolings, technicians }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        const toolingId = Number(formData.get("toolingId"));
        const technicianId = formData.get("technicianId") as string;

        const res = await createToolingOrder(toolingId, technicianId);
        
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
                <Button suppressHydrationWarning={true}>
                    <Plus className="mr-2 h-4 w-4" /> Programar Preventivo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Mantenimiento de Herramental</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Herramental</Label>
                        <Select name="toolingId" required>
                            <SelectTrigger suppressHydrationWarning={true}>
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                {toolings.map(t => (
                                    <SelectItem key={t.id} value={t.id.toString()}>
                                        {t.code} - {t.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Asignar Técnico</Label>
                        <Select name="technicianId" required>
                            <SelectTrigger suppressHydrationWarning={true}>
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                {technicians.map(t => (
                                    <SelectItem key={t.iduser} value={t.iduser}>
                                        {t.name} {t.apellidos}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} suppressHydrationWarning={true}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Generar Orden
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}