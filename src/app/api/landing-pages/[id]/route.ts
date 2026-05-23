import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

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

  return NextResponse.json(page)
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

  const page = await prisma.landingPage.findUnique({ where: { id } })
  if (!page) {
    return NextResponse.json(
      { error: "Landing no encontrada" },
      { status: 404 }
    )
  }

  const updated = await prisma.landingPage.update({
    where: { id },
    data: {
      title: body.title ?? page.title,
      slug: body.slug ?? page.slug,
      content: body.content ?? page.content,
      published: body.published ?? page.published,
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

  await prisma.landingPage.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
