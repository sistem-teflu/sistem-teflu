import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // --- PROTECCIÓN DE ARCHIVOS ESTÁTICOS (DOBLE SEGURIDAD) ---
    // Si la petición es para archivos internos de Next.js, déjala pasar.
    if (
        pathname.startsWith("/_next") || 
        pathname.startsWith("/static") || 
        pathname.includes(".") // Archivos con extensión (.css, .js, .png, etc)
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get("session_token")?.value;

    // 1. Lógica de Login (Si ya tiene sesión, mandar al dashboard)
    if (pathname === "/login") {
        if (token) {
            const payload = await verifySessionToken(token);
            if (payload) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }
        return NextResponse.next();
    }

    // 2. Protección de rutas privadas (/dashboard)
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const payload = await verifySessionToken(token);
        if (!payload) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("session_token");
            return response;
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

// === AQUÍ ESTÁ EL ARREGLO PRINCIPAL ===
export const config = {
    /*
     * Matcher: Ejecutar middleware en todas las rutas EXCEPTO:
     * 1. /api/ (rutas API)
     * 2. /_next/static (archivos estáticos JS/CSS)
     * 3. /_next/image (imágenes optimizadas)
     * 4. favicon.ico (icono)
     * 5. Archivos con extensión (png, jpg, svg, etc.)
     */
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};