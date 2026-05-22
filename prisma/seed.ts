import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  const prisma = new PrismaClient({ adapter })

  const passwordHash = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@plataforma.com" },
    update: {},
    create: {
      email: "admin@plataforma.com",
      name: "Super Admin",
      passwordHash,
      role: "SUPERADMIN",
    },
  })

  console.log("Seed creado:", admin.email, "- password: admin123")

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
