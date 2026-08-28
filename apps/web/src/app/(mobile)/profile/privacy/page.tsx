'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Download, Trash2, Shield, AlertTriangle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { toast } from '@/components/ui/toaster'

export default function PrivacySettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setExporting(false)
    toast.success('Tus datos han sido exportados. Te los enviaremos por email.')
  }

  const handleDelete = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      toast.error('Escribe ELIMINAR para confirmar')
      return
    }
    toast.success('Solicitud de eliminación recibida. Tu cuenta se eliminará en 30 días.')
    setShowDeleteConfirm(false)
    setDeleteConfirmText('')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top sticky top-0 z-20 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/profile/settings" className="touch-target -ml-2 flex items-center justify-center rounded-full">
            <ChevronLeft className="h-6 w-6 text-charcoal" />
          </Link>
          <h1 className="font-display text-xl font-extrabold text-charcoal">Privacidad y datos</h1>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* GDPR Rights */}
        <div className="rounded-2xl border border-border bg-surface-alt p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <p className="font-bold text-charcoal">Tus derechos (RGPD/GDPR)</p>
              <p className="mt-1 text-sm text-muted">
                Tienes derecho a acceder, rectificar, exportar y eliminar tus datos personales.
              </p>
              <Link href="/privacy" className="mt-2 inline-block text-sm font-semibold text-primary">
                Ver política de privacidad →
              </Link>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="card-app p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Download className="h-5 w-5 text-info" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-charcoal">Export my data</p>
              <p className="mt-0.5 text-sm text-muted">
                Descarga una copia de todos tus datos (perfil, pedidos, direcciones).
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                loading={exporting}
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Solicitar exportación
              </Button>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="card-app p-4 border-danger/30">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
              <Trash2 className="h-5 w-5 text-danger" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-danger">Remove mi cuenta</p>
              <p className="mt-0.5 text-sm text-muted">
                Esta acción es irreversible. Se eliminarán todos tus datos en 30 días.
                Los datos de pedidos necesarios para obligaciones fiscales se conservarán
                según la ley.
              </p>
              <Button
                variant="danger"
                size="sm"
                className="mt-3"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                Solicitar eliminación
              </Button>
            </div>
          </div>
        </div>

        {/* What we store */}
        <div className="card-app p-4">
          <h3 className="font-bold text-charcoal">Qué datos almacenamos</h3>
          <div className="mt-3 space-y-2">
            {[
              'Nombre, email y teléfono',
              'Addresses de entrega',
              'Historial de pedidos',
              'Preferencias de notificaciones',
              'Token de dispositivo (FCM)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-muted">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface-alt p-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs text-muted">
              No almacenamos datos de tarjetas, contraseñas en texto plano, ni datos innecesarios.
            </p>
          </div>
        </div>
      </div>

      {/* Delete confirmation sheet */}
      <Sheet open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar eliminación">
        <div className="space-y-4">
          <div className="rounded-xl bg-danger/10 p-4">
            <AlertTriangle className="h-6 w-6 text-danger" />
            <p className="mt-2 text-sm font-semibold text-danger">
              Esta acción es irreversible
            </p>
            <p className="mt-1 text-sm text-muted">
              Se eliminarán permanentemente tu cuenta, pedidos, direcciones y favoritos.
              El proceso se completa en 30 días.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">
              Escribe <span className="font-bold text-danger">ELIMINAR</span> para confirmar:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="mt-2 h-12 w-full rounded-xl border-2 border-danger/30 bg-surface px-4 text-sm uppercase focus:border-danger focus:outline-none"
            />
          </div>
          <Button variant="danger" fullWidth onClick={handleDelete}>
            Remove mi cuenta
          </Button>
          <Button variant="outline" fullWidth onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
