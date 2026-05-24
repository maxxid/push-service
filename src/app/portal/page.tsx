import { headers } from "next/headers"
import { getCompanyFromHeaders } from "@/lib/company-context"
import { prisma } from "@/lib/prisma"
import { PortalContent } from "@/components/portal/portal-content"

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
    <div className="min-h-screen">
      {/* Subtle gradient bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}40, transparent)` }} />

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          {company?.logo ? (
            <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
              <img src={company.logo} alt={company.name} className="h-14 w-14 object-contain" />
            </div>
          ) : company ? (
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl text-white font-bold text-xl shadow-sm mb-8"
              style={{ backgroundColor: primaryColor }}>
              {company.name.charAt(0).toUpperCase()}
            </div>
          ) : null}

          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.1] mb-4">
            {company?.portalTitle || `Recibí avisos de ${company?.name || "la institución"}`}
          </h1>

          <p className="text-lg text-zinc-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
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
            />
          ) : (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-6 text-center">
              <p className="text-amber-700 dark:text-amber-300 text-sm">
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
                className="rounded-2xl border border-zinc-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center hover:shadow-sm transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-slate-800 flex items-center justify-center text-lg mb-3 mx-auto">{f.icon}</div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <hr className="my-20 border-zinc-100 dark:border-slate-800" />
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: primaryColor }}>
              {(company?.name || "P").charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-zinc-500 dark:text-slate-500">
              {company?.headerTitle || company?.name || "Plataforma de Comunicación"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-slate-600">
            Sin spam. Solo avisos importantes.
          </p>
        </div>
      </footer>
    </div>
  )
}
