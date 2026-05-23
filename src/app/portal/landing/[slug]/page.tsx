import { prisma } from "@/lib/prisma"
import type { LandingBlock } from "@/components/portal/landing-blocks"
import { headers } from "next/headers"
import { BlockPreview } from "@/components/portal/landing-preview"

export default async function PublicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const headersList = await headers()
  const subdomain = headersList.get("x-company-subdomain")

  const page = await prisma.landingPage.findFirst({
    where: {
      slug,
      published: true,
      company: subdomain ? { subdomain } : undefined,
    },
    include: { company: true },
  })

  if (!page) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Página no encontrada
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Esta landing no existe o no está publicada.
        </p>
      </div>
    )
  }

  const blocks = (page.content as LandingBlock[]) || []
  const company = page.company
  const primaryColor = company?.primaryColor ?? "#1a56db"

  return (
    <div className="max-w-2xl mx-auto px-6 pt-8 pb-20 space-y-5 animate-fade-in">
      <div
        className="flex items-center gap-3 pb-6 border-b border-[var(--card-border)]"
        style={{ borderColor: primaryColor + "20" }}
      >
        <div
          className="h-2 w-12 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <h1 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          {page.title}
        </h1>
      </div>

      {blocks.length === 0 ? (
        <p className="text-[var(--muted-foreground)] py-8 text-center">Sin contenido aún</p>
      ) : (
        blocks.map((block, i) => (
          <div
            key={block.id}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <BlockPreview block={block} />
          </div>
        ))
      )}
    </div>
  )
}
