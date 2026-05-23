import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const segmentId = searchParams.get("segmentId")
  const companyId =
    user.role === "SUPERADMIN"
      ? searchParams.get("companyId")
      : user.companyId

  const where: Record<string, unknown> = {}
  if (companyId) where.companyId = companyId
  if (segmentId) {
    where.segments = { some: { segmentId } }
  }

  const subscribers = await prisma.subscriber.findMany({
    where,
    include: {
      segments: {
        include: { segment: { select: { id: true, name: true } } },
      },
      company: { select: { name: true } },
    },
    orderBy: { subscribedAt: "desc" },
  })

  return NextResponse.json(subscribers)
}
