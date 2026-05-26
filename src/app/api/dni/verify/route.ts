import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { normalizeDni } from "@/lib/dni"

export async function POST(request: Request) {
  const body = await request.json()
  const { dni, companyId } = body

  if (!dni || !companyId) {
    return NextResponse.json({ error: "DNI y empresa requeridos" }, { status: 400 })
  }

  const normalized = normalizeDni(dni)
  if (!normalized) {
    return NextResponse.json({ error: "DNI inválido. Debe tener 7 u 8 dígitos." }, { status: 400 })
  }

  const record = await prisma.authorizedDni.findUnique({
    where: { dni_companyId: { dni: normalized, companyId } },
  })

  if (!record) {
    return NextResponse.json({ error: "DNI no autorizado" }, { status: 404 })
  }

  if (record.subscribed) {
    return NextResponse.json({ error: "Este DNI ya está registrado" }, { status: 409 })
  }

  return NextResponse.json({
    ok: true,
    dni: normalized,
    nombre: record.nombre,
    apellido: record.apellido,
    celular: record.celular,
  })
}
