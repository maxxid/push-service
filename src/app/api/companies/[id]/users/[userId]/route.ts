import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const { userId } = await params

  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  if (target.role === "SUPERADMIN") {
    return NextResponse.json({ error: "No se puede eliminar un superadmin" }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: userId } })
  return NextResponse.json({ ok: true })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const { userId } = await params
  const body = await request.json()

  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  const updateData: Record<string, unknown> = {}
  if (body.name !== undefined) updateData.name = body.name
  if (body.role) updateData.role = body.role
  if (body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 10)
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return NextResponse.json(updated)
}
