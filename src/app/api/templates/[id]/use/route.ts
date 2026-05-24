import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const template = await prisma.template.findUnique({ where: { id } })
  if (!template) return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })

  const slug = `${template.landingTitle.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

  const landing = await prisma.landingPage.create({
    data: {
      title: template.landingTitle,
      slug,
      content: template.landingContent as any,
      published: true,
      companyId: template.companyId,
    },
  })

  const campaign = await prisma.campaign.create({
    data: {
      title: template.name,
      pushMessage: template.pushMessage,
      actionType: template.actionType,
      actionValue: template.actionValue,
      priority: template.priority,
      landingPageId: landing.id,
      companyId: template.companyId,
      createdBy: user.id,
    },
  })

  return NextResponse.json({ campaign, landing }, { status: 201 })
}
