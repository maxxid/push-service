import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const where =
    user.role === "SUPERADMIN" ? {} : { id: user.companyId ?? undefined }

  const companies = await prisma.company.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { subscribers: true, campaigns: true } } },
  })

  return NextResponse.json(companies)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const body = await request.json()
  const { name, slug, subdomain } = body

  if (!name || !slug || !subdomain) {
    return NextResponse.json(
      { error: "Nombre, slug y subdominio son obligatorios" },
      { status: 400 }
    )
  }

  const existing = await prisma.company.findFirst({
    where: { OR: [{ slug }, { subdomain }] },
  })

  if (existing) {
    return NextResponse.json(
      { error: "El slug o subdominio ya existe" },
      { status: 409 }
    )
  }

  const company = await prisma.company.create({
    data: {
      name,
      slug,
      subdomain,
      logo: body.logo || null,
      primaryColor: body.primaryColor || "#1a56db",
      secondaryColor: body.secondaryColor || "#ffffff",
    },
  })

  return NextResponse.json(company, { status: 201 })
}
