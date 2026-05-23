import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      segment: true,
      landingPage: true,
      company: { select: { name: true } },
    },
  })

  if (!campaign) {
    return NextResponse.json(
      { error: "Campaña no encontrada" },
      { status: 404 }
    )
  }

  return NextResponse.json(campaign)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) {
    return NextResponse.json(
      { error: "Campaña no encontrada" },
      { status: 404 }
    )
  }

  if (campaign.status === "SENT") {
    return NextResponse.json(
      { error: "No se puede editar una campaña ya enviada" },
      { status: 400 }
    )
  }

  const updated = await prisma.campaign.update({
    where: { id },
    data: {
      title: body.title,
      pushMessage: body.pushMessage,
      imageUrl: body.imageUrl,
      segmentId: body.segmentId,
      landingPageId: body.landingPageId,
      actionType: body.actionType,
      actionValue: body.actionValue,
      priority: body.priority,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      status: body.status,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  await prisma.campaign.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
