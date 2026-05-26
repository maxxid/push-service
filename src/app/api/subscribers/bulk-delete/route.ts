import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await request.json()
  const { ids } = body as { ids: string[] }

  if (!ids?.length) return NextResponse.json({ error: "ids requeridos" }, { status: 400 })

  // Reset DNI records linked to these subscribers
  await prisma.authorizedDni.updateMany({
    where: { subscriberId: { in: ids } },
    data: { subscribed: false, subscriberId: null, subscribedAt: null, deviceInfo: null },
  })

  // Delete the subscribers
  const result = await prisma.subscriber.deleteMany({
    where: { id: { in: ids } },
  })

  return NextResponse.json({ ok: true, deleted: result.count })
}
