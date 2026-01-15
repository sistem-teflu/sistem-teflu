"use client";

import { useState } from "react";
import { validateWorkOrder } from "@/lib/actions/execution";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function ValidationView({ order }: { order: any }) {
    const [open, setOpen] = useState(false);
    const [comentarios, setComentarios] = useState("");
    const [loading, setLoading] = useState(false);

    const handleValidate = async () => {
        setLoading(true);
        const res = await validateWorkOrder(order.id, comentarios);
        setLoading(false);

        if (res.success) {
        setOpen(false);
        toast.success(res.message);
        } else {
        toast.error(res.error);
        }
    };

    if (order.status !== "POR_VALIDAR") return null;

    return (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center mt-4">
        <div className="flex gap-3 items-center">
            <CheckCheck className="text-green-600 h-6 w-6" />
            <div>
            <p className="font-bold text-green-800">Trabajo Terminado</p>
            <p className="text-sm text-green-700">Valide que la máquina funciona correctamente.</p>
            </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
                Validar y Cerrar
            </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Autorizar Entrega de Máquina</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                <div className="bg-slate-100 p-3 rounded text-sm">
                <p><strong>Diagnóstico Técnico:</strong> {order.diagnostico}</p>
                <p><strong>Actividades:</strong> {order.actividades}</p>
                </div>

                <Textarea 
                placeholder="Comentarios sobre la entrega (Opcional)" 
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                />
                
                <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 p-2 rounded">
                <AlertCircle className="h-4 w-4" />
                <p>Al aceptar, la orden se cerrará definitivamente.</p>
                </div>
            </div>

            <Button onClick={handleValidate} disabled={loading} className="w-full">
                Confirmar y Cerrar Orden
            </Button>
            </DialogContent>
        </Dialog>
        </div>
    );
}