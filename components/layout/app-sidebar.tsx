"use client"

import Image from "next/image"
import * as React from "react"
import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user" // Tu componente actualizado
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { sidebarData } from "@/data/sidebar-data"
import { NavAdmin } from "./nav-admin"

// Definimos los props que recibe el componente
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar?: string;
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
         {/* Tu logo aquí */}
        <div className="flex items-center justify-center py-2">
          <Image 
            src="/logo-sm.png" 
            alt="Logo Empresa"
            width={80}
            height={40}
            className="object-contain" // Ayuda a mantener la proporción
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavAdmin admin={sidebarData.admin} />
        {/* Aquí puedes agregar NavProjects si lo usas */}
      </SidebarContent>
      <SidebarFooter>
        {/* PASAMOS EL USUARIO REAL AQUÍ */}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


