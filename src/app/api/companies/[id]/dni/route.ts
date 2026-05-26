import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { normalizeDni } from "@/lib/dni"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const records = await prisma.authorizedDni.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(records)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { nombre, apellido, dni, celular } = body

  if (!nombre || !apellido || !dni) {
    return NextResponse.json({ error: "Nombre, apellido y DNI son obligatorios" }, { status: 400 })
  }

  const normalized = normalizeDni(dni)
  if (!normalized) {
    return NextResponse.json({ error: "DNI inválido. Debe tener 7 u 8 dígitos." }, { status: 400 })
  }

  try {
    const record = await prisma.authorizedDni.create({
      data: { nombre, apellido, dni: normalized, celular: celular || "", companyId: id },
    })
    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: "El DNI ya existe para esta empresa" }, { status: 409 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { dniId, nombre, apellido, dni, celular } = body

  if (!dniId) return NextResponse.json({ error: "dniId requerido" }, { status: 400 })

  // Edit mode: update nombre/apellido/dni/celular
  if (nombre || apellido || dni !== undefined || celular !== undefined) {
    const data: any = {}
    if (nombre) data.nombre = nombre
    if (apellido) data.apellido = apellido
    if (dni !== undefined) {
      const normalized = normalizeDni(dni)
      if (!normalized) return NextResponse.json({ error: "DNI inválido" }, { status: 400 })
      data.dni = normalized
    }
    if (celular !== undefined) data.celular = celular
    try {
      const updated = await prisma.authorizedDni.update({ where: { id: dniId }, data })
      return NextResponse.json(updated)
    } catch {
      return NextResponse.json({ error: "El DNI ya existe" }, { status: 409 })
    }
  }

  // Reset mode: clear subscription
  await prisma.authorizedDni.update({
    where: { id: dniId },
    data: { subscribed: false, subscriberId: null, subscribedAt: null, deviceInfo: null },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { dniId } = body

  if (!dniId) return NextResponse.json({ error: "dniId requerido" }, { status: 400 })

  await prisma.authorizedDni.delete({ where: { id: dniId } })
  return NextResponse.json({ ok: true })
}
