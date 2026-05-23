import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { onesignalId, companyId, deviceInfo } = body

    if (!onesignalId || !companyId) {
      return NextResponse.json(
        { error: "onesignalId y companyId son obligatorios" },
        { status: 400 }
      )
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      )
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { onesignalId },
      update: {
        active: true,
        deviceInfo: deviceInfo || undefined,
        companyId,
      },
      create: {
        onesignalId,
        companyId,
        deviceInfo: deviceInfo || undefined,
      },
    })

    return NextResponse.json({ ok: true, subscriberId: subscriber.id })
  } catch (error) {
    console.error("Error registrando suscriptor:", error)
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    )
  }
}
