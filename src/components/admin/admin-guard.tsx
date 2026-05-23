"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
    if (status === "authenticated" && pathname === "/admin/login") {
      router.push("/admin/dashboard")
    }
  }, [status, pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    )
  }

  if (pathname === "/admin/login" && status === "unauthenticated") {
    return <>{children}</>
  }

  if (!session) return null

  return <>{children}</>
}
