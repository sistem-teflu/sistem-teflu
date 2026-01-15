"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react" // Importamos Hooks

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Calculamos si debería estar activo
          const isChildActive = item.items?.some(subItem => pathname === subItem.url);
          
          return (
            <CollapsibleItem 
              key={item.title} 
              item={item} 
              isChildActive={!!isChildActive} 
              pathname={pathname} 
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// --- SUB-COMPONENTE PARA AISLAR LA LÓGICA DE HIDRATACIÓN ---
// Esto soluciona el error de IDs duplicados/mismatch
function CollapsibleItem({ item, isChildActive, pathname }: { item: any, isChildActive: boolean, pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            isActive={isChildActive}
            className={isChildActive ? "font-bold text-blue-600" : ""}
            suppressHydrationWarning={true} // <--- AGREGAR ESTO
          >
            {item.icon && <item.icon className={isChildActive ? "text-blue-600" : ""} />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem: any) => {
              const isSubItemActive = pathname === subItem.url;
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                    <a href={subItem.url}>
                      <span>{subItem.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}