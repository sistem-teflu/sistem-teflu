// types/index.ts
export interface Actividad {
  id: string;
  texto: string;
}

export interface GrupoActividades {
  id: string;
  nombre: string; // Ej: "GABINETES ELECTRICOS"
  actividades: Actividad[];
}

export interface ConfiguracionHeader {
  empresa: string;
  titulo: string;
  codigo: string;
  revision: string;
  logoUrl: string; // En una app real, esto sería una URL de bucket
}

export interface OrdenTrabajo {
  folio: number; // El consecutivo
  responsable: string;
  genero: string;
  reviso: string;
  autorizo: string;
  maquina: string; // Ej: {D-236} DOBLADORA...
  fechaInicio: string;
  fechaFin: string;
}