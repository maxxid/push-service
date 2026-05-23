import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

async function checkLandingAccess(pageId: string) {
  const user = await getUser()

  const page = await prisma.landingPage.findUnique({
    where: { id: pageId },
  })
  if (!page) return { error: "Landing no encontrada", status: 404 }

  return { user, page }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUser()
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const page = await prisma.landingPage.findUnique({
    where: { id },
    include: { company: { select: { name: true, primaryColor: true } } },
  })

  if (!page) {
    return NextResponse.json(
      { error: "Landing no encontrada" },
      { status: 404 }
    )
  }

  if (
    user.role !== "SUPERADMIN" &&
    page.companyId !== user.companyId
  ) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  return NextResponse.json(page)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await checkLandingAccess(id)
  if ("error" in access)
    return NextResponse.json(
      { error: access.error },
      { status: access.status }
    )

  if (
    !access.user ||
    (access.user.role !== "SUPERADMIN" &&
      access.page.companyId !== access.user.companyId)
  ) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const body = await request.json()

  const updated = await prisma.landingPage.update({
    where: { id },
    data: {
      title: body.title ?? access.page.title,
      slug: body.slug ?? access.page.slug,
      content: body.content ?? access.page.content,
      published: body.published ?? access.page.published,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await checkLandingAccess(id)
  if ("error" in access)
    return NextResponse.json(
      { error: access.error },
      { status: access.status }
    )

  if (
    !access.user ||
    (access.user.role !== "SUPERADMIN" &&
      access.page.companyId !== access.user.companyId)
  ) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  await prisma.campaign.updateMany({
    where: { landingPageId: id },
    data: { landingPageId: null },
  })

  await prisma.landingPage.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
