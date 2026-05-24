import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const companyId = user.role === "SUPERADMIN" ? searchParams.get("companyId") : user.companyId
  const where = companyId ? { companyId } : {}

  const templates = await prisma.template.findMany({
    where,
    include: { company: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(templates)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  if (!user.companyId && user.role !== "SUPERADMIN") return NextResponse.json({ error: "Sin empresa" }, { status: 400 })

  const body = await request.json()
  const { name, description, pushMessage, landingTitle, landingContent, actionType, actionValue, priority, companyId } = body

  if (!name || !pushMessage || !landingTitle) {
    return NextResponse.json({ error: "Nombre, mensaje y título de landing son obligatorios" }, { status: 400 })
  }

  const targetId = user.role === "SUPERADMIN" ? companyId : user.companyId
  if (!targetId) return NextResponse.json({ error: "Empresa requerida" }, { status: 400 })

  const template = await prisma.template.create({
    data: {
      name, description: description || null,
      pushMessage, landingTitle, landingContent: landingContent || [],
      actionType: actionType || "LANDING_INTERNA", actionValue: actionValue || null,
      priority: priority || "NORMAL", companyId: targetId,
    },
  })

  return NextResponse.json(template, { status: 201 })
}
