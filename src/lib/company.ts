import { prisma } from "./prisma"

export async function getCompanyBySubdomain(host: string) {
  const subdomain = host.split(".")[0]

  if (
    subdomain === "localhost" ||
    subdomain === "www" ||
    subdomain === "admin"
  ) {
    return null
  }

  return prisma.company.findUnique({
    where: { subdomain },
  })
}

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({ where: { id } })
}
