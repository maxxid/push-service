import { DefaultSession } from "next-auth"
import { Role } from "@/generated/prisma/client"

declare module "next-auth" {
  interface User {
    role?: Role
    companyId?: string | null
  }
  interface Session {
    user: {
      id: string
      role?: Role
      companyId?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: Role
    companyId?: string | null
  }
}
