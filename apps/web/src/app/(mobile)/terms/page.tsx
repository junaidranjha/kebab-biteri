import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <h1 className="font-display text-xl font-extrabold text-charcoal">Términos</h1>
        </div>
      </header>
      <div className="px-5 py-4">
        <article className="prose prose-sm max-w-none">
          <h2 className="font-display text-lg font-bold text-charcoal">Términos y Condiciones</h2>
          <p className="text-sm text-muted">Última actualización: agosto 2026</p>

          <h3 className="mt-5 font-bold text-charcoal">1. Aceptación</h3>
          <p className="text-sm text-muted">
            Al usar la aplicación Kebab Biteri, aceptas estos términos y condiciones.
          </p>

          <h3 className="mt-5 font-bold text-charcoal">2. Orders</h3>
          <p className="text-sm text-muted">
            All los precios están en euros (€) e incluyen IVA. Los precios son validados
            en el servidor antes de confirmar el pedido. Nos reservamos el derecho de rechazar
            pedidos por motivos operativos.
          </p>

          <h3 className="mt-5 font-bold text-charcoal">3. Payments</h3>
          <p className="text-sm text-muted">
            Los pagos se procesan de forma segura a través de proveedores certificados
            (Stripe, Redsys, Bizum). No almacenamos datos de tarjetas.
          </p>

          <h3 className="mt-5 font-bold text-charcoal">4. Deliverys</h3>
          <p className="text-sm text-muted">
            Los tiempos de entrega son estimados. Las zonas de entrega están determinadas
            por el radio de cada sucursal. El pedido mínimo puede variar según la sucursal.
          </p>

          <h3 className="mt-5 font-bold text-charcoal">5. Cancelaciones</h3>
          <p className="text-sm text-muted">
            Puedes cancelar un pedido antes de que el restaurante lo acepte.
            Una vez en preparación, la cancelación puede no ser posible.
          </p>

          <h3 className="mt-5 font-bold text-charcoal">6. Responsabilidad</h3>
          <p className="text-sm text-muted">
            Kebab Biteri no se responsabiliza de retrasos por causas de fuerza mayor,
            incluyendo condiciones meteorológicas o problemas de tráfico.
          </p>

          <h3 className="mt-5 font-bold text-charcoal">7. Ley aplicable</h3>
          <p className="text-sm text-muted">
            Estos términos se rigen por la legislación española. Cualquier disputa
            se resolverá ante los tribunales de Madrid.
          </p>
        </article>
      </div>
    </div>
  )
}
