import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

async function canEditCompany(user: { role: string; companyId: string | null } | null, companyId: string) {
  if (!user) return false
  if (user.role === "SUPERADMIN") return true
  if ((user.role === "COMPANY_OWNER" || user.role === "COMPANY_EDITOR") && user.companyId === companyId) return true
  return false
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  if (!canEditCompany(user, id)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const company = await prisma.company.findUnique({
    where: { id },
    include: { _count: { select: { subscribers: true, campaigns: true, users: true } } },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
  }

  return NextResponse.json(company)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  if (!canEditCompany(user, id)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const body = await request.json()

  const existing = await prisma.company.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 })
  }

  const company = await prisma.company.update({
    where: { id },
    data: {
      name: body.name,
      logo: body.logo,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      textColor: body.textColor,
      portalTitle: body.portalTitle,
      portalDescription: body.portalDescription,
      headerTitle: body.headerTitle,
      whatsappNumber: body.whatsappNumber,
      showShare: body.showShare,
      showDownload: body.showDownload,
      requireDniVerification: body.requireDniVerification,
    },
  })

  return NextResponse.json(company)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  await prisma.company.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
