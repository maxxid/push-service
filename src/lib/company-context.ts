import { cache } from "react"
import { prisma } from "./prisma"

export const getCompanyFromHeaders = cache(
  async (subdomain: string | null) => {
    if (!subdomain) return null

    return prisma.company.findUnique({
      where: { subdomain },
    })
  }
)
