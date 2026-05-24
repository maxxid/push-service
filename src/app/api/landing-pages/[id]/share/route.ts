import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.landingPage.update({ where: { id }, data: { shares: { increment: 1 } } })
  return NextResponse.json({ ok: true })
}
