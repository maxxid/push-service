import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user || (user.role !== "SUPERADMIN" && event.companyId !== user.companyId)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  await prisma.event.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
