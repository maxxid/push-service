import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const companyWhere =
    user.role !== "SUPERADMIN"
      ? { companyId: user.companyId ?? undefined }
      : {}

  const subscribers = await prisma.subscriber.findMany({
    where: companyWhere,
    include: {
      segments: { include: { segment: { select: { name: true } } } },
      company: { select: { name: true } },
    },
    orderBy: { subscribedAt: "desc" },
  })

  const headers = [
    "ID",
    "OneSignal ID",
    "Activo",
    "Empresa",
    "Segmentos",
    "Dispositivo",
    "Fecha suscripción",
  ]

  const rows = subscribers.map((s) => [
    csvEscape(s.id),
    csvEscape(s.onesignalId),
    s.active ? "Sí" : "No",
    csvEscape(s.company?.name ?? ""),
    csvEscape(s.segments.map((seg) => seg.segment.name).join("; ")),
    csvEscape(
      typeof s.deviceInfo === "object" &&
        s.deviceInfo &&
        "platform" in (s.deviceInfo as Record<string, unknown>)
        ? (s.deviceInfo as Record<string, string>).platform
        : ""
    ),
    new Date(s.subscribedAt).toLocaleDateString("es-AR"),
  ])

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=suscriptores.csv",
    },
  })
}
