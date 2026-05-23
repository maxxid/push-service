import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

async function checkSegmentAccess(segmentId: string) {
  const user = await getUserCompany()
  if (!user) return { error: "No autorizado", status: 401 }

  if (user.role === "SUPERADMIN") return { user }

  const segment = await prisma.segment.findUnique({ where: { id: segmentId } })
  if (!segment) return { error: "Segmento no encontrado", status: 404 }
  if (segment.companyId !== user.companyId)
    return { error: "Acceso denegado", status: 403 }

  return { user }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await checkSegmentAccess(id)
  if ("error" in access)
    return NextResponse.json(
      { error: access.error },
      { status: access.status }
    )

  const body = await request.json()
  const { subscriberIds } = body as { subscriberIds: string[] }

  if (!subscriberIds?.length) {
    return NextResponse.json(
      { error: "subscriberIds es obligatorio" },
      { status: 400 }
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
  const { id } = await params
  const access = await checkSegmentAccess(id)
  if ("error" in access)
    return NextResponse.json(
      { error: access.error },
      { status: access.status }
    )

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
