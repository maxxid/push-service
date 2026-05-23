"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Campaign = {
  id: string
  title: string
  pushMessage: string
  status: string
  priority: string
  actionType: string
  actionValue: string | null
  imageUrl: string | null
  segmentId: string | null
  landingPageId: string | null
  deliveries: number
  clicks: number
  scheduledAt: string | null
  sentAt: string | null
  segment?: { name: string; id: string }
  landingPage?: { title: string; id: string }
  company?: { name: string }
  createdAt: string
}

const statusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  SCHEDULED: "Programada",
  SENT: "Enviada",
  FAILED: "Fallida",
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-zinc-100 text-zinc-600",
  SCHEDULED: "bg-amber-100 text-amber-700",
  SENT: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")

  const fetchCampaigns = () => {
    const url = statusFilter
      ? `/api/campaigns?status=${statusFilter}`
      : "/api/campaigns"
    fetch(url)
      .then((r) => r.json())
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCampaigns()
  }, [statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta campaña?")) return
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
    fetchCampaigns()
  }

  const handleDuplicate = async (c: Campaign) => {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${c.title} (copia)`,
        pushMessage: c.pushMessage,
        actionType: c.actionType,
        actionValue: c.actionValue,
        imageUrl: c.imageUrl,
        priority: c.priority,
        segmentId: c.segmentId ?? c.segment?.id ?? null,
        landingPageId: c.landingPageId ?? c.landingPage?.id ?? null,
        companyId: null,
      }),
    })

    if (res.ok) {
      fetchCampaigns()
    }
  }

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Campañas</h1>
        <Link href="/admin/campaigns/new">
          <Button>Nueva campaña</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {["", "DRAFT", "SCHEDULED", "SENT", "FAILED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {s ? statusLabels[s] || s : "Todas"}
          </button>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay campañas</p>
          <Link href="/admin/campaigns/new">
            <Button variant="outline" size="sm">
              Crear la primera
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-900 truncate">
                      {c.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[c.status] || statusColors.DRAFT
                      }`}
                    >
                      {statusLabels[c.status] || c.status}
                    </span>
                    {c.priority === "URGENTE" && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 break-words line-clamp-2">
                    {c.pushMessage}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                    {c.segment && <span>🎯 {c.segment.name}</span>}
                    {c.company && <span>🏢 {c.company.name}</span>}
                    {c.deliveries > 0 && (
                      <span>
                        📤 {c.deliveries} envios · {c.clicks} clics
                      </span>
                    )}
                    {c.scheduledAt && (
                      <span>
                        🕐 {new Date(c.scheduledAt).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}
                      </span>
                    )}
                    {c.sentAt && (
                      <span>
                        ✅ {new Date(c.sentAt).toLocaleString("es-AR")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/admin/campaigns/${c.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleDuplicate(c)}
                    className="text-zinc-500 hover:text-zinc-700 text-sm"
                    title="Duplicar"
                  >
                    Duplicar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Eliminar"
                  >
                    Eliminar
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
