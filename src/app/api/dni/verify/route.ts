import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { normalizeDni } from "@/lib/dni"

export async function POST(request: Request) {
  const body = await request.json()
  const { dni, companyId, onesignalId } = body

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
    return NextResponse.json({ error: "no_encontrado", detail: "DNI no autorizado. Puede tratarse de un error en la base de datos. Contactanos para resolverlo." }, { status: 404 })
  }

  if (record.subscribed) {
    // Check if same device: look up the subscriber's OneSignal ID
    let isSameDevice = false
    if (onesignalId && record.subscriberId) {
      const subscriber = await prisma.subscriber.findUnique({
        where: { id: record.subscriberId },
        select: { onesignalId: true },
      })
      isSameDevice = subscriber?.onesignalId === onesignalId
    }

    if (isSameDevice) {
      return NextResponse.json({
        ok: true, dni: normalized, nombre: record.nombre, apellido: record.apellido,
        status: "same_device", detail: "Las notificaciones ya están activadas en este dispositivo.",
      })
    }
    return NextResponse.json({
      ok: true, dni: normalized, nombre: record.nombre, apellido: record.apellido,
      status: "other_device", detail: "Este DNI ya está registrado en otro dispositivo. Si creés que es un error, contactanos.",
    })
  }

  return NextResponse.json({
    ok: true, dni: normalized, nombre: record.nombre, apellido: record.apellido,
    status: "available", detail: "DNI verificado. Ahora activá las notificaciones.",
  })
}
