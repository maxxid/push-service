"use client"

import { useEffect, useState } from "react"

type Sub = { id: string; onesignalId: string; active: boolean; subscribedAt: string; deviceInfo: unknown; company?: { name: string }; segments: { segment: { id: string; name: string } }[] }

export default function SubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetch("/api/subscribers").then(r => r.json()).then((d: any[]) => setSubs(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }, [])

  const filtered = filter ? subs.filter(s => s.onesignalId.toLowerCase().includes(filter.toLowerCase())) : subs

  const deviceLabel = (info: unknown) => {
    const d = info as Record<string, string> | null; if (!d) return "?"
    const ua = d.userAgent || ""; if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"; if (ua.includes("Android")) return "Android"; if (ua.includes("Windows")) return "Win"; return "Web"
  }

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Suscriptores</h1>
          <p className="text-sm text-slate-400 mt-1">{subs.length} total · {subs.filter(s => s.active).length} activos</p>
        </div>
        <a href="/api/export/subscribers" download className="text-xs text-slate-400 hover:text-white">Exportar CSV</a>
      </div>
      <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Buscar por ID..."
        className="w-full max-w-sm px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr className="text-left text-xs font-medium text-slate-500">
              <th className="px-5 py-3">Dispositivo</th>
              <th className="px-5 py-3 hidden md:table-cell">Empresa</th>
              <th className="px-5 py-3 hidden lg:table-cell">Segmentos</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right hidden md:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">{filter ? "Sin resultados" : "No hay suscriptores"}</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{deviceLabel(s.deviceInfo)}</span>
                    <code className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{s.onesignalId.slice(0, 8)}...</code>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{s.company?.name || "-"}</td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">{s.segments.length === 0 ? <span className="text-xs text-slate-600">-</span> : s.segments.map(seg => <span key={seg.segment.id} className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{seg.segment.name}</span>)}</div>
                </td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-500"}`}>{s.active ? "Activo" : "Inactivo"}</span></td>
                <td className="px-5 py-3 text-right text-slate-500 hidden md:table-cell">{new Date(s.subscribedAt).toLocaleDateString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
