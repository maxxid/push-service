"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/lib/toast"
import { NotificationPreview } from "@/components/admin/notification-preview"

type CampaignDetail = {
  id: string; title: string; pushMessage: string; imageUrl: string | null
  status: string; priority: string; actionType: string; actionValue: string | null
  deliveries: number; clicks: number; scheduledAt: string | null; sentAt: string | null
  segment?: { id: string; name: string }; landingPage?: { id: string; title: string; slug: string }
  company?: { name: string }; createdAt: string
}

export default function CampaignDetailPage() {
  const params = useParams(); const router = useRouter()
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [sendError, setSendError] = useState("")

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}`).then(r => r.json()).then(setCampaign).finally(() => setLoading(false))
  }, [params.id])

  const handleSend = async () => {
    if (!confirm("¿Enviar esta campaña ahora?")) return
    setSending(true); setSendError("")
    const res = await fetch(`/api/campaigns/${params.id}/send`, { method: "POST" })
    const data = await res.json()
    if (!res.ok) { setSendError(data.error || "Error al enviar"); setSending(false); return }
    toast.success(`Enviada a ${data.sent} suscriptores`)
    setCampaign(p => p ? { ...p, status: "SENT", deliveries: data.sent } : p)
    setSending(false)
  }

  const handleCancel = async () => {
    if (!confirm("¿Cancelar esta campaña programada? Volverá a estado Borrador.")) return
    setSending(true)
    const res = await fetch(`/api/campaigns/${params.id}/cancel`, { method: "POST" })
    if (res.ok) {
      toast.success("Envío cancelado")
      setCampaign(p => p ? { ...p, status: "DRAFT", scheduledAt: null } : p)
    } else {
      toast.error("Error al cancelar")
    }
    setSending(false)
  }

  const handleSaveAsTemplate = async () => {
    setSavingTemplate(true)
    try {
      const c = await fetch(`/api/campaigns/${params.id}`).then(r => r.json())
      let content: any[] = []
      if (c.landingPageId) {
        const l = await fetch(`/api/landing-pages/${c.landingPageId}`).then(r => r.json())
        content = l.content || []
      }
      const res = await fetch("/api/templates", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: c.title, pushMessage: c.pushMessage, landingTitle: c.landingPage?.title || c.title, landingContent: content, actionType: c.actionType, actionValue: c.actionValue, priority: c.priority, companyId: null }) })
      if (res.ok) toast.success("Guardada como plantilla")
      else toast.error("Error al guardar plantilla")
    } catch { toast.error("Error") }
    finally { setSavingTemplate(false) }
  }

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800 rounded-2xl" />)}</div>
  if (!campaign) return <p className="text-red-400">Campaña no encontrada</p>

  const ctr = campaign.deliveries > 0 ? ((campaign.clicks / campaign.deliveries) * 100).toFixed(1) : "0"
  const canSend = campaign.status === "DRAFT" || campaign.status === "SCHEDULED"

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/campaigns")} className="text-slate-500 hover:text-slate-300">← Volver</button>
        <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          campaign.status === "SENT" ? "bg-green-500/10 text-green-400" :
          campaign.status === "SCHEDULED" ? "bg-amber-500/10 text-amber-400" :
          campaign.status === "FAILED" ? "bg-red-500/10 text-red-400" : "bg-slate-800 text-slate-400"
        }`}>
          {campaign.status === "SENT" ? "Enviada" : campaign.status === "SCHEDULED" ? "Programada" : campaign.status === "FAILED" ? "Fallida" : "Borrador"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">Contenido</h2>
              <div className="flex gap-3">
                <NotificationPreview title={campaign.title} message={campaign.pushMessage} imageUrl={campaign.imageUrl} priority={campaign.priority} />
                {campaign.landingPage && (
                  <a href={`/portal/landing/${campaign.landingPage.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300">Ver landing</a>
                )}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Mensaje push</p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap break-words">{campaign.pushMessage}</p>
              {campaign.imageUrl && <img src={campaign.imageUrl} alt="" className="mt-3 max-w-xs rounded-xl" />}
            </div>
          </div>

          {canSend && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Acciones</h2>
              {sendError && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">{sendError}</p>}
              <div className="flex gap-2 flex-wrap">
                {campaign.status === "SCHEDULED" ? (
                  <>
                    <button onClick={handleSend} disabled={sending}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors">
                      {sending ? "Enviando..." : "Enviar ahora"}
                    </button>
                    <button onClick={handleCancel} disabled={sending}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium text-sm rounded-xl transition-colors">
                      {sending ? "Cancelando..." : "Cancelar envío"}
                    </button>
                  </>
                ) : (
                  <button onClick={handleSend} disabled={sending}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors">
                    {sending ? "Enviando..." : "Enviar ahora"}
                  </button>
                )}
                <button onClick={() => router.push(`/admin/campaigns/${params.id}/edit`)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors">Editar</button>
                <button onClick={handleSaveAsTemplate} disabled={savingTemplate}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors disabled:opacity-50">
                  {savingTemplate ? "Guardando..." : "Guardar como plantilla"}
                </button>
              </div>
            </div>
          )}

          {campaign.status === "SENT" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Resultados</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-2xl font-bold text-white">{campaign.deliveries}</p><p className="text-xs text-slate-500 mt-1">Entregas</p></div>
                <div><p className="text-2xl font-bold text-white">{campaign.clicks}</p><p className="text-xs text-slate-500 mt-1">Clics</p></div>
                <div><p className="text-2xl font-bold text-white">{ctr}%</p><p className="text-xs text-slate-500 mt-1">CTR</p></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">Detalles</h3>
          {campaign.company && <div className="flex justify-between text-sm"><span className="text-slate-500">Empresa</span><span className="text-slate-300">{campaign.company.name}</span></div>}
          {campaign.segment && <div className="flex justify-between text-sm"><span className="text-slate-500">Segmento</span><a href={`/admin/segments/${campaign.segment.id}`} className="text-blue-400 hover:text-blue-300">{campaign.segment.name}</a></div>}
          {campaign.landingPage && <div className="flex justify-between text-sm"><span className="text-slate-500">Landing</span><a href={`/admin/landing-pages/${campaign.landingPage.id}`} className="text-blue-400 hover:text-blue-300">{campaign.landingPage.title}</a></div>}
          <div className="flex justify-between text-sm"><span className="text-slate-500">Prioridad</span><span className={campaign.priority === "URGENTE" ? "text-red-400" : "text-slate-300"}>{campaign.priority === "URGENTE" ? "Urgente" : "Normal"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Acción</span><span className="text-slate-300">{campaign.actionType}</span></div>
          {campaign.scheduledAt && <div className="flex justify-between text-sm"><span className="text-slate-500">Programada</span><span className="text-slate-300">{new Date(campaign.scheduledAt).toLocaleString("es-AR")}</span></div>}
          {campaign.sentAt && <div className="flex justify-between text-sm"><span className="text-slate-500">Enviada</span><span className="text-slate-300">{new Date(campaign.sentAt).toLocaleString("es-AR")}</span></div>}
          <div className="flex justify-between text-sm"><span className="text-slate-500">Creada</span><span className="text-slate-300">{new Date(campaign.createdAt).toLocaleString("es-AR")}</span></div>
        </div>
      </div>
    </div>
  )
}
