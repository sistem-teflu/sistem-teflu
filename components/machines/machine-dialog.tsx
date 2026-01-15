"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveMachine } from "@/lib/actions/machines";
import { MACHINE_STATUSES } from "@/lib/constants";
import { Plus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface MachineDialogProps {
    machine?: any;
    trigger?: React.ReactNode;
}

export function MachineDialog({ machine, trigger }: MachineDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        if (machine?.id) formData.append("id", machine.id.toString());

        const result = await saveMachine(null, formData);
        
        setLoading(false);
        if (result?.success) {
            setOpen(false);
            toast.success(result.message);
        } else {
            toast.error(result?.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> Nueva Máquina</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{machine ? "Editar Máquina" : "Registrar Máquina"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Código</Label>
                            <Input name="code" defaultValue={machine?.code} placeholder="Ej. D-236" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Proceso</Label>
                            <Input name="process" defaultValue={machine?.process} placeholder="Ej. Doblado" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Estatus Actual</Label>
                        <Select name="status" defaultValue={machine?.status || "DISPONIBLE"}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MACHINE_STATUSES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${s.color}`} />
                                            {s.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Operador Actual (Opcional)</Label>
                        <Input name="operator" defaultValue={machine?.operator || ""} placeholder="Nombre del operador" />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}