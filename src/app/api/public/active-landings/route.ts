import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const company = searchParams.get("company")

  if (!company) {
    return NextResponse.json({ error: "Parámetro company requerido" }, { status: 400 })
  }

  const companyRecord = await prisma.company.findFirst({
    where: { OR: [{ subdomain: company }, { slug: company }] },
  })

  if (!companyRecord) {
    return NextResponse.json([])
  }

  const now = new Date()

  const pages = await prisma.landingPage.findMany({
    where: {
      companyId: companyRecord.id,
      published: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      views: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(pages)
}
