import { prisma } from "./prisma"

export async function getCompanyBySubdomain(host: string) {
  const parts = host.split(".")
  if (parts.length < 3) return null

  const subdomain = parts[0]

  if (subdomain === "www" || subdomain === "admin") {
    return null
  }

  return prisma.company.findUnique({
    where: { subdomain },
  })
}

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({ where: { id } })
}
