"use client";

import { useState } from "react";
import { startWorkOrder, finishWorkOrder } from "@/lib/actions/execution";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, CheckCircle, Clock, Wrench } from "lucide-react";
import { toast } from "sonner";

interface TechnicianViewProps {
    order: any;
}

export function TechnicianView({ order }: TechnicianViewProps) {
    const [loading, setLoading] = useState(false);

    // 1. SI AÚN NO INICIA
    if (order.status === "ASIGNADA") {
        return (
        <Card className="border-l-4 border-l-blue-500 shadow-md">
            <CardHeader>
            <CardTitle>Acciones del Técnico</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground mb-4">
                Al llegar a la máquina, presiona iniciar para contar el tiempo de reparación.
            </p>
            <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12"
                onClick={async () => {
                setLoading(true);
                await startWorkOrder(order.id);
                setLoading(false);
                toast.success("Reparación iniciada");
                }}
                disabled={loading}
            >
                <Play className="mr-2 h-5 w-5" /> Iniciar Reparación
            </Button>
            </CardContent>
        </Card>
        );
    }

    // 2. SI YA ESTÁ TRABAJANDO (FORMULARIO DE CIERRE)
    if (order.status === "EN_PROCESO") {
        return (
        <Card className="border-l-4 border-l-yellow-500 shadow-md mt-6">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-yellow-600" /> Reporte Técnico
            </CardTitle>
            </CardHeader>
            <form action={async (formData) => {
                const res = await finishWorkOrder(order.id, formData);
                if (res.success) toast.success(res.message);
                else toast.error(res.error);
            }}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label>Diagnóstico (¿Qué encontraste?)</Label>
                <Textarea name="diagnostico" required placeholder="Ej. Sensor sucio, cable roto..." />
                </div>
                <div className="space-y-2">
                <Label>Causa Raíz (¿Por qué falló?)</Label>
                <Input name="causaRaiz" required placeholder="Ej. Desgaste natural, mal uso..." />
                </div>
                <div className="space-y-2">
                <Label>Actividades Realizadas</Label>
                <Textarea name="actividades" required placeholder="Ej. Limpieza, ajuste, cambio de..." />
                </div>
                <div className="space-y-2">
                <Label>Refacciones Utilizadas</Label>
                <Input name="refacciones" placeholder="Ej. Sensor E3Z-D61 (Opcional)" />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg h-12">
                <CheckCircle className="mr-2 h-5 w-5" /> Terminar y Notificar
                </Button>
            </CardFooter>
            </form>
        </Card>
        );
    }

    // 3. SI ESTÁ ESPERANDO VALIDACIÓN
    if (order.status === "POR_VALIDAR") {
        return (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-orange-800 flex items-center gap-3">
            <Clock className="h-6 w-6" />
            <div>
            <p className="font-bold">Esperando Validación de Producción</p>
            <p className="text-sm">El supervisor debe firmar la entrega para cerrar la orden.</p>
            </div>
        </div>
        );
    }

    return null;
}