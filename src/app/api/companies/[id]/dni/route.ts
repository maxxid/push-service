import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  const records = await prisma.authorizedDni.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(records)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { dniId } = body

  if (!dniId) return NextResponse.json({ error: "dniId requerido" }, { status: 400 })

  await prisma.authorizedDni.delete({ where: { id: dniId } })
  return NextResponse.json({ ok: true })
}
