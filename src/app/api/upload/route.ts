import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN no configurado en Vercel. Configuralo en Storage > Blob." },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const customName = formData.get("name") as string | null

    if (!file) return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 })

    const blob = await put(customName || file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url, name: customName || file.name, size: file.size })
  } catch (err) {
    return NextResponse.json(
      { error: "Error al subir el archivo. Verificá BLOB_READ_WRITE_TOKEN en Vercel." },
      { status: 500 }
    )
  }
}
