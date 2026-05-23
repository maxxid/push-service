import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getUserCompany() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export async function GET() {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const where =
    user.role === "SUPERADMIN" ? {} : { companyId: user.companyId ?? undefined }

  const docs = await prisma.document.findMany({
    where,
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(docs)
}

export async function POST(request: Request) {
  const user = await getUserCompany()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  if (!user.companyId) {
    return NextResponse.json({ error: "Sin empresa asignada" }, { status: 400 })
  }

  const body = await request.json()
  const { title, description, fileUrl, category } = body

  if (!title || !fileUrl) {
    return NextResponse.json(
      { error: "Título y URL del archivo son obligatorios" },
      { status: 400 }
    )
  }

  const doc = await prisma.document.create({
    data: {
      title,
      description: description || null,
      fileUrl,
      category: category || "general",
      companyId: user.companyId,
    },
  })

  return NextResponse.json(doc, { status: 201 })
}
