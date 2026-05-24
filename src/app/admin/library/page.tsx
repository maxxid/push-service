"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "@/lib/toast"

type Item = {
  id: string; title: string; type: "campaign" | "template"
  pushMessage?: string; status?: string; priority?: string; description?: string
  deliveries?: number; clicks?: number
  scheduledAt?: string; sentAt?: string; createdAt: string
  segment?: { name: string }; landingPage?: { title: string }
}

const tabs = ["Todas", "Enviadas", "Borradores", "Programadas", "Plantillas"] as const
type Tab = typeof tabs[number]

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Borrador", color: "bg-slate-800 text-slate-400" },
  SCHEDULED: { label: "Programada", color: "bg-amber-500/10 text-amber-400" },
  SENT: { label: "Enviada", color: "bg-green-500/10 text-green-400" },
  FAILED: { label: "Fallida", color: "bg-red-500/10 text-red-400" },
}

export default function LibraryPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("Todas")
  const [search, setSearch] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/campaigns").then(r => r.json()),
      fetch("/api/templates").then(r => r.json()),
    ]).then(([campaigns, templates]) => {
      const cItems: Item[] = (Array.isArray(campaigns) ? campaigns : []).map((c: any) => ({
        ...c, type: "campaign", pushMessage: c.pushMessage, status: c.status, priority: c.priority,
        deliveries: c.deliveries, clicks: c.clicks,
        scheduledAt: c.scheduledAt, sentAt: c.sentAt,
        createdAt: c.createdAt, segment: c.segment, landingPage: c.landingPage,
      }))
      const tItems: Item[] = (Array.isArray(templates) ? templates : []).map((t: any) => ({
        ...t, type: "template", pushMessage: t.pushMessage, description: t.description,
        createdAt: t.createdAt, priority: t.priority,
      }))
      setItems([...cItems, ...tItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i => {
    if (search && !i.title?.toLowerCase().includes(search.toLowerCase()) && !i.pushMessage?.toLowerCase().includes(search.toLowerCase())) return false
    if (tab === "Plantillas") return i.type === "template"
    if (i.type === "template") return false
    if (tab === "Enviadas") return i.status === "SENT"
    if (tab === "Borradores") return i.status === "DRAFT"
    if (tab === "Programadas") return i.status === "SCHEDULED"
    return true
  })

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar?")) return
    setActionLoading(`del-${id}`)
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
    setActionLoading(null); toast.success("Eliminado")
    setItems(p => p.filter(i => i.id !== id))
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("¿Eliminar?")) return
    setActionLoading(`del-${id}`)
    await fetch(`/api/templates/${id}`, { method: "DELETE" })
    setActionLoading(null); toast.success("Eliminado")
    setItems(p => p.filter(i => i.id !== id))
  }

  const handleUseTemplate = async (t: Item) => {
    const res = await fetch(`/api/templates/${t.id}/use`, { method: "POST" })
    if (res.ok) toast.success("Campaña creada desde plantilla")
  }

  if (loading) return (
    <div className="animate-pulse space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-800 rounded-2xl" />)}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Biblioteca</h1>
          <p className="text-slate-400 text-sm mt-1">{items.length} elementos</p>
        </div>
        <Link href="/admin/campaigns/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors">
          ✚ Nueva
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}>
              {t}
            </button>
          ))}
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..." className="flex-1 max-w-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-3">No hay elementos{tab !== "Todas" ? ` en "${tab}"` : ""}</p>
          <Link href="/admin/campaigns/new" className="text-blue-400 hover:text-blue-300 text-sm">Crear nueva campaña →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div key={`${item.type}-${item.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white truncate">{item.title}</span>
                    {item.type === "template" ? (
                      <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">Plantilla</span>
                    ) : (
                      item.status && <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusMap[item.status]?.color}`}>{statusMap[item.status]?.label}</span>
                    )}
                    {item.priority === "URGENTE" && (
                      <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">Urgente</span>
                    )}
                  </div>
                  {item.pushMessage && <p className="text-xs text-slate-400 line-clamp-2">{item.pushMessage}</p>}
                  {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                {item.segment && <span>🎯 {item.segment.name}</span>}
                {item.landingPage && <span>📄 {item.landingPage.title}</span>}
                {item.deliveries! > 0 && <span>📤 {item.deliveries} envios · {item.clicks} clics</span>}
                {item.sentAt && <span>✅ {new Date(item.sentAt).toLocaleString("es-AR")}</span>}
                <span className="text-slate-600">{new Date(item.createdAt).toLocaleDateString("es-AR")}</span>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
                {item.type === "template" ? (
                  <>
                    <Link href={`/admin/templates/${item.id}`}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium">Editar</Link>
                    <button onClick={() => handleUseTemplate(item)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Usar</button>
                    <button onClick={() => handleDeleteTemplate(item.id)} disabled={actionLoading === `del-${item.id}`}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-30 ml-auto">
                      {actionLoading === `del-${item.id}` ? "..." : "Eliminar"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={`/admin/campaigns/${item.id}`}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium">Ver detalle</Link>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/admin/campaigns/${item.id}`) }}
                      className="text-xs text-slate-400 hover:text-white">Copiar link</button>
                    {item.status !== "SENT" && (
                      <Link href={`/admin/campaigns/${item.id}/edit`}
                        className="text-xs text-amber-400 hover:text-amber-300">Editar</Link>
                    )}
                    <button onClick={() => handleDelete(item.id)} disabled={actionLoading === `del-${item.id}`}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-30 ml-auto">
                      {actionLoading === `del-${item.id}` ? "..." : "Eliminar"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
