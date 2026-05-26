import { prisma } from "@/lib/prisma"
import type { LandingBlock } from "@/components/portal/landing-blocks"
import { headers } from "next/headers"
import { BlockPreview } from "@/components/portal/landing-preview"
import { ShareButton } from "@/components/portal/share-button"
import { DownloadButton } from "@/components/portal/download-button"
import { ActiveLandingsTrigger } from "@/components/portal/active-landings-trigger"

export const dynamic = "force-dynamic"

export default async function PublicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const headersList = await headers()
  const subdomain = headersList.get("x-company-subdomain")

  const page = await prisma.landingPage.findFirst({
    where: { slug, published: true, company: subdomain ? { subdomain } : undefined },
    include: { company: true },
  })

  if (page) {
    await prisma.landingPage.update({
      where: { id: page.id },
      data: { views: { increment: 1 } },
    })
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center">
            <svg className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Página no encontrada</h1>
          <p className="text-sm text-slate-400">Esta landing no existe o no está publicada.</p>
        </div>
      </div>
    )
  }

  const blocks = (page.content as LandingBlock[]) || []
  const company = page.company
  const primaryColor = company?.primaryColor ?? "#1a56db"
  const date = new Date(page.createdAt)
  const readTime = Math.max(1, Math.ceil(JSON.stringify(blocks).length / 800))
  const isExpired = page.expiresAt && new Date(page.expiresAt) < new Date()
  const expireDate = page.expiresAt ? new Date(page.expiresAt) : null

  if (isExpired) {
    return (
      <div id="landing-content" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center">
            <svg className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Esta landing ya no está disponible</h1>
          <p className="text-sm text-slate-400">
            Fue publicada el {date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })} y venció el {expireDate!.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
          {company && (
            company.whatsappNumber ? (
              <a href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/>
                </svg>
                <span className="text-sm text-slate-500">{company.name}</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: primaryColor }}>
                  {(company.name || "P").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-500">{company.name}</span>
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div id="landing-content" style={{ colorScheme: "dark" }}>
      {/* Hero Section */}
      <div className="relative">
        {/* Subtle gradient bar at top */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}40, transparent)` }} />

        <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
          {/* Metadata row */}
          <div className="flex items-center gap-3 mb-6 text-xs animate-fade-in">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              Comunicado
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              {date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="text-slate-300 text-slate-600">·</span>
            <span className="text-slate-400 dark:text-slate-500">{readTime} min de lectura</span>
            {page.published && (
              <>
                <span className="text-slate-300 text-slate-600">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Publicado</span>
              </>
            )}
          </div>

          {/* Title */}
          <div className="flex items-start gap-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h1 className="flex-1 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              {page.title}
            </h1>
            <div className="flex gap-1.5">
              {company?.showDownload !== false && <DownloadButton filename={page.title} />}
              {company?.showShare !== false && <ShareButton landingId={page.id} />}
            </div>
          </div>

          {/* Branding footer of hero */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-800 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {company?.logo ? (
              <img src={company.logo} alt={company.name} className="h-8 w-8 rounded-lg object-contain bg-white dark:bg-slate-800 p-0.5 ring-1 ring-black/5 dark:ring-white/10" />
            ) : (
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: primaryColor }}>
                {(company?.name || "P").charAt(0).toUpperCase()}
              </div>
            )}
            <div id="landing-content">
              <p className="text-sm font-semibold text-zinc-800 dark:text-slate-200">{company?.name || "Institución"}</p>
              <p className="text-xs text-slate-500">Comunicación institucional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        {blocks.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-400 dark:text-slate-500 text-sm">Sin contenido aún</p>
          </div>
        ) : (
          <div className="space-y-8">
            {blocks.map((block, i) => (
              <div
                key={block.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.3 + i * 0.08}s` }}
              >
                <BlockPreview block={block} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800">
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
              <span className="text-sm text-slate-500">{company?.name || "Plataforma"}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: primaryColor }}>
                {(company?.name || "P").charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-500">{company?.name || "Plataforma"}</span>
            </div>
          )}
          {company && (
            <ActiveLandingsTrigger subdomain={company.subdomain} />
          )}
        </div>
      </div>
    </div>
  )
}
