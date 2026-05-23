import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sendPushNotification } from "@/lib/onesignal"

async function getUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      segment: {
        include: {
          subscribers: { include: { subscriber: true } },
        },
      },
      company: true,
    },
  })

  if (!campaign) {
    return NextResponse.json(
      { error: "Campaña no encontrada" },
      { status: 404 }
    )
  }

  if (user.role !== "SUPERADMIN" && campaign.companyId !== user.companyId) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  if (campaign.status === "SENT") {
    return NextResponse.json(
      { error: "Esta campaña ya fue enviada" },
      { status: 400 }
    )
  }

  const playerIds = campaign.segment
    ? campaign.segment.subscribers
        .filter((s) => s.subscriber.active)
        .map((s) => s.subscriber.onesignalId)
    : []

  if (playerIds.length === 0) {
    return NextResponse.json(
      { error: "No hay suscriptores activos en el segmento seleccionado" },
      { status: 400 }
    )
  }

  const actionUrl = buildActionUrl(campaign.actionType, campaign.actionValue)
  const priority = campaign.priority === "URGENTE" ? 10 : 5

  try {
    const result = await sendPushNotification({
      headings: { es: campaign.title },
      contents: { es: campaign.pushMessage },
      url: actionUrl,
      onesignalPlayerIds: playerIds,
      priority,
    })

    await prisma.campaign.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        deliveries: playerIds.length,
      },
    })

    return NextResponse.json({
      ok: true,
      sent: playerIds.length,
      result,
    })
  } catch (error) {
    await prisma.campaign.update({
      where: { id },
      data: { status: "FAILED" },
    })

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al enviar notificación",
      },
      { status: 500 }
    )
  }
}

function buildActionUrl(
  actionType: string,
  actionValue: string | null
): string | undefined {
  switch (actionType) {
    case "WHATSAPP":
      return actionValue ? `https://wa.me/${actionValue}` : undefined
    case "URL_EXTERNA":
      return actionValue || undefined
    case "MAPS":
      return actionValue
        ? `https://maps.google.com/?q=${encodeURIComponent(actionValue)}`
        : undefined
    case "LLAMAR":
      return actionValue ? `tel:${actionValue}` : undefined
    case "PDF":
    case "LANDING_INTERNA":
    case "FORMULARIO":
      return actionValue || undefined
    default:
      return undefined
  }
}
