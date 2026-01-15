export default function DashboardPage() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-4">
      {/* Contenido único del Dashboard */}
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
        Gráfica 1
      </div>
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
        Gráfica 2
      </div>
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
        Estadísticas
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:col-span-3 p-10 text-center text-muted-foreground">
        Listado de Órdenes de Trabajo Recientes...
      </div>
    </div>
  )
}