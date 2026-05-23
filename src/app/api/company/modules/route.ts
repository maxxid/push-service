import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user || !user.companyId) {
    return NextResponse.json({ error: "Sin empresa asignada" }, { status: 400 })
  }

  const body = await request.json()
  const { modules } = body

  if (!Array.isArray(modules)) {
    return NextResponse.json({ error: "modules debe ser un array" }, { status: 400 })
  }

  await prisma.company.update({
    where: { id: user.companyId },
    data: { modules },
  })

  return NextResponse.json({ ok: true })
}
