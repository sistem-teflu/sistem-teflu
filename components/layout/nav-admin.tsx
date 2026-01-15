"use client"

import {
  type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation" // <--- IMPORTAR

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavAdmin({
  admin, // O adminItems, como le llames
}: {
  admin: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const pathname = usePathname(); // <--- OBTENER RUTA

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Administración</SidebarGroupLabel>
      <SidebarMenu>
        {admin.map((item) => {
          // Verificar si es activo
          const isActive = pathname === item.url;
          
          return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={isActive}>
              <a href={item.url}>
                <item.icon className={isActive ? "text-blue-600" : ""} />
                <span className={isActive ? "font-bold" : ""}>{item.name}</span>
              </a>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        )})}
      </SidebarMenu>
    </SidebarGroup>
  )
}