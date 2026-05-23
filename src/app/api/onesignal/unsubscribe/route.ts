import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { onesignalId } = body

    if (!onesignalId) {
      return NextResponse.json({ error: "onesignalId requerido" }, { status: 400 })
    }

    await prisma.subscriber.updateMany({
      where: { onesignalId },
      data: { active: false },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
