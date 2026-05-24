"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { CompanySwitcher } from "./company-switcher"

const mainLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/library", label: "Mi Biblioteca", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { href: "/admin/campaigns", label: "Campañas", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
  { href: "/admin/segments", label: "Segmentos", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { href: "/admin/subscribers", label: "Suscriptores", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/admin/templates", label: "Plantillas", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { href: "/admin/documents", label: "Documentos", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href: "/admin/events", label: "Agenda", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/admin/branding", label: "Branding", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
]

const adminLinks = [
  { href: "/admin/companies", label: "Empresas", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role
  const companyId = session?.user?.companyId
  const [expanded, setExpanded] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    if (companyId || role === "SUPERADMIN") {
      fetch("/api/companies").then(r => r.json()).then((d: any[]) => {
        const c = Array.isArray(d) && d.length > 0 ? d[0] : null
        if (c?.logo) setLogo(c.logo)
      })
    }
  }, [companyId, role])

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <>
      {/* Backdrop for mobile / hover expand */}
      {expanded && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setExpanded(false)} />
      )}

      <aside
        className="fixed left-0 top-0 z-50 h-full flex flex-col bg-[#0B1121] border-r border-[#1E293B] transition-all duration-300 ease-in-out overflow-hidden group"
        style={{ width: expanded ? 240 : 56 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-[#1E293B] transition-all duration-300 ${expanded ? "px-4 h-14 gap-3" : "px-0 h-14 justify-center"}`}>
          {logo ? (
            <img src={logo} alt="" className="h-8 w-8 rounded-lg object-contain bg-white p-0.5 shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">P</div>
          )}
          <span className={`font-semibold text-white text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            Panel Admin
          </span>
        </div>

        {/* Company switcher (superadmin) */}
        {role === "SUPERADMIN" && (
          <div className={`overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 max-h-20 p-2" : "opacity-0 max-h-0 p-0"}`}>
            <CompanySwitcher />
          </div>
        )}

        {/* Main nav */}
        <nav className="flex-1 py-2 px-1.5 space-y-0.5 overflow-y-auto">
          {mainLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center rounded-lg transition-all duration-200 group/link ${expanded ? "px-3 py-2 gap-3" : "px-0 py-2 justify-center"} ${
                isActive(link.href)
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] border border-transparent"
              }`}
              title={!expanded ? link.label : undefined}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                {link.label}
              </span>
              {isActive(link.href) && expanded && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          ))}

          {/* Admin section (superadmin only) */}
          {role === "SUPERADMIN" && (
            <>
              <div className={`pt-4 pb-1 overflow-hidden transition-all duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}>
                <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Admin</p>
              </div>
              {adminLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center rounded-lg transition-all duration-200 ${expanded ? "px-3 py-2 gap-3" : "px-0 py-2 justify-center"} ${
                    isActive(link.href)
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] border border-transparent"
                  }`}
                  title={!expanded ? link.label : undefined}
                >
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-[#1E293B] p-2">
          <div className={`flex items-center rounded-lg transition-all duration-200 ${expanded ? "px-2 py-2 gap-2.5" : "justify-center py-2"}`}>
            <div className="h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "?"}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
              <p className="text-xs font-medium text-slate-300 leading-tight truncate">{session?.user?.name || session?.user?.email}</p>
              <p className="text-[10px] text-slate-500">{role === "SUPERADMIN" ? "Superadmin" : "Admin"}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className={`shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all ${expanded ? "ml-auto" : ""}`}
              title="Cerrar sesión"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
