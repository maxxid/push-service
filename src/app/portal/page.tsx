import { Button } from "@/components/ui/button"

export default function PortalPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-zinc-900 mb-4">
        Recibí avisos importantes de la institución
      </h1>
      <p className="text-zinc-500 mb-8 max-w-md mx-auto">
        Activá las notificaciones para estar al día con comunicados, alertas y
        novedades de tu institución. Directo en tu pantalla.
      </p>

      <form className="max-w-sm mx-auto space-y-4">
        <Button className="w-full" size="lg">
          Activar notificaciones
        </Button>
        <p className="text-xs text-zinc-400">
          No enviamos spam. Solo avisos institucionales importantes.
        </p>
      </form>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-zinc-50 rounded-xl p-4">
          <p className="text-2xl mb-2">📢</p>
          <h3 className="font-semibold text-zinc-900 text-sm">Comunicados</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Información oficial al instante
          </p>
        </div>
        <div className="bg-zinc-50 rounded-xl p-4">
          <p className="text-2xl mb-2">⚡</p>
          <h3 className="font-semibold text-zinc-900 text-sm">Alertas Urgentes</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Enterate de cambios importantes
          </p>
        </div>
        <div className="bg-zinc-50 rounded-xl p-4">
          <p className="text-2xl mb-2">📄</p>
          <h3 className="font-semibold text-zinc-900 text-sm">Documentación</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Accedé a PDFs y formularios
          </p>
        </div>
      </div>
    </div>
  )
}
