import { headers } from "next/headers"
import { getCompanyFromHeaders } from "@/lib/company-context"
import { NotificationPrompt } from "@/components/portal/notification-prompt"

export default async function PortalPage() {
  const headersList = await headers()
  const subdomain = headersList.get("x-company-subdomain")
  const company = await getCompanyFromHeaders(subdomain)

  const primaryColor = company?.primaryColor ?? "#1a56db"

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
        Recibí avisos importantes de{" "}
        {company?.name ? company.name : "la institución"}
      </h1>
      <p className="text-zinc-500 mb-8 max-w-md mx-auto">
        Activá las notificaciones para estar al día con comunicados, alertas y
        novedades. Directo en tu pantalla, sin instalar nada.
      </p>

      {company ? (
        <div className="max-w-sm mx-auto">
          <NotificationPrompt
            companyId={company.id}
            companyName={company.name}
            primaryColor={primaryColor}
          />
        </div>
      ) : (
        <div className="max-w-sm mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-700 text-sm">
            Configurá una empresa desde el panel admin y accedé desde su
            subdominio para ver el portal personalizado.
          </p>
        </div>
      )}

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
