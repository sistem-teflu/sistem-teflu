"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveUser } from "@/lib/actions/users";
import { Plus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface UserDialogProps {
    user?: any;
    roles: any[]; // Lista de roles para el select
    trigger?: React.ReactNode;
}

export function UserDialog({ user, roles, trigger }: UserDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // handleSubmit manual para manejar FormData y Toast
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        if (user?.iduser) formData.append("iduser", user.iduser);

        const result = await saveUser(null, formData);
        
        setLoading(false);
        if (result?.success) {
            setOpen(false);
            toast.success(result.message);
        } else {
            toast.error(result?.error || "Error al guardar");
        }
    };

    const defaultBirthday = user?.cumple 
        ? new Date(user.cumple).toISOString().split('T')[0] 
        : "";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button className="cursor-pointer" suppressHydrationWarning={true}><Plus className="mr-2 h-4 w-4" /> Nuevo Usuario</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{user ? "Editar Usuario" : "Registrar Nuevo Usuario"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Columna Izquierda */}
                    <div className="space-y-2">
                        <Label>Nómina</Label>
                        <Input name="nomina" defaultValue={user?.nomina} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Rol</Label>
                        <Select name="roleId" defaultValue={user?.roleId?.toString()} required>
                            <SelectTrigger className="cursor-pointer"><SelectValue placeholder="Selecciona un rol"/></SelectTrigger>
                            <SelectContent>
                                {roles.map(r => (
                                    <SelectItem className="cursor-pointer" key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input name="name" defaultValue={user?.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Apellidos</Label>
                        <Input name="apellidos" defaultValue={user?.apellidos} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Fecha de Cumpleaños</Label>
                        <Input 
                            name="cumple" 
                            type="date" 
                            defaultValue={defaultBirthday}
                            className="cursor-pointer"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Puesto</Label>
                        <Input name="puesto" defaultValue={user?.puesto} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Departamento</Label>
                        <Input name="departamento" defaultValue={user?.departamento} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Correo</Label>
                        <Input name="email" type="email" defaultValue={user?.email} />
                    </div>
                    <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input name="numero" defaultValue={user?.numero} />
                    </div>

                    <div className="col-span-2 border-t pt-4 mt-2">
                        <Label className="mb-2 block font-bold">Seguridad</Label>
                        <div className="space-y-2">
                            <Label>Contraseña {user && "(Dejar vacía para mantener la actual)"}</Label>
                            <Input name="password" type="password" required={!user} /> 
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end gap-2 pt-4">
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button className="cursor-pointer" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}