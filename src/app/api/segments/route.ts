import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { company: true },
  })

  if (!user) return null
  return user
}

export async function GET() {
  const user = await getUserCompany()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const where =
    user.role === "SUPERADMIN" ? {} : { companyId: user.companyId ?? undefined }

  const segments = await prisma.segment.findMany({
    where,
    include: {
      _count: { select: { subscribers: true, campaigns: true } },
      company: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(segments)
}

export async function POST(request: Request) {
  const user = await getUserCompany()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  if (!user.companyId && user.role !== "SUPERADMIN") {
    return NextResponse.json(
      { error: "No tenés una empresa asignada" },
      { status: 400 }
    )
  }

  const body = await request.json()
  const { name, companyId } = body

  const targetCompanyId =
    user.role === "SUPERADMIN" ? companyId : user.companyId

  if (!name || !targetCompanyId) {
    return NextResponse.json(
      { error: "Nombre y empresa son obligatorios" },
      { status: 400 }
    )
  }

  const exists = await prisma.segment.findUnique({
    where: { name_companyId: { name, companyId: targetCompanyId } },
  })

  if (exists) {
    return NextResponse.json(
      { error: "Ya existe un segmento con ese nombre" },
      { status: 409 }
    )
  }

  const segment = await prisma.segment.create({
    data: { name, companyId: targetCompanyId },
  })

  return NextResponse.json(segment, { status: 201 })
}
