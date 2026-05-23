"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type SubscriberData = {
  id: string
  onesignalId: string
  active: boolean
  subscribedAt: string
  deviceInfo: unknown
  company?: { name: string }
  segments: { segment: { id: string; name: string } }[]
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  const fetchSubscribers = () => {
    fetch("/api/subscribers")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const filtered = filter
    ? subscribers.filter((s) =>
        s.onesignalId.toLowerCase().includes(filter.toLowerCase())
      )
    : subscribers

  const deviceLabel = (info: unknown) => {
    const d = info as Record<string, string> | null
    if (!d) return "Desconocido"
    const ua = d.userAgent || ""
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
    if (ua.includes("Android")) return "Android"
    if (ua.includes("Windows")) return "Windows"
    return "Web"
  }

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Suscriptores</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {subscribers.length} total · {subscribers.filter((s) => s.active).length} activos
          </p>
        </div>
        <a href="/api/export/subscribers" download>
          <Button variant="outline" size="sm">
            Exportar CSV
          </Button>
        </a>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar por OneSignal ID..."
          className="w-full max-w-sm px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-zinc-600">
                OneSignal ID
              </th>
              <th className="text-left px-6 py-3 font-medium text-zinc-600 hidden md:table-cell">
                Dispositivo
              </th>
              <th className="text-left px-6 py-3 font-medium text-zinc-600 hidden md:table-cell">
                Empresa
              </th>
              <th className="text-left px-6 py-3 font-medium text-zinc-600 hidden lg:table-cell">
                Segmentos
              </th>
              <th className="text-left px-6 py-3 font-medium text-zinc-600">
                Estado
              </th>
              <th className="text-right px-6 py-3 font-medium text-zinc-600 hidden md:table-cell">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  {filter
                    ? "Sin resultados para esa búsqueda"
                    : "No hay suscriptores todavía"}
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50"
                >
                  <td className="px-6 py-3">
                    <code className="text-xs text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {s.onesignalId.slice(0, 12)}...
                    </code>
                  </td>
                  <td className="px-6 py-3 text-zinc-600 hidden md:table-cell">
                    {deviceLabel(s.deviceInfo)}
                  </td>
                  <td className="px-6 py-3 text-zinc-600 hidden md:table-cell">
                    {s.company?.name ?? "-"}
                  </td>
                  <td className="px-6 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {s.segments.length === 0 ? (
                        <span className="text-xs text-zinc-400">-</span>
                      ) : (
                        s.segments.map((seg) => (
                          <span
                            key={seg.segment.id}
                            className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                          >
                            {seg.segment.name}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {s.active ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right text-zinc-500 hidden md:table-cell">
                    {new Date(s.subscribedAt).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
