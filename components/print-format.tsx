"use client";

import React, { useState, useEffect } from "react"; // <--- 1. Importa useEffect y useState
import { ConfiguracionHeader, GrupoActividades, OrdenTrabajo } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PrintFormatProps {
  config: ConfiguracionHeader;
  data: OrdenTrabajo;
  grupos: GrupoActividades[];
}

export const PrintFormat = React.forwardRef<HTMLDivElement, PrintFormatProps>(
  ({ config, data, grupos }, ref) => {
    
    // 2. Crea un estado para guardar la fecha
    const [fechaImpresion, setFechaImpresion] = useState("");

    // 3. Usa useEffect para asignar la fecha SOLO en el cliente (navegador)
    useEffect(() => {
      setFechaImpresion(format(new Date(), "MMMM dd, yyyy HH:mm aa", { locale: es }));
    }, []);

    // Función para formatear folio a 6 dígitos (001100)
    const folioString = data.folio.toString().padStart(6, "0");

    return (
      <div ref={ref} className="w-full max-w-[210mm] mx-auto bg-white text-black text-xs p-8 print:p-0">
        
        {/* ... (Todo el contenido del encabezado y cuerpo sigue igual) ... */}
        {/* ... (Encabezado, Datos Generales, Grupos, etc.) ... */}

        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
           {/* ... Contenido del header ... */}
           {/* (Asegúrate de no cambiar nada aquí arriba, solo abajo en el footer) */}
           <div className="w-1/4">
            <div className="text-2xl font-bold text-red-700 tracking-tighter flex items-center gap-2">
               <span className="text-3xl">♦</span> {config.empresa}
            </div>
          </div>
          <div className="w-2/4 text-center">
            <h1 className="text-xl font-bold">{config.titulo}</h1>
            <p className="mt-2 text-lg font-semibold">Orden de Trabajo</p>
          </div>
          <div className="w-1/4 text-right flex flex-col items-end">
            <div className="text-[10px] text-gray-600">
              <p>{config.codigo}</p>
              <p>{config.revision}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
               <span className="font-bold">Folio:</span>
               <span className="text-xl font-bold text-red-600">{folioString}</span>
            </div>
             <p className="text-[10px] mt-1">
               del {data.fechaInicio} al {data.fechaFin}
             </p>
          </div>
        </div>

        {/* ... (El resto de tu código de actividades) ... */}
        {/* Simplemente omito el cuerpo para no hacer la respuesta muy larga, mantén tu código original aquí */}
        <div className="mb-4 space-y-1">
           {/* ... Tus datos generales ... */}
           <div className="mb-4 text-[11px] font-bold leading-5">
           {/* Fila 1: Responsable y Fecha */}
           <div className="flex justify-between items-end">
              <div className="uppercase">
                Responsable: <span className="font-normal ml-1">{data.responsable || ""}</span>
              </div>
              <div>
                Fecha de ejecución de la OT:
              </div>
           </div>

           {/* Fila 2: Generó */}
           <div className="mt-1 uppercase">
             Generó: <span className="font-normal ml-1">{data.genero || ""}</span>
           </div>

           {/* Fila 3: Revisó (Aquí estaba el problema, si está vacío mostramos línea) */}
           <div className="mt-1 uppercase">
             Revisó: <span className="font-normal ml-1">{data.reviso || ""}</span>
           </div>

           {/* Fila 4: Autorizó */}
           <div className="mt-1 uppercase">
             Autorizó: <span className="font-normal ml-1">{data.autorizo || ""}</span>
           </div>
        </div>
           {/* ... etc ... */}
        </div>

        {/* ... Código de la máquina ... */}
        <div className="border border-black p-2 font-bold mb-6 bg-gray-100 text-center">
          {data.maquina}
        </div>
        <div className="text-center italic underline font-bold mb-4">Actividades rutinarias</div>

        {/* ... Código de los grupos (map) ... */}
        <div className="space-y-8">
          {grupos.map((grupo) => (
             <div key={grupo.id} className="break-inside-avoid">
                {/* ... Renderizado del grupo ... */}
                 <h3 className="font-bold border-b border-gray-400 mb-2 mt-4 uppercase">
                  \ {grupo.nombre}: {config.titulo}
                </h3>
                {/* ... Renderizado actividades ... */}
                 <div className="pl-2 space-y-4">
                  <p className="italic text-gray-500 mb-1">Procedimiento:</p>
                  {grupo.actividades.map((act, idx) => (
                    <div key={act.id} className="mb-3">
                      <p className="mb-1">{idx + 1}.- {act.texto}</p>
                      <div className="flex gap-4 items-end text-[10px]">
                        <span>SI:_____</span>
                        <span>NO:_____</span>
                        <span className="w-full border-b border-gray-400">OBSERVACION:</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* ... Grid de dias ... */}
                 <div className="mt-4">
                   <div className="flex border border-black w-fit text-center">
                      {[22,23,24,25,26,27,28].map((dia, i) => (
                         <div key={i} className={`w-6 h-6 border-r border-black last:border-r-0 flex items-center justify-center ${i===1 ? 'text-red-500 font-bold' : ''}`}>
                            {i === 1 ? 'O' : ''}
                         </div>
                      ))}
                   </div>
                   <div className="flex gap-2 text-[10px] items-center mt-1">
                     <div className="flex text-[8px] gap-2 absolute -mt-8 ml-1 text-gray-500">
                        {[22,23,24,25,26,27,28].map(d => <span key={d} className="w-4">{d}</span>)}
                     </div>
                   </div>
                   <div className="mt-1 border-b border-gray-300 w-full pt-4 text-gray-400 text-[10px]">
                      Comentarios:
                   </div>
                </div>
             </div>
          ))}
        </div>

        {/* 4. AQUÍ ESTÁ EL CAMBIO CLAVE EN EL FOOTER */}
        <div className="fixed bottom-0 w-full text-center text-[10px] text-gray-500 hidden print:block">
           {/* Usamos la variable de estado 'fechaImpresion' en lugar de format(new Date()...) */}
           {fechaImpresion} - Página 1 de 1 - {config.codigo} {config.revision}
        </div>

      </div>
    );
  }
);

PrintFormat.displayName = "PrintFormat";