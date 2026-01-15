"use client";

import { useState } from "react";
import { saveToolingChecklist, finishToolingOrder } from "@/lib/actions/tooling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, CheckCircle } from "lucide-react";

export function ToolingExecutionView({ order }: { order: any }) {
    const [checks, setChecks] = useState(order.checks || []);
    const [piezas, setPiezas] = useState(order.piezasProducidas || 0);
    const [loading, setLoading] = useState(false);

    const handleCheckChange = (index: number, field: string, value: string) => {
        const newChecks = [...checks];
        newChecks[index][field] = value;
        setChecks(newChecks);
    };

    const handleSave = async () => {
        setLoading(true);
        await saveToolingChecklist(order.id, checks, piezas);
        setLoading(false);
        toast.success("Avance guardado");
    };

    const handleFinish = async () => {
        // Validar que todo esté lleno
        const incomplete = checks.some((c: any) => 
            c.component !== "VIDA UTIL" && c.status === "PENDIENTE"
        );

        if(incomplete) {
            toast.error("Debes evaluar todos los puntos antes de finalizar.");
            return;
        }
        
        setLoading(true);
        await handleSave(); // Guardar ultimo estado
        await finishToolingOrder(order.id);
        setLoading(false);
        toast.success("Orden enviada a validación");
    };

    return (
        <div className="space-y-6">
            {/* SECCION VIDA UTIL */}
            <Card>
                <CardHeader className="bg-slate-100 py-3">
                    <CardTitle className="text-sm font-bold">VIDA ÚTIL HERRAMENTAL</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <label className="text-sm font-medium">Piezas producidas en el periodo:</label>
                    <Input 
                        type="number" 
                        value={piezas} 
                        onChange={(e) => setPiezas(Number(e.target.value))}
                        className="mt-2 w-full sm:w-1/3" 
                    />
                </CardContent>
            </Card>

            {/* LISTA DE VERIFICACIÓN */}
            <div className="space-y-4">
                {checks.map((check: any, index: number) => {
                    if(check.component === "VIDA UTIL") return null; // Ya lo manejamos arriba

                    return (
                        <Card key={check.id} className={`border-l-4 ${check.status === 'OK' ? 'border-l-green-500' : check.status === 'NOK' ? 'border-l-red-500' : 'border-l-gray-300'}`}>
                            <CardContent className="pt-4 pb-4">
                                <h4 className="font-bold text-sm">{check.component}</h4>
                                <p className="text-xs text-muted-foreground mb-3">{check.procedure}</p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="w-full sm:w-32">
                                        <Select 
                                            value={check.status} 
                                            onValueChange={(val) => handleCheckChange(index, 'status', val)}
                                        >
                                            <SelectTrigger className={check.status === 'OK' ? 'text-green-600 font-bold' : check.status === 'NOK' ? 'text-red-600 font-bold' : ''} suppressHydrationWarning={true}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                                <SelectItem value="OK" className="text-green-600 font-bold">✓ OK</SelectItem>
                                                <SelectItem value="NOK" className="text-red-600 font-bold">X Dañado</SelectItem>
                                                <SelectItem value="NA">No Aplica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Input 
                                        placeholder="Observaciones (opcional)" 
                                        value={check.comments || ""}
                                        onChange={(e) => handleCheckChange(index, 'comments', e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex gap-3 justify-end pt-4 pb-10">
                <Button variant="outline" onClick={handleSave} disabled={loading} suppressHydrationWarning={true}>
                    <Save className="mr-2 h-4 w-4" /> Guardar Avance
                </Button>
                <Button onClick={handleFinish} disabled={loading} className="bg-green-600 hover:bg-green-700" suppressHydrationWarning={true}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Finalizar
                </Button>
            </div>
        </div>
    );
}