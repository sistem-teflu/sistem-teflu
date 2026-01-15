"use client";

import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { ToolingPrintFormat } from "@/components/tooling/tooling-print-format";
import { Printer, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
// Necesitamos una Server Action que traiga una orden por ID
// (La definiremos abajo o puedes usar una existente si tienes)
import { getToolingOrderById } from "@/lib/actions/tooling"; 

export default function PrintToolingOrderPage() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const componentRef = useRef<HTMLDivElement>(null);
    
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `OT-${order?.folio || '000'}`,
    });

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) return;
            const data = await getToolingOrderById(Number(params.id));
            setOrder(data);
            setLoading(false);
        };
        fetchOrder();
    }, [params.id]);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>;
    if (!order) return <div>Orden no encontrada</div>;

    return (
        <div className="p-6 bg-muted/20 min-h-screen flex flex-col items-center gap-6">
        
        {/* Barra de Herramientas */}
        <div className="w-full max-w-[210mm] flex justify-between items-center print:hidden">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            <Button onClick={() => handlePrint()} className="bg-blue-600 hover:bg-blue-700">
                <Printer className="mr-2 h-4 w-4" /> Imprimir Formato
            </Button>
        </div>

        {/* Vista Previa del Documento (Lo que se va a imprimir) */}
        <div className="shadow-2xl border bg-white print:shadow-none print:border-none">
            <ToolingPrintFormat ref={componentRef} order={order} />
        </div>

        </div>
    );
}