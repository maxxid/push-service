import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { subscriberIds } = body as { subscriberIds: string[] }

  if (!subscriberIds?.length) {
    return NextResponse.json(
      { error: "subscriberIds es obligatorio" },
      { status: 400 }
    )
  }

  const segment = await prisma.segment.findUnique({ where: { id } })
  if (!segment) {
    return NextResponse.json(
      { error: "Segmento no encontrado" },
      { status: 404 }
    )
  }

  await prisma.subscriberSegment.createMany({
    data: subscriberIds.map((subscriberId) => ({
      subscriberId,
      segmentId: id,
    })),
    skipDuplicates: true,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { subscriberIds } = body as { subscriberIds: string[] }

  if (!subscriberIds?.length) {
    return NextResponse.json(
      { error: "subscriberIds es obligatorio" },
      { status: 400 }
    )
  }

  await prisma.subscriberSegment.deleteMany({
    where: {
      segmentId: id,
      subscriberId: { in: subscriberIds },
    },
  })

  return NextResponse.json({ ok: true })
}
