"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "@/lib/toast"

type Campaign = {
  id: string; title: string; pushMessage: string; status: string; priority: string
  actionType: string; actionValue: string | null; imageUrl: string | null
  segmentId: string | null; landingPageId: string | null
  deliveries: number; clicks: number
  scheduledAt: string | null; sentAt: string | null
  segment?: { name: string; id: string }; landingPage?: { title: string; id: string }
  company?: { name: string }; createdAt: string
  parentCampaignId?: string | null; reminderTarget?: string | null
}

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Borrador", color: "bg-slate-800 text-slate-400" },
  SCHEDULED: { label: "Programada", color: "bg-amber-500/10 text-amber-400" },
  SENT: { label: "Enviada", color: "bg-green-500/10 text-green-400" },
  FAILED: { label: "Fallida", color: "bg-red-500/10 text-red-400" },
}

export default function CampaignsPage() {
  const searchParams = useSearchParams()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")

  const fetchCampaigns = () => {
    const url = statusFilter ? `/api/campaigns?status=${statusFilter}` : "/api/campaigns"
    fetch(url).then(r => r.json()).then(d => setCampaigns(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCampaigns() }, [statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta campaña?")) return
    setActionLoading(`del-${id}`)
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
    setActionLoading(null); toast.success("Campaña eliminada"); fetchCampaigns()
  }

  const handleDuplicate = async (c: Campaign) => {
    setActionLoading(`dup-${c.id}`)
    const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${c.title} (copia)`, pushMessage: c.pushMessage, actionType: c.actionType, actionValue: c.actionValue, imageUrl: c.imageUrl, priority: c.priority, segmentId: c.segmentId ?? c.segment?.id ?? null, landingPageId: c.landingPageId ?? c.landingPage?.id ?? null, companyId: null }) })
    setActionLoading(null)
    if (res.ok) { toast.success("Campaña duplicada"); fetchCampaigns() }
  }

  if (loading) return (
    <div className="animate-pulse space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-800 rounded-2xl" />)}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Campañas</h1>
        <Link href="/admin/campaigns/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors">
          ✚ Nueva
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {["", "DRAFT", "SCHEDULED", "SENT", "FAILED"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}>
            {s ? (statusMap[s]?.label || s) : "Todas"}
          </button>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-3">No hay campañas</p>
          <Link href="/admin/campaigns/new" className="text-blue-400 hover:text-blue-300 text-sm">Crear la primera →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Link href={`/admin/campaigns/${c.id}`} className="font-semibold text-white hover:text-blue-400 truncate">
                      {c.title}
                    </Link>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusMap[c.status]?.color}`}>
                      {statusMap[c.status]?.label}
                    </span>
                    {c.priority === "URGENTE" && (
                      <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-medium">Urgente</span>
                    )}
                    {c.parentCampaignId && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">⏰ Recordatorio</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{c.pushMessage}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    {c.segment && <span>🎯 {c.segment.name}</span>}
                    {c.company && <span>🏢 {c.company.name}</span>}
                    {c.deliveries > 0 && <span>📤 {c.deliveries} envios · {c.clicks} clics</span>}
                    {c.scheduledAt && <span>🕐 {new Date(c.scheduledAt).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}</span>}
                    {c.sentAt && <span>✅ {new Date(c.sentAt).toLocaleString("es-AR")}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link href={`/admin/campaigns/${c.id}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Ver</Link>
                  <button onClick={() => handleDuplicate(c)} disabled={actionLoading === `dup-${c.id}`}
                    className="text-sm text-slate-400 hover:text-white disabled:opacity-30">
                    {actionLoading === `dup-${c.id}` ? "..." : "Duplicar"}
                  </button>
                  <button onClick={() => handleDelete(c.id)} disabled={actionLoading === `del-${c.id}`}
                    className="text-sm text-red-400 hover:text-red-300 disabled:opacity-30">
                    {actionLoading === `del-${c.id}` ? "..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
