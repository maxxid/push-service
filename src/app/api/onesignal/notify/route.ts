import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "@/lib/onesignal"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
  }

  const body = await request.json()
  const {
    title,
    message,
    url,
    segmentId,
    onesignalPlayerIds,
    priority,
  } = body

  if (!title || !message) {
    return NextResponse.json(
      { error: "Título y mensaje son obligatorios" },
      { status: 400 }
    )
  }

  if (user.role === "COMPANY_OWNER" || user.role === "COMPANY_EDITOR") {
    if (!segmentId && !onesignalPlayerIds) {
      return NextResponse.json(
        { error: "Debe especificar segmentId o onesignalPlayerIds" },
        { status: 400 }
      )
    }
  }

  try {
    const result = await sendPushNotification({
      headings: { es: title },
      contents: { es: message },
      url,
      segmentId: segmentId || undefined,
      onesignalPlayerIds,
      priority: priority || 5,
    })

    return NextResponse.json({ ok: true, result })
  } catch (error) {
    console.error("Error enviando notificación:", error)
    return NextResponse.json(
      { error: "Error al enviar notificación" },
      { status: 500 }
    )
  }
}
