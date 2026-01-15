"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_MODULES } from "@/lib/constants";
import { saveRole } from "@/lib/actions/roles";
import { Plus, Loader2, Save } from "lucide-react";
import { toast } from "sonner"; // Si tienes sonner, o usa alert()

interface PermissionRow {
    module: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

interface RoleDialogProps {
    role?: any; // Si viene, es edición. Si no, es crear.
    trigger?: React.ReactNode;
}

export function RoleDialog({ role, trigger }: RoleDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [permissions, setPermissions] = useState<PermissionRow[]>([]);

    // Inicializar estado cuando se abre el modal
    useEffect(() => {
        if (open) {
        setName(role?.name || "");
        
        // Inicializar tabla de permisos
        const initialPermissions = APP_MODULES.map((module) => {
            // Buscar si el rol ya tiene permisos guardados para este módulo
            const existing = role?.permissions?.find((p: any) => p.module === module);
            return {
            module,
            canView: existing?.canView || false,
            canCreate: existing?.canCreate || false,
            canEdit: existing?.canEdit || false,
            canDelete: existing?.canDelete || false,
            };
        });
        setPermissions(initialPermissions);
        }
    }, [open, role]);

    const togglePermission = (index: number, field: keyof PermissionRow) => {
        const newPermissions = [...permissions];
        // @ts-ignore
        newPermissions[index][field] = !newPermissions[index][field];
        setPermissions(newPermissions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        if (role?.id) formData.append("id", role.id.toString());
        formData.append("name", name);
        formData.append("permissions", JSON.stringify(permissions));

        const result = await saveRole(null, formData);

        setLoading(false);
        if (result?.success) {
            setOpen(false);
            // Mensaje dinámico según si es crear o editar
            toast.success(role ? "Rol actualizado correctamente" : "Rol creado exitosamente");
        } else {
            toast.error(result?.error || "Error al guardar el rol");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {trigger || <Button suppressHydrationWarning={true}><Plus className="mr-2 h-4 w-4" /> Nuevo Rol</Button>}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>{role ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Nombre del Rol</Label>
                <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ej. Supervisor de Mantenimiento"
                required 
                />
            </div>

            <div className="border rounded-md">
                <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                    <tr>
                    <th className="px-4 py-3">Módulo</th>
                    <th className="px-4 py-3 text-center">Ver</th>
                    <th className="px-4 py-3 text-center">Crear</th>
                    <th className="px-4 py-3 text-center">Editar</th>
                    <th className="px-4 py-3 text-center">Eliminar</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {permissions.map((p, i) => (
                    <tr key={p.module} className="hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{p.module}</td>
                        
                        {/* Checkbox VER */}
                        <td className="px-4 py-3 text-center">
                        <Checkbox 
                            checked={p.canView} 
                            onCheckedChange={() => togglePermission(i, 'canView')} 
                        />
                        </td>
                        
                        {/* Checkbox CREAR */}
                        <td className="px-4 py-3 text-center">
                        <Checkbox 
                            checked={p.canCreate} 
                            onCheckedChange={() => togglePermission(i, 'canCreate')} 
                        />
                        </td>
                        
                        {/* Checkbox EDITAR */}
                        <td className="px-4 py-3 text-center">
                        <Checkbox 
                            checked={p.canEdit} 
                            onCheckedChange={() => togglePermission(i, 'canEdit')} 
                        />
                        </td>
                        
                        {/* Checkbox ELIMINAR */}
                        <td className="px-4 py-3 text-center">
                        <Checkbox 
                            checked={p.canDelete} 
                            onCheckedChange={() => togglePermission(i, 'canDelete')} 
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Guardar Rol
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
}