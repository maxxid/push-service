import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getCompanyWhere } from "@/lib/selected-company"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const companyWhere = await getCompanyWhere(user.role, user.companyId)

  const [
    totalSubscribers,
    activeSubscribers,
    totalCampaigns,
    sentCampaigns,
    scheduledCampaigns,
    totalDeliveries,
    totalClicks,
    recentCampaigns,
    recentSubscribers,
    segmentStats,
  ] = await Promise.all([
    prisma.subscriber.count({ where: companyWhere }),
    prisma.subscriber.count({ where: { ...companyWhere, active: true } }),
    prisma.campaign.count({ where: companyWhere }),
    prisma.campaign.count({
      where: { ...companyWhere, status: "SENT" },
    }),
    prisma.campaign.count({
      where: { ...companyWhere, status: "SCHEDULED" },
    }),
    prisma.campaign
      .aggregate({
        where: { ...companyWhere, status: "SENT" },
        _sum: { deliveries: true },
      })
      .then((r) => r._sum.deliveries ?? 0),
    prisma.campaign
      .aggregate({
        where: { ...companyWhere, status: "SENT" },
        _sum: { clicks: true },
      })
      .then((r) => r._sum.clicks ?? 0),
    prisma.campaign.findMany({
      where: companyWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        deliveries: true,
        clicks: true,
        createdAt: true,
      },
    }),
    prisma.subscriber.findMany({
      where: companyWhere,
      orderBy: { subscribedAt: "desc" },
      take: 5,
      select: {
        id: true,
        onesignalId: true,
        subscribedAt: true,
        active: true,
      },
    }),
    prisma.segment.findMany({
      where: companyWhere,
      include: {
        _count: { select: { subscribers: true, campaigns: true } },
      },
      orderBy: { subscribers: { _count: "desc" } },
      take: 10,
    }),
  ])

  const ctr =
    totalDeliveries > 0
      ? ((totalClicks / totalDeliveries) * 100).toFixed(1)
      : "0"

  return NextResponse.json({
    subscribers: {
      total: totalSubscribers,
      active: activeSubscribers,
      inactive: totalSubscribers - activeSubscribers,
    },
    campaigns: {
      total: totalCampaigns,
      sent: sentCampaigns,
      scheduled: scheduledCampaigns,
      totalDeliveries,
      totalClicks,
      ctr: `${ctr}%`,
    },
    recentActivity: {
      campaigns: recentCampaigns,
      subscribers: recentSubscribers,
    },
    segments: segmentStats.map((s) => ({
      id: s.id,
      name: s.name,
      subscribers: s._count.subscribers,
      campaigns: s._count.campaigns,
    })),
  })
}
