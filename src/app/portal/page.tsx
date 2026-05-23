import { headers } from "next/headers"
import { getCompanyFromHeaders } from "@/lib/company-context"
import { prisma } from "@/lib/prisma"
import { PortalContent } from "@/components/portal/portal-content"

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
  if (!company) {
    company = await prisma.company.findFirst({ orderBy: { createdAt: "asc" } })
  }

  const primaryColor = company?.primaryColor ?? "#1a56db"
  const activeModules: string[] = (company?.modules as string[]) ?? []

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-32 text-center">
      <div className="animate-fade-in-up">
        {company?.logo && (
          <img
            src={company.logo}
            alt={company.name}
            className="h-20 w-20 mx-auto mb-6 rounded-2xl object-contain bg-white p-2 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
          />
        )}

        <h1
          className="text-4xl font-extrabold tracking-tight mb-4 leading-tight"
          style={{ color: primaryColor }}
        >
          {company?.portalTitle ||
            `Recibí avisos importantes de ${company?.name || "la institución"}`}
        </h1>

        <p className="text-lg text-[var(--muted-foreground)] mb-12 max-w-xl mx-auto leading-relaxed">
          {company?.portalDescription ||
            "Activá las notificaciones para estar al día con comunicados, alertas y novedades. Directo en tu pantalla, sin instalar nada."}
        </p>
      </div>

      <div className="animate-fade-in stagger-2">
        {company ? (
          <PortalContent
            companyId={company.id}
            companyName={company.name}
            primaryColor={primaryColor}
            modules={activeModules}
          />
        ) : (
          <div className="max-w-md mx-auto rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-6">
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Configurá una empresa desde el panel admin y accedé desde su subdominio para ver el portal personalizado.
            </p>
          </div>
        )}
      </div>

      {!company && (
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "📢", title: "Comunicados", desc: "Información oficial al instante" },
            { icon: "⚡", title: "Alertas Urgentes", desc: "Enterate de cambios importantes" },
            { icon: "📄", title: "Documentación", desc: "Accedé a PDFs y formularios" },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-in stagger-${i + 3} rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
            >
              <p className="text-3xl mb-3">{f.icon}</p>
              <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)]">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
