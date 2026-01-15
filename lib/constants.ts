export const APP_MODULES = [
    "OEE",
    "HERRAMENTALES",
    "PRODUCCION",
    "MANTENIMIENTO",
    "USUARIOS",
    "ROLES",
    "MAQUINAS",
    "NUMEROS_PARTE",
] as const;

export type AppModule = typeof APP_MODULES[number];

export const ROLES_WITH_FULL_ACCESS = ["SUPERADMIN", "ADMIN", "RH"];

export const MACHINE_STATUSES = [
    { label: "Disponible", value: "DISPONIBLE", color: "bg-green-500" },
    { label: "En Mantenimiento", value: "MANTENIMIENTO", color: "bg-red-600" },
    { label: "Sin Programa", value: "SIN_PROGRAMA", color: "bg-yellow-500" },
    { label: "Falta de Personal", value: "FALTA_PERSONAL", color: "bg-orange-500" },
    { label: "Cambio No. Parte (CNP)", value: "CNP", color: "bg-blue-500" },
    { label: "En Paro", value: "PARO", color: "bg-gray-700" },
] as const;

export const ORDER_STATUSES = {
    PENDIENTE: { label: "Pendiente", color: "bg-red-500", border: "border-red-200" },
    ASIGNADA: { label: "Asignada", color: "bg-blue-500", border: "border-blue-200" },
    EN_PROCESO: { label: "En Proceso", color: "bg-yellow-500", border: "border-yellow-200" },
    POR_VALIDAR: { label: "Por Validar", color: "bg-orange-500", border: "border-orange-200" },
    CERRADA: { label: "Cerrada", color: "bg-green-700", border: "border-green-200" },
    TERMINADA: { label: "Terminada", color: "bg-green-600", border: "border-green-200" },
    CANCELADA: { label: "Cancelada", color: "bg-gray-500", border: "border-gray-200" },
};

// Roles que pueden validar entregas y ver notificaciones de término
export const VALIDATOR_ROLES = [
    "SUPERADMIN", 
    "ADMIN", 
    "SUP. MANTENIMIENTO", 
    "SUP. PRODUCCION", 
    "GERENTE"
];