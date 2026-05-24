"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

type DashboardData = {
  subscribers: { total: number; active: number; inactive: number }
  campaigns: { total: number; sent: number; scheduled: number; totalDeliveries: number; totalClicks: number; ctr: string }
  recentActivity: { campaigns: any[]; subscribers: any[] }
  segments: { id: string; name: string; subscribers: number; campaigns: number }[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Admin"

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="h-40 bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800 rounded-2xl" />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-white">¡Hola, {userName}! 👋</h1>
        <p className="text-slate-400 mt-1">Aquí está el estado de tu comunicación institucional</p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/10 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Crear nueva campaña</h2>
            <p className="text-slate-400 text-sm mt-1">Comunicados, alertas y avisos en minutos</p>
          </div>
          <Link href="/admin/campaigns/new"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors">
            ✚ Nueva Campaña
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/campaigns?status=SENT" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors block cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-300">Campañas enviadas</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.campaigns.sent || 0}</p>
          <p className="text-xs text-slate-500 mt-1">{data?.campaigns.totalDeliveries || 0} entregas · CTR {data?.campaigns.ctr || "0%"}</p>
        </Link>

        <Link href="/admin/campaigns?status=SCHEDULED" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors block cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-300">Programadas</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.campaigns.scheduled || 0}</p>
          <p className="text-xs text-slate-500 mt-1">{(data?.campaigns.total ?? 0) - (data?.campaigns.sent ?? 0) - (data?.campaigns.scheduled ?? 0)} borradores</p>
        </Link>

        <Link href="/admin/subscribers" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors block cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-300">Suscriptores</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.subscribers.total || 0}</p>
          <p className="text-xs text-slate-500 mt-1">{data?.subscribers.active || 0} activos</p>
        </Link>
      </div>

      {/* Last campaign + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Actividad reciente</h3>
          {data?.recentActivity.campaigns.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-slate-500 text-sm">No hay campañas todavía</p>
              <Link href="/admin/campaigns/new" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">Crear la primera →</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {data?.recentActivity.campaigns.map((c: any) => (
                <Link key={c.id} href={`/admin/campaigns/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{c.title}</p>
                    <p className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {c.status === "SENT" && (
                      <span className="text-xs text-slate-400">{c.deliveries} envios · {c.clicks} clics</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === "SENT" ? "bg-green-500/10 text-green-400" :
                      c.status === "SCHEDULED" ? "bg-amber-500/10 text-amber-400" :
                      "bg-slate-800 text-slate-400"
                    }`}>
                      {c.status === "SENT" ? "Enviada" : c.status === "SCHEDULED" ? "Programada" : "Borrador"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Atajos rápidos</h3>
            <div className="space-y-2">
              <Link href="/admin/campaigns/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                </div>
                <span className="text-sm font-medium">Nueva Campaña</span>
              </Link>
              <Link href="/admin/segments/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <span className="text-sm font-medium">Nuevo Segmento</span>
              </Link>
              <Link href="/admin/templates" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <span className="text-sm font-medium">Ver Plantillas</span>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Nuevos suscriptores</h3>
            {data?.recentActivity.subscribers.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Sin suscriptores recientes</p>
            ) : (
              <div className="space-y-2">
                {data?.recentActivity.subscribers.slice(0, 4).map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{new Date(s.subscribedAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>
                    <span className={s.active ? "text-green-400" : "text-slate-600"}>{s.active ? "Activo" : "Inactivo"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
