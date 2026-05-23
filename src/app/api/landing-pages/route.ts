import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export async function GET(request: Request) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const companyId =
    user.role === "SUPERADMIN"
      ? searchParams.get("companyId")
      : user.companyId

  const where: Record<string, unknown> = {}
  if (companyId) where.companyId = companyId

  const pages = await prisma.landingPage.findMany({
    where,
    include: { company: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(pages)
}

export async function POST(request: Request) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  if (!user.companyId && user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "No tenés empresa asignada" }, { status: 400 })
  }

  const body = await request.json()
  const { title, slug, content, companyId } = body

  if (!title || !slug) {
    return NextResponse.json(
      { error: "Título y slug son obligatorios" },
      { status: 400 }
    )
  }

  const targetCompanyId =
    user.role === "SUPERADMIN" ? companyId : user.companyId

  if (!targetCompanyId) {
    return NextResponse.json({ error: "Se requiere una empresa" }, { status: 400 })
  }

  const page = await prisma.landingPage.create({
    data: {
      title,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      content: content || [],
      companyId: targetCompanyId,
    },
  })

  return NextResponse.json(page, { status: 201 })
}
