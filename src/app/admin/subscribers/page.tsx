"use client"

import { useEffect, useState } from "react"
import { toast } from "@/lib/toast"

type Sub = { id: string; onesignalId: string; active: boolean; subscribedAt: string; deviceInfo: unknown; company?: { name: string }; segments: { segment: { id: string; name: string } }[] }

export default function SubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch("/api/subscribers").then(r => r.json()).then((d: any[]) => setSubs(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }, [])

  const filtered = filter ? subs.filter(s => s.onesignalId.toLowerCase().includes(filter.toLowerCase())) : subs

  const deviceLabel = (info: unknown) => {
    const d = info as Record<string, string> | null; if (!d) return "?"
    const ua = d.userAgent || ""; if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"; if (ua.includes("Android")) return "Android"; if (ua.includes("Windows")) return "Win"; return "Web"
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(s => s.id)))
  }

  const handleBulkDelete = async () => {
    if (selected.size === 0) { toast.error("Seleccioná al menos un suscriptor"); return }
    if (!confirm(`¿Eliminar ${selected.size} suscriptor${selected.size > 1 ? "es" : ""}? Los afiliados asociados quedarán libres para re-suscribirse.`)) return
    setDeleting(true)
    const res = await fetch("/api/subscribers/bulk-delete", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    })
    if (res.ok) {
      const data = await res.json()
      toast.success(`${data.deleted} suscriptor${data.deleted > 1 ? "es" : ""} eliminado${data.deleted > 1 ? "s" : ""}`)
      setSelected(new Set())
      setSubs(p => p.filter(s => !selected.has(s.id)))
    } else {
      toast.error("Error al eliminar")
    }
    setDeleting(false)
  }

  const handleDeleteOne = async (id: string) => {
    if (!confirm("¿Eliminar este suscriptor? El afiliado asociado quedará libre.")) return
    const res = await fetch("/api/subscribers/bulk-delete", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    })
    if (res.ok) { toast.success("Eliminado"); setSubs(p => p.filter(s => s.id !== id)) }
    else toast.error("Error")
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
        className="w-full max-w-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-slate-400">{selected.size} seleccionado{selected.size > 1 ? "s" : ""}</span>
          <button onClick={handleBulkDelete} disabled={deleting}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
            {deleting ? "Eliminando..." : `Eliminar ${selected.size}`}
          </button>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr className="text-left text-xs font-medium text-slate-500">
              <th className="px-5 py-3 w-10">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={selectAll} className="rounded accent-blue-500" />
              </th>
              <th className="px-5 py-3">Dispositivo</th>
              <th className="px-5 py-3 hidden md:table-cell">Empresa</th>
              <th className="px-5 py-3 hidden lg:table-cell">Segmentos</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right hidden md:table-cell">Fecha</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">{filter ? "Sin resultados" : "No hay suscriptores"}</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 ${selected.has(s.id) ? "bg-blue-500/5" : ""}`}>
                <td className="px-5 py-3">
                  <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded accent-blue-500" />
                </td>
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
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDeleteOne(s.id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
