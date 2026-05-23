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
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-zinc-600">
          Esta landing no existe o no está publicada.
        </p>
      </div>
    )
  }

  const blocks = (page.content as LandingBlock[]) || []
  const company = page.company

  return (
    <div className="min-h-screen bg-white">
      <header
        className="border-b"
        style={{ backgroundColor: company?.primaryColor ?? "#1a56db" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="font-semibold text-white">
            {company?.name ?? "Portal"}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">{page.title}</h1>
        {blocks.length === 0 ? (
          <p className="text-zinc-500">Sin contenido</p>
        ) : (
          blocks.map((block) => <BlockPreview key={block.id} block={block} />)
        )}
      </main>
    </div>
  )
}
