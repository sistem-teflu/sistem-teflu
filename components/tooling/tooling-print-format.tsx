"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  order: any; // El objeto completo de la orden con includes
}

export const ToolingPrintFormat = React.forwardRef<HTMLDivElement, Props>(({ order }, ref) => {
    // Helpers de formato
    const folioString = order.folio.toString().padStart(6, "0");
    const fechaInicio = order.date_create ? format(new Date(order.date_create), "dd-MMM-yyyy", { locale: es }) : "___";
    const fechaFin = order.date_finish ? format(new Date(order.date_finish), "dd-MMM-yyyy", { locale: es }) : "___";
    
    // Separamos Vida Útil del resto de los checks
    const vidaUtilCheck = order.checks.find((c: any) => c.component === "VIDA UTIL");
    const otherChecks = order.checks.filter((c: any) => c.component !== "VIDA UTIL");

    return (
        <div ref={ref} className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-black text-xs p-8 print:p-0 leading-tight">
            
            {/* === ENCABEZADO === */}
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                <div className="w-1/4">
                    <div className="text-2xl font-bold text-red-700 tracking-tighter italic">
                        ABTEFLU
                    </div>
                </div>
                <div className="w-2/4 text-center">
                    <h1 className="text-xl font-bold uppercase">Mantenimiento Herramental</h1>
                    <p className="mt-1 text-lg font-semibold">Orden de Trabajo</p>
                </div>
                <div className="w-1/4 text-right flex flex-col items-end">
                    <div className="text-[10px] text-gray-600">
                        <p>FPR-07</p>
                        <p>REV. 5</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="font-bold">Folio:</span>
                        <span className="text-xl font-bold text-red-600">{folioString}</span>
                    </div>
                    <p className="text-[10px] mt-1">
                        del {fechaInicio} al {fechaFin}
                    </p>
                </div>
            </div>

            {/* === DATOS GENERALES === */}
            <div className="mb-4 text-[11px] space-y-1">
                <div className="flex justify-between">
                    <p><span className="font-bold">Responsable:</span> {order.technician?.name || "________________"}</p>
                    <p><span className="font-bold">Fecha de ejecución:</span> {fechaFin}</p>
                </div>
                <div className="flex justify-between">
                    <p><span className="font-bold">Generó:</span> SISTEMA TEFLU</p>
                    <p><span className="font-bold">Hora de ejecución:</span> {order.date_finish ? format(new Date(order.date_finish), "HH:mm") : "__:__"}</p>
                </div>
                <p><span className="font-bold">Autorizó:</span> {order.validator?.name || "PENDIENTE"}</p>
            </div>

            {/* === CÓDIGO DEL HERRAMENTAL === */}
            <div className="border border-black p-2 font-bold mb-6 bg-gray-100 text-center uppercase text-sm">
                {order.tooling.code} {order.tooling.description}
            </div>

            <div className="text-center italic underline font-bold mb-4">Actividades rutinarias</div>

            {/* === SECCIÓN 1: VIDA ÚTIL === */}
            {vidaUtilCheck && (
                <div className="mb-6 break-inside-avoid">
                    <h3 className="font-bold uppercase mb-1">\ {vidaUtilCheck.component}</h3>
                    <p className="italic text-gray-500 mb-2 ml-2 text-[10px]">Procedimiento: {vidaUtilCheck.procedure}</p>
                    
                    <div className="border border-black p-2 flex justify-between items-center">
                        <div>
                            <span className="font-bold">Medición (Piezas Producidas):</span>
                        </div>
                        <div className="text-xl font-mono font-bold border-b border-black px-4">
                            {order.piezasProducidas ?? 0} PIEZAS
                        </div>
                    </div>
                    <div className="mt-1 border-b border-gray-300 w-full pt-4 text-gray-400 text-[10px]">
                        Comentarios: {vidaUtilCheck.comments}
                    </div>
                </div>
            )}

            {/* === RESTO DE LOS CHECKS === */}
            <div className="space-y-6">
                {otherChecks.map((check: any) => (
                    <div key={check.id} className="break-inside-avoid">
                        <h3 className="font-bold border-b border-gray-400 mb-1 mt-2 uppercase">
                            \ {check.component}: Revisar {check.component}
                        </h3>
                        
                        <div className="pl-2 mb-2">
                            <p className="italic text-gray-500 mb-1 text-[10px]">Procedimiento:</p>
                            <p className="text-[10px] text-justify">{check.procedure}</p>
                        </div>

                        {/* Simulación del Grid de Días del PDF original */}
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex border border-black text-center">
                                {/* Dibujamos cuadritos vacíos para simular el formato */}
                                {[1,2,3,4,5,6,7].map((i) => (
                                    <div key={i} className="w-6 h-6 border-r border-black last:border-r-0 flex items-center justify-center text-[9px]">
                                        {/* Aquí podrías poner una 'X' si quisieras marcar algo, por ahora vacío */}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Resultado Digital */}
                            <div className="border border-black px-3 py-1 font-bold text-xs">
                                RESULTADO: 
                                <span className={`ml-2 ${check.status === 'NOK' ? 'text-red-600' : 'text-black'}`}>
                                    {check.status === 'OK' ? 'BUEN ESTADO' : check.status === 'NOK' ? 'DAÑADO / CAMBIO' : check.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-1 border-b border-gray-300 w-full pt-4 text-black text-[10px]">
                            <span className="text-gray-400">Comentarios:</span> {check.comments}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer de Paginación */}
            <div className="fixed bottom-4 left-0 right-0 text-center text-[9px] text-gray-500 hidden print:block">
                Impreso el {format(new Date(), "dd/MM/yyyy HH:mm")} - TEFLU Digital
            </div>
        </div>
    );
});

ToolingPrintFormat.displayName = "ToolingPrintFormat";