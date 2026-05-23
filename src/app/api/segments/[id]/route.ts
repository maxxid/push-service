import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) return null
  return user
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const segment = await prisma.segment.findUnique({
    where: { id },
    include: {
      subscribers: {
        include: { subscriber: true },
        orderBy: { subscriber: { subscribedAt: "desc" } },
      },
      _count: { select: { campaigns: true } },
    },
  })

  if (!segment) {
    return NextResponse.json(
      { error: "Segmento no encontrado" },
      { status: 404 }
    )
  }

  if (user.role !== "SUPERADMIN" && segment.companyId !== user.companyId) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  return NextResponse.json(segment)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const segment = await prisma.segment.findUnique({ where: { id } })
  if (!segment) {
    return NextResponse.json(
      { error: "Segmento no encontrado" },
      { status: 404 }
    )
  }

  if (user.role !== "SUPERADMIN" && segment.companyId !== user.companyId) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const updated = await prisma.segment.update({
    where: { id },
    data: { name: body.name },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const segment = await prisma.segment.findUnique({ where: { id } })
  if (!segment) {
    return NextResponse.json(
      { error: "Segmento no encontrado" },
      { status: 404 }
    )
  }

  if (user.role !== "SUPERADMIN" && segment.companyId !== user.companyId) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  await prisma.segment.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
