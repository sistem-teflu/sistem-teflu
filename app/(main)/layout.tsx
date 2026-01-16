import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"; 
import { NotificationBell } from "@/components/layout/notification-bell"
import { PushInitializer } from "@/components/layout/push-initializer";

export default async function MainLayout({children,}: {children: React.ReactNode}) {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    const user = {
        name: session.name,
        email: session.email,
        avatar: "/user.jpg",
    }

    return (
        <SidebarProvider>
            <PushInitializer /> 
            <AppSidebar user={user} />
            <SidebarInset className="relative flex flex-col h-screen overflow-hidden">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 cursor-pointer" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">Sistema</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Panel de Control</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    {/* --- PARTE DERECHA (Notificaciones y Tema) --- */}
                    <div className="ml-auto flex items-center gap-2">
                        <NotificationBell userId={session.userId} />
                        <ModeToggle />
                    </div>
                </header>
                {/* CONTENIDO CON SCROLL */}
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}