import { getWorkOrders, getMechanics } from "@/lib/actions/work-orders";
import { OrdersClient } from "@/components/orders/orders-client";

export default async function OrdersPage() {
    const [orders, mechanics] = await Promise.all([
        getWorkOrders(),
        getMechanics()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tablero de Órdenes</h2>
                    <p className="text-muted-foreground">
                        Gestión y seguimiento de mantenimientos correctivos.
                    </p>
                </div>
                {/* Aquí podrías poner un botón de filtros o exportar a Excel */}
            </div>

            <OrdersClient orders={orders} mechanics={mechanics} />
        </div>
    );
}