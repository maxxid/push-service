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
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.03]" style={{ backgroundColor: primaryColor }} />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-[0.03]" style={{ backgroundColor: primaryColor }} />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] opacity-30" />
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="animate-fade-in-up">
          {company?.logo && (
            <div className="inline-block mb-8 p-4 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/5">
              <img src={company.logo} alt={company.name} className="h-16 w-16 object-contain" />
            </div>
          )}

          {!company?.logo && company && (
            <div
              className="inline-flex items-center justify-center h-16 w-16 rounded-3xl text-white font-bold text-2xl shadow-xl mb-8"
              style={{ backgroundColor: primaryColor }}
            >
              {(company.name).charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]" style={{ color: primaryColor }}>
            {company?.portalTitle || `Recibí avisos de ${company?.name || "la institución"}`}
          </h1>

          <p className="text-lg text-[var(--muted-foreground)] mb-12 max-w-lg mx-auto leading-relaxed">
            {company?.portalDescription || "Activá las notificaciones para estar al día con comunicados, alertas y novedades. Directo en tu pantalla."}
          </p>
        </div>

        <div className="animate-fade-in stagger-2">
          {company ? (
            <PortalContent companyId={company.id} companyName={company.name} primaryColor={primaryColor} modules={activeModules} />
          ) : (
            <div className="max-w-md mx-auto rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-6">
              <p className="text-amber-700 dark:text-amber-300 text-sm">Configurá una empresa desde el panel admin para ver el portal.</p>
            </div>
          )}
        </div>

        {!company && (
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "📢", title: "Comunicados", desc: "Información oficial al instante" },
              { icon: "⚡", title: "Alertas Urgentes", desc: "Cambios importantes" },
              { icon: "📄", title: "Documentación", desc: "PDFs y formularios" },
            ].map((f, i) => (
              <div key={f.title}
                className={`animate-fade-in stagger-${i + 3} rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-xl mb-3 mx-auto">{f.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] text-sm">{f.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
