import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { normalizeDni } from "@/lib/dni"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.companyId) return NextResponse.json({ error: "Sin empresa asignada" }, { status: 400 })

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 })

  const text = await file.text()
  const lines = text.split("\n").filter(l => l.trim())
  if (lines.length < 2) return NextResponse.json({ error: "El CSV debe tener encabezado + al menos una fila" }, { status: 400 })

  // Parse CSV: header: nombre,apellido,dni,celular
  const header = lines[0].toLowerCase().replace(/\r/g, "").split(",")
  const idxNombre = header.indexOf("nombre")
  const idxApellido = header.indexOf("apellido")
  const idxDni = header.indexOf("dni")
  const idxCelular = header.indexOf("celular")

  if (idxNombre < 0 || idxApellido < 0 || idxDni < 0 || idxCelular < 0) {
    return NextResponse.json({ error: "Encabezado inválido. Se requiere: nombre,apellido,dni,celular" }, { status: 400 })
  }

  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].replace(/\r/g, "").split(",")
    const nombre = (cols[idxNombre] || "").trim()
    const apellido = (cols[idxApellido] || "").trim()
    const dniRaw = (cols[idxDni] || "").trim()
    const celular = (cols[idxCelular] || "").trim()

    if (!nombre || !apellido || !dniRaw) continue

    const dni = normalizeDni(dniRaw)
    if (!dni) { errors.push(`Línea ${i + 1}: DNI inválido "${dniRaw}"`); continue }

    try {
      await prisma.authorizedDni.create({
        data: { nombre, apellido, dni, celular, companyId: user.companyId! },
      })
      created++
    } catch {
      skipped++
    }
  }

  return NextResponse.json({ ok: true, created, skipped, errors })
}
