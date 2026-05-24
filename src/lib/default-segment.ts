import { prisma } from "./prisma"

export async function getOrCreateTodosSegment(companyId: string) {
  const existing = await prisma.segment.findUnique({
    where: { name_companyId: { name: "Todos", companyId } },
  })

  if (existing) return existing

  return prisma.segment.create({
    data: { name: "Todos", companyId },
  })
}

export async function addSubscriberToTodos(onesignalId: string, companyId: string) {
  const segment = await getOrCreateTodosSegment(companyId)

  const subscriber = await prisma.subscriber.findUnique({ where: { onesignalId } })
  if (!subscriber) return

  await prisma.subscriberSegment.upsert({
    where: { subscriberId_segmentId: { subscriberId: subscriber.id, segmentId: segment.id } },
    update: {},
    create: { subscriberId: subscriber.id, segmentId: segment.id },
  })
}
