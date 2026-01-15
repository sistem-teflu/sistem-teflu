import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "cmms-secreto-super-seguro");

export interface SessionPayload {
    userId: string;
    name: string;
    role: string;      // "ADMIN", "TECHNICIAN", etc.
    email: string;    // Agregamos nomina para mostrarla si es necesario
    exp?: number;
}

export async function createSession(payload: Omit<SessionPayload, "exp">) {
    const token = await new SignJWT(payload as any)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h") // Turno laboral
        .sign(SECRET_KEY);

    const cookieStore = await cookies();
    
    cookieStore.set("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // maxAge opcional, si no se pone es cookie de sesión
    });
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    if (!token) return null;
    return await verifySessionToken(token);
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session_token");
}