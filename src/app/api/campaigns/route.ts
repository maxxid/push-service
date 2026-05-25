import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) return null
  return user
}

export async function GET(request: Request) {
  const user = await getUserCompany()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const companyId =
    user.role === "SUPERADMIN"
      ? searchParams.get("companyId")
      : user.companyId

  const where: Record<string, unknown> = {}
  if (companyId) where.companyId = companyId

  const status = searchParams.get("status")
  if (status) where.status = status

  const campaigns = await prisma.campaign.findMany({
    where,
    include: {
      segment: { select: { name: true } },
      landingPage: { select: { title: true } },
      company: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(campaigns)
}

export async function POST(request: Request) {
  const user = await getUserCompany()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  if (!user.companyId && user.role !== "SUPERADMIN") {
    return NextResponse.json(
      { error: "No tenés una empresa asignada" },
      { status: 400 }
    )
  }

  const body = await request.json()
  const {
    title,
    pushMessage,
    imageUrl,
    segmentId,
    landingPageId,
    actionType,
    actionValue,
    priority,
    scheduledAt,
    companyId,
    reminderEnabled,
    reminderDelayHours,
    reminderTarget,
    reminderTitle,
    reminderMessage,
  } = body

  if (!title || !pushMessage) {
    return NextResponse.json(
      { error: "Título y mensaje push son obligatorios" },
      { status: 400 }
    )
  }

  const targetCompanyId =
    user.role === "SUPERADMIN" ? companyId : user.companyId

  if (!targetCompanyId) {
    return NextResponse.json(
      { error: "Se requiere una empresa" },
      { status: 400 }
    )
  }

  if (segmentId) {
    const seg = await prisma.segment.findUnique({ where: { id: segmentId } })
    if (!seg) return NextResponse.json({ error: "El segmento no existe" }, { status: 400 })
    if (seg.companyId !== targetCompanyId) return NextResponse.json({ error: "El segmento no pertenece a esta empresa" }, { status: 400 })
  }
  if (landingPageId) {
    const lp = await prisma.landingPage.findUnique({ where: { id: landingPageId } })
    if (!lp) return NextResponse.json({ error: "La landing no existe" }, { status: 400 })
    if (lp.companyId !== targetCompanyId) return NextResponse.json({ error: "La landing no pertenece a esta empresa" }, { status: 400 })
  }

  const campaign = await prisma.campaign.create({
    data: {
      title,
      pushMessage,
      imageUrl: imageUrl || null,
      segmentId: segmentId || null,
      landingPageId: landingPageId || null,
      actionType: actionType || "LANDING_INTERNA",
      actionValue: actionValue || null,
      priority: priority || "NORMAL",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? "SCHEDULED" : "DRAFT",
      companyId: targetCompanyId,
      createdBy: user.id,
    },
  })

  // Create reminder campaign if enabled
  let reminderCampaign = null
  if (reminderEnabled && reminderDelayHours) {
    const rTitle = reminderTitle || `⏰ Recordatorio: ${title}`
    const rMessage = reminderMessage || pushMessage
    const rScheduledAt = scheduledAt
      ? new Date(new Date(scheduledAt).getTime() + reminderDelayHours * 3600000)
      : new Date(Date.now() + reminderDelayHours * 3600000)

    reminderCampaign = await prisma.campaign.create({
      data: {
        title: rTitle,
        pushMessage: rMessage,
        imageUrl: imageUrl || null,
        segmentId: segmentId || null,
        landingPageId: landingPageId || null,
        actionType: actionType || "LANDING_INTERNA",
        actionValue: actionValue || null,
        priority: priority || "NORMAL",
        scheduledAt: rScheduledAt,
        status: "SCHEDULED",
        companyId: targetCompanyId,
        createdBy: user.id,
        parentCampaignId: campaign.id,
        reminderEnabled: false,
        reminderTarget: reminderTarget || "all",
      },
    })
  }

  return NextResponse.json({ campaign, reminderCampaign }, { status: 201 })
}
