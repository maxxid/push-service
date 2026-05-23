"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type DashboardData = {
  subscribers: {
    total: number
    active: number
    inactive: number
  }
  campaigns: {
    total: number
    sent: number
    scheduled: number
    totalDeliveries: number
    totalClicks: number
    ctr: string
  }
  recentActivity: {
    campaigns: {
      id: string
      title: string
      status: string
      deliveries: number
      clicks: number
      createdAt: string
    }[]
    subscribers: {
      id: string
      onesignalId: string
      subscribedAt: string
      active: boolean
    }[]
  }
  segments: {
    id: string
    name: string
    subscribers: number
    campaigns: number
  }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>
        <p className="text-zinc-500">Cargando métricas...</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-xs text-zinc-400 mb-1">Suscriptores</p>
          <p className="text-3xl font-bold text-zinc-900">
            {data.subscribers.total}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {data.subscribers.active} activos
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-xs text-zinc-400 mb-1">Campañas enviadas</p>
          <p className="text-3xl font-bold text-zinc-900">
            {data.campaigns.sent}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {data.campaigns.total} totales
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-xs text-zinc-400 mb-1">Notificaciones entregadas</p>
          <p className="text-3xl font-bold text-zinc-900">
            {data.campaigns.totalDeliveries}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {data.campaigns.totalClicks} clics
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <p className="text-xs text-zinc-400 mb-1">CTR promedio</p>
          <p className="text-3xl font-bold text-zinc-900">
            {data.campaigns.ctr}
          </p>
          <p className="text-xs text-zinc-400 mt-1">clic / entregas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-600">
              Campañas recientes
            </h2>
            <Link
              href="/admin/campaigns"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Ver todas →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
            {data.recentActivity.campaigns.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">
                No hay campañas todavía
              </p>
            ) : (
              data.recentActivity.campaigns.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/campaigns/${c.id}`}
                  className="flex items-center justify-between hover:bg-zinc-50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-900 truncate">{c.title}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === "SENT"
                          ? "bg-green-100 text-green-700"
                          : c.status === "SCHEDULED"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {c.status === "SENT"
                        ? "Enviada"
                        : c.status === "SCHEDULED"
                        ? "Programada"
                        : "Borrador"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <h2 className="text-sm font-semibold text-zinc-600 mt-6 mb-3">
            Segmentos principales
          </h2>

          <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-2">
            {data.segments.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">
                No hay segmentos
              </p>
            ) : (
              data.segments.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-zinc-700">{s.name}</span>
                  <span className="text-xs text-zinc-400">
                    {s.subscribers} suscriptores
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-600">
              Nuevos suscriptores
            </h2>
            <Link
              href="/admin/subscribers"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Ver todos →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
            {data.recentActivity.subscribers.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">
                No hay suscriptores todavía
              </p>
            ) : (
              data.recentActivity.subscribers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <code className="text-xs text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {s.onesignalId.slice(0, 14)}...
                    </code>
                    <p className="text-xs text-zinc-400">
                      {new Date(s.subscribedAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  {s.active ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Activo
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
