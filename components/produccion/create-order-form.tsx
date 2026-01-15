"use client";

import { useActionState, useEffect, useState } from "react";
import { createWorkOrder } from "@/lib/actions/work-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { calcularTurno } from "@/lib/utils"; // Reutilizamos lógica visualmente
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Save, AlertTriangle } from "lucide-react";

interface CreateOrderFormProps {
    user: any;
    machines: any[];
}

export function CreateOrderForm({ user, machines }: CreateOrderFormProps) {
    const [state, action, isPending] = useActionState(createWorkOrder, null);
    
    // Estado local para mostrar la hora y turno en tiempo real
    const [currentDate, setCurrentDate] = useState(new Date());
    const [turno, setTurno] = useState("");

    useEffect(() => {
        // Actualizar reloj y turno cada minuto
        const timer = setInterval(() => {
        setCurrentDate(new Date());
        setTurno(calcularTurno());
        }, 1000 * 60);
        
        // Inicializar
        setTurno(calcularTurno());

        return () => clearInterval(timer);
    }, []);

    // Manejo de respuesta del servidor
    useEffect(() => {
        if (state?.success) {
        toast.success(state.message);
        // Opcional: Resetear form o redirigir
        } else if (state?.error) {
        toast.error(state.error);
        }
    }, [state]);

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg border-t-4 border-t-red-600">
            <CardHeader className="bg-muted/20 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold uppercase text-red-700">Orden de Trabajo</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Mantenimiento Correctivo</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-gray-700">
                            {format(currentDate, "HH:mm")}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                            {format(currentDate, "EEEE, dd 'de' MMMM", { locale: es })}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <form action={action}>
                <CardContent className="space-y-6 pt-6">
                    
                    {/* SECCIÓN 1: DATOS AUTOMÁTICOS (READ ONLY) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg border">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Solicitante</Label>
                            <div className="font-bold text-sm truncate">{user.name} {user.apellidos}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Departamento</Label>
                            <div className="font-bold text-sm">{user.departamento}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Turno Actual</Label>
                            <div className="font-bold text-sm text-blue-700">{turno}</div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: CAPTURA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Máquina */}
                        <div className="space-y-2">
                            <Label htmlFor="machine">Máquina / Equipo <span className="text-red-500">*</span></Label>
                            <Select name="machineId" required>
                                <SelectTrigger className="h-12 bg-background" suppressHydrationWarning={true}> 
                                    <SelectValue placeholder="Seleccione el equipo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {machines.map((m) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.code} - {m.process}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Checkbox Paro */}
                        <div className="
                            flex items-center space-x-2 border p-4 rounded-md h-12 mt-auto transition-all cursor-pointer
                            bg-card hover:bg-muted/50
                            
                            /* Estilos del Contenedor (Padre) */
                            has-data-[state=checked]:border-red-600 
                            has-data-[state=checked]:bg-red-50 
                            dark:has-data-[state=checked]:bg-red-900/20 
                            dark:has-data-[state=checked]:border-red-500
                        ">
                            <Checkbox 
                                id="causaParo" 
                                name="causaParo" 
                                className="
                                    border-muted-foreground/40
                                    data-[state=checked]:bg-red-600 
                                    data-[state=checked]:border-red-600 
                                    dark:data-[state=checked]:bg-red-600 
                                    dark:data-[state=checked]:border-red-600
                                    data-[state=checked]:text-white
                                " 
                            />
                            <Label
                                htmlFor="causaParo"
                                className="text-sm font-medium leading-none cursor-pointer w-full flex items-center gap-2"
                            >
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                ¿El equipo está detenido? (Causa Paro)
                            </Label>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción de la Falla <span className="text-red-500">*</span></Label>
                        <Textarea 
                            name="descripcion" 
                            placeholder="Describa detalladamente qué sucedió, ruidos extraños, códigos de error, etc."
                            className="min-h-30 resize-none bg-background text-base"
                            required
                        />
                    </div>

                </CardContent>

                <CardFooter className="flex justify-end gap-4 bg-muted/20 py-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto bg-red-600 hover:bg-red-700 font-bold cursor-pointer" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Generar Orden de Trabajo
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}