import { headers } from "next/headers"
import { getCompanyFromHeaders } from "@/lib/company-context"
import { prisma } from "@/lib/prisma"
import { PortalContent } from "@/components/portal/portal-content"
import { DiagnosticTrigger } from "@/components/portal/diagnostic-trigger"

export const dynamic = "force-dynamic"

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const headersList = await headers()
  const subdomain = headersList.get("x-company-subdomain")
  const { company: companyParam } = await searchParams

  let company = await getCompanyFromHeaders(subdomain)
  if (!company && companyParam) {
    company = await prisma.company.findFirst({
      where: { OR: [{ slug: companyParam }, { subdomain: companyParam }] },
    })
  }
  if (!company) company = await prisma.company.findFirst({ orderBy: { createdAt: "asc" } })

  const primaryColor = company?.primaryColor ?? "#1a56db"
  const activeModules: string[] = (company?.modules as string[]) ?? []

  return (
    <div>
      {/* Subtle gradient bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}40, transparent)` }} />

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          {company?.logo ? (
            <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-slate-900 shadow-sm ring-1 ring-white/5">
              <img src={company.logo} alt={company.name} className="h-14 w-14 object-contain" />
            </div>
          ) : company ? (
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl text-white font-bold text-xl shadow-sm mb-8"
              style={{ backgroundColor: primaryColor }}>
              {company.name.charAt(0).toUpperCase()}
            </div>
          ) : null}

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
            {company?.portalTitle || `Recibí avisos de ${company?.name || "la institución"}`}
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            {company?.portalDescription || "Activá las notificaciones para estar al día con comunicados, alertas y novedades. Directo en tu pantalla."}
          </p>
        </div>

        {/* CTA */}
        <div className="max-w-md mx-auto mb-16 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          {company ? (
            <PortalContent
              companyId={company.id}
              companyName={company.name}
              primaryColor={primaryColor}
              modules={activeModules}
              whatsappNumber={company.whatsappNumber ?? null}
            />
          ) : (
            <div className="rounded-2xl border border-amber-800 bg-amber-950 p-6 text-center">
              <p className="text-amber-300 text-sm">
                Configurá una empresa desde el panel admin para ver el portal personalizado.
              </p>
            </div>
          )}
        </div>

        {/* Feature cards */}
        {!company && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: "📢", title: "Comunicados", desc: "Información oficial al instante" },
              { icon: "⚡", title: "Alertas Urgentes", desc: "Enterate de cambios importantes" },
              { icon: "📄", title: "Documentación", desc: "Accedé a PDFs y formularios" },
            ].map(f => (
              <div key={f.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center hover:shadow-sm transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg mb-3 mx-auto">{f.icon}</div>
                <h3 className="font-semibold text-sm text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Diagnostic */}
        <div className="max-w-md mx-auto mb-16">
          <DiagnosticTrigger />
        </div>

        {/* Divider */}
        <hr className="my-10 border-slate-800" />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          {company?.whatsappNumber ? (
            <a
              href={`https://wa.me/${company.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/>
              </svg>
              <span className="text-sm text-slate-500">
                {company?.headerTitle || company?.name || "Plataforma de Comunicación"}
              </span>
            </a>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: primaryColor }}>
                {(company?.name || "P").charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-500">
                {company?.headerTitle || company?.name || "Plataforma de Comunicación"}
              </span>
            </div>
          )}
          <p className="text-xs text-slate-600">
            Sin spam. Solo avisos importantes.
          </p>
        </div>
      </footer>
    </div>
  )
}
