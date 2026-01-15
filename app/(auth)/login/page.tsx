"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GalleryVerticalEnd } from "lucide-react"; // O el icono de tu empresa

export default function LoginPage() {
    // Conectamos con la Server Action
    const [state, action, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
            
            {/* LOGO DE LA EMPRESA (Opcional) */}
            <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
            </div>
            TEFLU App
            </a>

            {/* TARJETA DEL FORMULARIO */}
            <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Bienvenido</CardTitle>
                <CardDescription>
                Ingresa tu número de nómina para continuar
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action}>
                <div className="grid gap-6">
                    
                    {/* Input Nómina */}
                    <div className="grid gap-2">
                    <Label htmlFor="nomina">Nómina</Label>
                    <Input
                        id="nomina"
                        name="nomina"
                        type="text"
                        placeholder="Ej. 12345"
                        required
                    />
                    </div>

                    {/* Input Password */}
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Contraseña</Label>
                        <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                        ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                    />
                    </div>

                    {/* Mensaje de Error (Si existe) */}
                    {state?.error && (
                    <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded-md border border-red-200">
                        ⚠️ {state.error}
                    </div>
                    )}

                    {/* Botón Submit */}
                    <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Validando..." : "Iniciar Sesión"}
                    </Button>
                </div>
                </form>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta? Contacta a RRHH.
            </CardFooter>
            </Card>
            
            {/* Footer Legal */}
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            Al hacer clic en continuar, aceptas nuestros <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
            </div>
        </div>
        </div>
    );
}