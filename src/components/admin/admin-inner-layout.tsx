"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"

export function AdminInnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main className="pl-14 transition-all duration-300">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
