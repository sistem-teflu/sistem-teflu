// data/sidebar-data.ts
import {
    Activity,
    Hammer,
    HardHat,
    Wrench,
    Users,
    ShieldCheck,
    MonitorCog,
    Tag,
    ClipboardList,
} from "lucide-react"

export const sidebarData = {
    navMain: [
        {
            title: "OEE",
            url: "#", // La carpeta padre no necesita link si es colapsable
            icon: Activity,
            items: [
                {
                    title: "Dashboard",
                    url: "/oee/dashboard", // Coincide con app/(main)/oee/dashboard/page.tsx
                },
                {
                    title: "Demoras",
                    url: "/oee/demoras",
                },
                {
                    title: "Eficiencia",
                    url: "/oee/eficiencia",
                },
                {
                    title: "SCRAP",
                    url: "/oee/scrap",
                },
            ],
        },
        {
            title: "Herramentales",
            url: "#",
            icon: Hammer,
            items: [
                {
                    title: "Plantilla Actividades",
                    url: "/herramentales/actividades",
                },
                {
                    title: "Preventivos",
                    url: "/herramentales/preventivos",
                },
                {
                    title: "Inventario",
                    url: "/herramentales/inventario",
                },
                {
                    title: "Herramentales",
                    url: "/herramentales/catalogo",
                },
            ],
        },
        {
            title: "Producción",
            url: "#",
            icon: HardHat,
            items: [
                {
                    title: "Captura",
                    url: "/produccion/captura",
                },
                {
                    title: "Crear orden",
                    url: "/produccion/crear-orden",
                },
                {
                    title: "Documentación",
                    url: "/produccion/documentacion",
                },
                {
                    title: "Programa",
                    url: "/produccion/programa",
                },
                {
                    title: "Reportes",
                    url: "/produccion/reportes",
                },
            ],
        },
        {
            title: "Mantenimiento",
            url: "#",
            icon: Wrench,
            items: [
                {
                    title: "Órdenes",
                    url: "/mantenimiento/ordenes",
                },
                {
                    title: "Preventivos",
                    url: "/mantenimiento/preventivos",
                },
                {
                    title: "Refacciones",
                    url: "/mantenimiento/refacciones",
                },
                {
                    title: "Inventarios",
                    url: "/mantenimiento/inventarios",
                },
                {
                    title: "Calendario",
                    url: "/mantenimiento/calendario",
                },
            ],
        },
        {
            title: "Mis Tareas",
            url: "#",
            icon: ClipboardList, // Un icono que resalte
            items: [
                {
                    title: "Ver tareas",
                    url: "/mis-tareas",
                }
            ],
        },
    ],
    admin: [
        {
            name: "Usuarios",
            url: "/admin/usuarios",
            icon: Users,
        },
        {
            name: "Roles",
            url: "/admin/roles",
            icon: ShieldCheck,
        },
        {
            name: "Máquinas",
            url: "/admin/maquinas",
            icon: MonitorCog,
        },
        {
            name: "N. Parte",
            url: "/admin/numeros-parte",
            icon: Tag,
        },
    ],
}