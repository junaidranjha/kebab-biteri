import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <h1 className="font-display text-xl font-extrabold text-charcoal">Privacidad</h1>
        </div>
      </header>
      <div className="px-5 py-4">
        <article className="prose prose-sm max-w-none text-charcoal">
          <h2 className="font-display text-lg font-bold">Política de Privacidad</h2>
          <p className="text-sm text-muted">Última actualización: agosto 2026</p>

          <h3 className="mt-5 font-bold">1. Responsable del tratamiento</h3>
          <p className="text-sm text-muted">
            Kebab Biteri S.L., con domicilio en Calle Gran Vía 45, 28013 Madrid, España.
            Contacto: hola@kebabbiteri.com
          </p>

          <h3 className="mt-5 font-bold">2. Datos que recopilamos</h3>
          <ul className="text-sm text-muted">
            <li><strong>Datos de cuenta:</strong> nombre, email, teléfono</li>
            <li><strong>Addresses de entrega:</strong> calle, ciudad, código postal</li>
            <li><strong>Orders:</strong> historial de pedidos y preferencias</li>
            <li><strong>Datos de dispositivo:</strong> token FCM para notificaciones</li>
          </ul>
          <p className="text-sm text-muted">No recopilamos datos innecesarios ni vendemos tus datos.</p>

          <h3 className="mt-5 font-bold">3. Finalidad del tratamiento</h3>
          <ul className="text-sm text-muted">
            <li>Gestionar pedidos y entregas</li>
            <li>Procesar pagos de forma segura</li>
            <li>Send notificaciones de estado de pedido</li>
            <li>Notifications marketing (solo con tu consentimiento)</li>
          </ul>

          <h3 className="mt-5 font-bold">4. Tus derechos (GDPR)</h3>
          <ul className="text-sm text-muted">
            <li>Acceso a tus datos</li>
            <li>Rectificación de datos incorrectos</li>
            <li>Supresión de tu cuenta ("derecho al olvido")</li>
            <li>Exportación de tus datos</li>
            <li>Oposición al tratamiento</li>
            <li>Retirada del consentimiento en cualquier momento</li>
          </ul>

          <h3 className="mt-5 font-bold">5. Marketing</h3>
          <p className="text-sm text-muted">
            Solo enviaremos notificaciones de marketing si has dado tu consentimiento.
            Puedes desactivarlas en cualquier momento desde Settings → Notifications.
          </p>

          <h3 className="mt-5 font-bold">6. Eliminación de cuenta</h3>
          <p className="text-sm text-muted">
            Puedes solicitar la eliminación de tu cuenta y todos tus datos desde
            Settings → Privacidad → Remove cuenta. El proceso se completa en 30 días.
          </p>

          <h3 className="mt-5 font-bold">7. Reclamaciones</h3>
          <p className="text-sm text-muted">
            Puedes presentar una reclamación ante la Agencia Spanisha de Protección de Datos (AEPD)
            en www.aepd.es si consideras que tus derechos han sido vulnerados.
          </p>
        </article>
      </div>
    </div>
  )
}
