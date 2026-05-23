"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/campaigns", label: "Campañas", icon: "📨" },
  { href: "/admin/segments", label: "Segmentos", icon: "👥" },
  { href: "/admin/subscribers", label: "Suscriptores", icon: "📱" },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: "📄" },
  { href: "/admin/documents", label: "Documentos", icon: "📁" },
  { href: "/admin/events", label: "Agenda", icon: "📅" },
]

const superadminLinks = [
  { href: "/admin/companies", label: "Empresas", icon: "🏢" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-zinc-800">
        <Link
          href="/admin/dashboard"
          className="text-lg font-bold hover:text-blue-400 transition-colors"
        >
          Panel Admin
        </Link>
        {role === "SUPERADMIN" && (
          <span className="block text-xs text-blue-400 mt-1">Superadmin</span>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          const active = pathname.startsWith(link.href)
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

        {role === "SUPERADMIN" && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Administración
              </p>
            </div>
            {superadminLinks.map((link) => {
              const active = pathname.startsWith(link.href)
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
          </>
        )}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2 truncate">
          {session?.user?.email}
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
