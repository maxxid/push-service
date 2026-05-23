import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit"

export async function GET(request: Request) {
  if (!rateLimit(getRateLimitKey(request), 60, 60000)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes" },
      { status: 429 }
    )
  }
  const host = request.headers.get("host") || ""
  const parts = host.split(".")
  const subdomain = parts.length >= 3 ? parts[0] : null

  const company =
    subdomain && subdomain !== "localhost" && subdomain !== "www"
      ? await prisma.company.findUnique({ where: { subdomain } })
      : null

  const name = company?.name ?? "Portal Institucional"
  const color = company?.primaryColor ?? "#1a56db"

  return NextResponse.json({
    name: `${name} - Comunicación`,
    short_name: name,
    description: "Recibí avisos y comunicados importantes de tu institución",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: color,
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  })
}
