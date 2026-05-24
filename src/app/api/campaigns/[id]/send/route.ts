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
      landingPage: true,
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

  console.log("[SEND] campaign:", campaign.id, "segment:", campaign.segmentId,
    "total subs in segment:", campaign.segment?.subscribers.length ?? 0,
    "active playerIds:", playerIds.length,
    "playerIds:", playerIds)

  if (playerIds.length === 0) {
    return NextResponse.json(
      { error: "No hay suscriptores activos en el segmento seleccionado" },
      { status: 400 }
    )
  }

  const actionUrl = buildActionUrl(campaign)
  const baseUrl = process.env.NEXTAUTH_URL || ""
  const clickUrl = actionUrl
    ? `${baseUrl}/api/click?c=${campaign.id}&r=${encodeURIComponent(actionUrl)}`
    : `${baseUrl}/api/click?c=${campaign.id}`
  const priority = campaign.priority === "URGENTE" ? 10 : 5

  const isScheduled = !!campaign.scheduledAt
  const sendAfter = isScheduled ? new Date(campaign.scheduledAt!).toISOString() : undefined

  try {
    const result = await sendPushNotification({
      headings: { es: campaign.title },
      contents: { es: campaign.pushMessage },
      url: clickUrl,
      onesignalPlayerIds: playerIds,
      priority,
      sendAfter,
    })

    const updateData: any = {
      status: isScheduled ? "SCHEDULED" : "SENT",
      sentAt: isScheduled ? null : new Date(),
      deliveries: playerIds.length,
    }
    if (isScheduled && (result as any)?.id) {
      updateData.onesignalNotificationId = (result as any).id
    }

    await prisma.campaign.update({ where: { id }, data: updateData })

    return NextResponse.json({
      ok: true,
      scheduled: isScheduled,
      sendAfter,
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

function buildActionUrl(campaign: {
  actionType: string
  actionValue: string | null
  landingPage?: { slug: string } | null
}): string | undefined {
  const { actionType, actionValue, landingPage } = campaign

  if (actionType === "LANDING_INTERNA" || actionType === "FORMULARIO") {
    const base = process.env.NEXTAUTH_URL || ""
    if (landingPage) return `${base}/portal/landing/${landingPage.slug}`
    if (actionValue) return actionValue
    return undefined
  }

  switch (actionType) {
    case "WHATSAPP":
      return actionValue ? `https://wa.me/${actionValue}` : undefined
    case "URL_EXTERNA":
      return actionValue ? actionValue : undefined
    case "MAPS":
      return actionValue
        ? `https://maps.google.com/?q=${encodeURIComponent(actionValue)}`
        : undefined
    case "LLAMAR":
      return actionValue ? `tel:${actionValue}` : undefined
    case "PDF":
      return actionValue || undefined
    default:
      return undefined
  }
}
