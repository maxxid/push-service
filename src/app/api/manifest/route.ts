import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const host = request.headers.get("host") || ""
  const subdomain = host.split(".")[0]

  const company = await prisma.company.findUnique({
    where: { subdomain },
  })

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
