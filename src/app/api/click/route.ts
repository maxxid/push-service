import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const campaignId = searchParams.get("c")
  const redirectTo = searchParams.get("r") || "/portal"

  if (campaignId) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { clicks: { increment: 1 } },
    }).catch(() => {})
  }

  return NextResponse.redirect(new URL(redirectTo, request.url))
}
