"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"

export function AdminInnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
