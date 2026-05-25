import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) return NextResponse.json({ error: "No encontrada" }, { status: 404 })
  if (campaign.status !== "SCHEDULED") return NextResponse.json({ error: "Solo se puede cancelar campañas programadas" }, { status: 400 })

  // Cancel in OneSignal if we have the notification ID
  if (campaign.onesignalNotificationId) {
    await fetch(
      `https://onesignal.com/api/v1/notifications/${campaign.onesignalNotificationId}?app_id=${process.env.ONESIGNAL_APP_ID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
        },
      }
    ).catch(() => {})
  }

  // Also cancel linked reminder
  const reminder = await prisma.campaign.findFirst({
    where: { parentCampaignId: id, reminderSent: false },
  })
  if (reminder?.onesignalNotificationId) {
    await fetch(
      `https://onesignal.com/api/v1/notifications/${reminder.onesignalNotificationId}?app_id=${process.env.ONESIGNAL_APP_ID}`,
      { method: "DELETE", headers: { Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}` } }
    ).catch(() => {})
    await prisma.campaign.update({
      where: { id: reminder.id },
      data: { status: "DRAFT", onesignalNotificationId: null, scheduledAt: null },
    })
  }

  await prisma.campaign.update({
    where: { id },
    data: { status: "DRAFT", onesignalNotificationId: null, scheduledAt: null },
  })

  return NextResponse.json({ ok: true })
}
