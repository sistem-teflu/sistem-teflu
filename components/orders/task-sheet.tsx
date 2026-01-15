"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TechnicianView } from "@/components/execution/technician-view";
import { ValidationView } from "@/components/execution/validation-view";
import { ToolingExecutionView } from "@/components/tooling/execution-view"; 
import { validateToolingOrder } from "@/lib/actions/tooling"; 
import { Wrench, CheckSquare, Clock, ShieldCheck, Loader2, Printer } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VALIDATOR_ROLES } from "@/lib/constants";
import { toast } from "sonner";
import Link from "next/link";

interface TaskSheetProps {
    order: any;
    currentUserId: string;
    currentUserRole: string;
}

export function TaskSheet({ order, currentUserId, currentUserRole }: TaskSheetProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. DETECTAR TIPO DE ORDEN
    const isToolingOrder = !!order.toolingId;

    // 2. DETERMINAR SI SOY TÉCNICO O SUPERVISOR
    const isTechnician = isToolingOrder 
        ? order.technicianId === currentUserId 
        : order.mechanicId === currentUserId;

    // Lógica corregida de Supervisor
    const isSupervisor = (order.userId === currentUserId) || VALIDATOR_ROLES.includes(currentUserRole);

    // 3. DATOS DE ENCABEZADO
    const titleCode = isToolingOrder ? order.tooling?.code : order.machine?.code;
    const description = isToolingOrder ? order.tooling?.description : order.descripcion; 
    const requesterName = isToolingOrder 
        ? "Preventivo Programado"
        : `${order.user?.name} ${order.user?.apellidos}`;

    const actionTitle = isTechnician ? "Ejecución de Mantenimiento" : "Validación de Entrega";

    const handleValidateTooling = async () => {
        setLoading(true);
        const res = await validateToolingOrder(order.id);
        setLoading(false);
        if (res.success) {
            setOpen(false);
            toast.success(res.message);
        } else {
            toast.error(res.error);
        }
    };

    // Función auxiliar para determinar si mostrar botón
    const canShowAction = isTechnician || isSupervisor;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* Solo mostramos botón si tiene rol relevante */}
            {canShowAction && (
                <SheetTrigger asChild>
                    <Button size="sm" className={isTechnician ? "bg-blue-600" : "bg-green-600"} suppressHydrationWarning={true}>
                        {isTechnician ? <Wrench className="mr-2 h-4 w-4" /> : <CheckSquare className="mr-2 h-4 w-4" />}
                        {isTechnician ? "Atender" : "Validar"}
                    </Button>
                </SheetTrigger>
            )}
            
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4 sm:p-6" side="right" suppressHydrationWarning={true}>
        
                <SheetHeader className="mb-6 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <SheetTitle className="text-xl sm:text-2xl font-bold">
                            {isToolingOrder ? "Herramental" : "Orden"} #{order.folio}
                        </SheetTitle>
                        <Badge variant="outline" className="text-sm sm:text-lg">{order.status}</Badge>
                    </div>
                    <SheetDescription>
                        {actionTitle} - <span className="font-bold text-foreground">{titleCode}</span>
                    </SheetDescription>
                </SheetHeader>

                {/* DATOS DE LA ORDEN (HEADER) */}
                <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg border">
                    <div>
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                            {isToolingOrder ? "Descripción Herramental" : "Falla Reportada"}
                        </span>
                        <p className="font-medium text-sm">{description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase text-muted-foreground">Solicitante:</span>
                            <p className="text-sm">{requesterName}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase text-muted-foreground">Fecha:</span>
                            <p className="text-sm">{format(new Date(order.date_create), "dd MMM HH:mm", { locale: es })}</p>
                        </div>
                    </div>
                </div>

                {/* === ZONA DE EJECUCIÓN (TÉCNICO) === */}
                
                {/* 1. MÁQUINAS */}
                {!isToolingOrder && isTechnician && (order.status === "ASIGNADA" || order.status === "EN_PROCESO") && (
                    <TechnicianView order={order} />
                )}

                {/* 2. HERRAMENTALES */}
                {isToolingOrder && isTechnician && (order.status === "ASIGNADA" || order.status === "EN_PROCESO") && (
                    <ToolingExecutionView order={order} />
                )}


                {/* === ZONA DE VALIDACIÓN (SUPERVISOR) === */}

                {/* 1. MÁQUINAS: Validación con comentarios */}
                {!isTechnician && !isToolingOrder && order.status === "POR_VALIDAR" && isSupervisor && (
                    <ValidationView order={order} />
                )}

                {/* 2. HERRAMENTALES: Validación directa (Viendo el checklist lleno) */}
                {!isTechnician && isToolingOrder && order.status === "POR_VALIDAR" && isSupervisor && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-yellow-600" />
                            <div>
                                <p className="font-bold text-yellow-800">Revisión Finalizada</p>
                                <p className="text-xs text-yellow-700">El técnico ha completado el checklist.</p>
                            </div>
                        </div>
                        
                        <Button onClick={handleValidateTooling} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Validar Checklist y Cerrar
                        </Button>
                    </div>
                )}
                
                {isToolingOrder && order.status === "CERRADA" && (
                    <div className="mt-6 border-t pt-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center mb-4">
                            <p className="font-bold text-green-800">Orden Finalizada y Validada</p>
                        </div>
                        
                        <Link href={`/herramentales/preventivos/${order.id}/imprimir`} passHref>
                            <Button className="w-full" variant="outline" suppressHydrationWarning={true}>
                                <Printer className="mr-2 h-4 w-4" /> Ver Formato de Impresión
                            </Button>
                        </Link>
                    </div>
                )}

                {/* === MENSAJES DE ESPERA === */}
                {isTechnician && order.status === "POR_VALIDAR" && (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                        <Clock className="h-10 w-10 mb-2 text-yellow-500" />
                        <p>Ya terminaste tu parte.</p>
                        <p className="text-sm">Esperando validación de supervisión.</p>
                    </div>
                )}

            </SheetContent>
        </Sheet>
    );
}