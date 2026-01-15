"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignTechnician } from "@/lib/actions/work-orders";
import { UserCog, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface AssignDialogProps {
    orderId: number;
    currentMechanicId?: string | null;
    mechanics: any[]; // Lista de técnicos
    trigger?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
}

export function AssignDialog({ orderId, currentMechanicId, mechanics, trigger, onOpenChange }: AssignDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(currentMechanicId || "");

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
        if (onOpenChange) onOpenChange(val);
    }

    const handleAssign = async () => {
        if (!selectedId) {
            toast.error("Selecciona un técnico");
            return;
        }

        setLoading(true);
        const result = await assignTechnician(orderId, selectedId);
        setLoading(false);

        if (result.success) {
            setOpen(false);
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" suppressHydrationWarning={true}>
                        <UserCog className="mr-2 h-4 w-4" /> Asignar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Asignar Técnico</DialogTitle>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Selecciona el personal de mantenimiento encargado de esta orden.
                    </p>
                    <Select value={selectedId} onValueChange={setSelectedId}>
                        <SelectTrigger suppressHydrationWarning>
                            <SelectValue placeholder="Seleccionar técnico..." />
                        </SelectTrigger>
                        <SelectContent>
                            {mechanics.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">No hay mecánicos registrados</div>
                            ) : (
                                mechanics.map((m) => (
                                    <SelectItem key={m.iduser} value={m.iduser}>
                                        {m.name} {m.apellidos}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAssign} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Asignación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}