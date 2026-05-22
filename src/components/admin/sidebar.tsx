"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/campaigns", label: "Campañas", icon: "📨" },
  { href: "/admin/segments", label: "Segmentos", icon: "👥" },
  { href: "/admin/subscribers", label: "Suscriptores", icon: "📱" },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: "📄" },
  { href: "/admin/branding", label: "Branding", icon: "🎨" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-lg font-bold">Panel Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
