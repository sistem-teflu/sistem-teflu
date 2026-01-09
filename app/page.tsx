"use client";

import React, { useState, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar"; // Generado por Shadcn
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Printer, Save } from "lucide-react";
import { useReactToPrint } from "react-to-print";

// Importamos tipos y componente de impresión
import { ConfiguracionHeader, GrupoActividades, OrdenTrabajo } from "@/types";
import { PrintFormat } from "@/components/print-format";

// === DATOS INICIALES (MOCK) ===
const INITIAL_CONFIG: ConfiguracionHeader = {
  empresa: "ABTEFLU",
  titulo: "MANTENIMIENTO AUTONOMO",
  codigo: "FPR-79",
  revision: "REV. 1",
  logoUrl: "",
};

const INITIAL_GROUPS: GrupoActividades[] = [
  {
    id: "g1",
    nombre: "GABINETES ELECTRICOS",
    actividades: [
      { id: "a1", texto: "PRESIONE PARO DE EMERGENCIA ANTES DE REALIZAR LA ACTIVIDAD." },
      { id: "a2", texto: "LIMPIE CON DIELECTRICO CABLES Y CONECTORES." },
    ],
  },
];

export default function Page() {
  // Estados
  const [config, setConfig] = useState<ConfiguracionHeader>(INITIAL_CONFIG);
  const [grupos, setGrupos] = useState<GrupoActividades[]>(INITIAL_GROUPS);
  
  // Estado del Formulario de Orden Actual
  const [orden, setOrden] = useState<OrdenTrabajo>({
    folio: 1100, // Debería venir de la BD
    responsable: "RAUL BARANDA HERNANDEZ",
    genero: "ROBERTO LUNA",
    reviso: "",
    autorizo: "ROGELIO RODRIGUEZ MUÑOZ",
    maquina: "{D-236} DOBLADORA 4 IN BLM GROUP ELECT-102 REV. 1",
    fechaInicio: "22-sep-2025",
    fechaFin: "28-sep-2025",
  });

  // Ref para impresión
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: `OT-${orden.folio}`,
  });

  // --- HANDLERS (CRUD Simple) ---
  const updateConfig = (field: keyof ConfiguracionHeader, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const addGrupo = () => {
    const newGrupo: GrupoActividades = {
      id: Date.now().toString(),
      nombre: "NUEVO GRUPO",
      actividades: [],
    };
    setGrupos([...grupos, newGrupo]);
  };

  const addActividad = (grupoId: string) => {
    setGrupos(grupos.map(g => {
      if(g.id === grupoId) {
        return {
          ...g,
          actividades: [...g.actividades, { id: Date.now().toString(), texto: "Nueva actividad..." }]
        }
      }
      return g;
    }));
  };

  const deleteActividad = (grupoId: string, actId: string) => {
    setGrupos(grupos.map(g => {
      if(g.id === grupoId) {
        return { ...g, actividades: g.actividades.filter(a => a.id !== actId) };
      }
      return g;
    }));
  };

  // Función para simular guardar y generar siguiente folio
  const handleGenerarOrden = () => {
     alert("Orden Guardada. Folio incrementado.");
     setOrden({ ...orden, folio: orden.folio + 1 });
     handlePrint();
  };

  return (
    <SidebarProvider>
      <AppSidebar /> 
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Plataforma</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Generador OT</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="p-4 bg-muted/20 min-h-screen">
          <Tabs defaultValue="generator" className="w-full">
            <div className="flex justify-between items-center mb-4">
               <TabsList>
                <TabsTrigger value="generator">Generar Orden</TabsTrigger>
                <TabsTrigger value="template">Editar Plantilla</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                {/* BOTÓN NUEVO: SOLO IMPRIMIR */}
                {/* Llama directamente a handlePrint, no guarda ni sube el folio */}
                <Button 
                  variant="secondary" 
                  onClick={handlePrint}
                  className="bg-white border hover:bg-gray-100 text-black"
                >
                  <Printer className="mr-2 h-4 w-4" /> 
                  Solo Imprimir
                </Button>
                {/* BOTÓN EXISTENTE: GENERAR Y GUARDAR */}
                <Button 
                  onClick={handleGenerarOrden} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" /> 
                  Generar y Guardar
                </Button>
              </div>
            </div>

            {/* === PESTAÑA 1: GENERADOR === */}
            <TabsContent value="generator" className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Formulario de Entrada */}
                  <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                      <CardTitle>Datos de la Orden</CardTitle>
                      <CardDescription>Folio Actual: <span className="text-red-500 font-bold">{orden.folio}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div>
                         <Label>Máquina / Equipo</Label>
                         <Input value={orden.maquina} onChange={(e) => setOrden({...orden, maquina: e.target.value})} />
                       </div>
                       <div>
                         <Label>Responsable</Label>
                         <Input value={orden.responsable} onChange={(e) => setOrden({...orden, responsable: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                         <div>
                            <Label>Generó</Label>
                            <Input value={orden.genero} onChange={(e) => setOrden({...orden, genero: e.target.value})} />
                         </div>
                         <div>
                            <Label>Autorizó</Label>
                            <Input value={orden.autorizo} onChange={(e) => setOrden({...orden, autorizo: e.target.value})} />
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Fecha Inicio</Label>
                            <Input value={orden.fechaInicio} onChange={(e) => setOrden({...orden, fechaInicio: e.target.value})} />
                          </div>
                          <div>
                            <Label>Fecha Fin</Label>
                            <Input value={orden.fechaFin} onChange={(e) => setOrden({...orden, fechaFin: e.target.value})} />
                          </div>
                       </div>
                    </CardContent>
                  </Card>

                  {/* Previsualización */}
                  <Card className="md:col-span-2 bg-gray-50 overflow-hidden">
                     <CardHeader>
                        <CardTitle>Vista Previa</CardTitle>
                     </CardHeader>
                     <CardContent className="overflow-auto max-h-[800px] border rounded-md bg-white p-4 shadow-inner">
                        <PrintFormat 
                           
                           config={config} 
                           data={orden} 
                           grupos={grupos} 
                        />
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            {/* === PESTAÑA 2: EDITOR DE PLANTILLA === */}
            <TabsContent value="template">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {/* Config Header */}
                 <Card className="md:col-span-1 h-fit">
                    <CardHeader><CardTitle>Encabezado</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                       <div>
                          <Label>Empresa</Label>
                          <Input value={config.empresa} onChange={(e) => updateConfig('empresa', e.target.value)} />
                       </div>
                       <div>
                          <Label>Título Documento</Label>
                          <Input value={config.titulo} onChange={(e) => updateConfig('titulo', e.target.value)} />
                       </div>
                       <div>
                          <Label>Código ISO</Label>
                          <Input value={config.codigo} onChange={(e) => updateConfig('codigo', e.target.value)} />
                       </div>
                       <div>
                          <Label>Revisión</Label>
                          <Input value={config.revision} onChange={(e) => updateConfig('revision', e.target.value)} />
                       </div>
                    </CardContent>
                 </Card>

                 {/* Config Actividades */}
                 <Card className="md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                       <CardTitle>Grupos y Actividades</CardTitle>
                       <Button size="sm" onClick={addGrupo}><Plus className="h-4 w-4 mr-1"/> Agregar Grupo</Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       {grupos.map((grupo, gIndex) => (
                          <div key={grupo.id} className="border p-4 rounded-lg bg-white relative">
                             <div className="mb-4">
                                <Label className="text-xs text-muted-foreground uppercase">Nombre del Grupo</Label>
                                <Input 
                                  value={grupo.nombre} 
                                  onChange={(e) => {
                                     const newGrupos = [...grupos];
                                     newGrupos[gIndex].nombre = e.target.value;
                                     setGrupos(newGrupos);
                                  }} 
                                  className="font-bold text-lg" 
                                />
                             </div>
                             
                             <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                                {grupo.actividades.map((act, aIndex) => (
                                   <div key={act.id} className="flex gap-2 items-center">
                                      <span className="text-sm font-mono text-gray-400">{aIndex + 1}.</span>
                                      <Input 
                                        value={act.texto} 
                                        onChange={(e) => {
                                           const newGrupos = [...grupos];
                                           newGrupos[gIndex].actividades[aIndex].texto = e.target.value;
                                           setGrupos(newGrupos);
                                        }}
                                      />
                                      <Button variant="ghost" size="icon" onClick={() => deleteActividad(grupo.id, act.id)}>
                                         <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                   </div>
                                ))}
                                <Button variant="outline" size="sm" className="mt-2" onClick={() => addActividad(grupo.id)}>
                                   <Plus className="h-3 w-3 mr-1" /> Actividad
                                </Button>
                             </div>
                          </div>
                       ))}
                    </CardContent>
                 </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div style={{ display: "none" }}>
           <PrintFormat 
              ref={componentRef} 
              config={config} 
              data={orden} 
              grupos={grupos} 
           />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}