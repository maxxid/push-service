import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export async function GET() {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const where =
    user.role === "SUPERADMIN" ? {} : { companyId: user.companyId ?? undefined }

  const events = await prisma.event.findMany({
    where,
    include: { company: { select: { name: true } } },
    orderBy: { date: "asc" },
  })

  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  if (!user.companyId) {
    return NextResponse.json({ error: "Sin empresa asignada" }, { status: 400 })
  }

  const body = await request.json()
  const { title, description, date, location } = body

  if (!title || !date) {
    return NextResponse.json(
      { error: "Título y fecha son obligatorios" },
      { status: 400 }
    )
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description || null,
      date: new Date(date),
      location: location || null,
      companyId: user.companyId,
    },
  })

  return NextResponse.json(event, { status: 201 })
}
