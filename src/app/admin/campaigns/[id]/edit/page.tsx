"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"

type Segment = { id: string; name: string; companyId: string }
type LandingPage = { id: string; title: string; slug: string; companyId: string }

type CampaignData = {
  title: string; pushMessage: string; imageUrl: string | null
  actionType: string; actionValue: string | null; priority: string
  segmentId: string | null; landingPageId: string | null
  landingPage?: { id: string; title: string; slug: string }
}

const actionTypes = [
  { value: "LANDING_INTERNA", label: "Landing interna" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "URL_EXTERNA", label: "URL externa" },
  { value: "PDF", label: "Descargar PDF" },
  { value: "MAPS", label: "Google Maps" },
  { value: "LLAMAR", label: "Llamar" },
  { value: "FORMULARIO", label: "Formulario" },
]

export default function EditCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [pushMessage, setPushMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [actionType, setActionType] = useState("LANDING_INTERNA")
  const [actionValue, setActionValue] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [segmentId, setSegmentId] = useState("")
  const [landingPageId, setLandingPageId] = useState("")
  const [linkedLanding, setLinkedLanding] = useState<{ id: string; title: string; slug: string } | null>(null)

  const [segments, setSegments] = useState<Segment[]>([])
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns/${params.id}`).then(r => r.json()),
      fetch("/api/segments").then(r => r.json()),
      fetch("/api/landing-pages").then(r => r.json()),
    ]).then(([campaign, segs, lands]) => {
      if (campaign.error) { setError("Campaña no encontrada"); return }
      setTitle(campaign.title || "")
      setPushMessage(campaign.pushMessage || "")
      setImageUrl(campaign.imageUrl || "")
      setActionType(campaign.actionType || "LANDING_INTERNA")
      setActionValue(campaign.actionValue || "")
      setPriority(campaign.priority || "NORMAL")
      setSegmentId(campaign.segmentId || "")
      setLandingPageId(campaign.landingPageId || "")
      if (campaign.landingPage) setLinkedLanding(campaign.landingPage)
      else setLinkedLanding(null)
      setSegments(Array.isArray(segs) ? segs : [])
      setLandingPages(Array.isArray(lands) ? lands : [])
    }).catch(() => setError("Error al cargar")).finally(() => setLoading(false))
  }, [params.id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const res = await fetch(`/api/campaigns/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, pushMessage, imageUrl: imageUrl || null,
        actionType, actionValue: actionValue || null,
        priority, segmentId: segmentId || null,
        landingPageId: landingPageId || null,
      }),
    })

    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error || "Error al guardar")
    } else {
      toast.success("Campaña actualizada")
      router.push(`/admin/campaigns/${params.id}`)
    }

    setSaving(false)
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>
  if (error && !title) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-600">← Volver</button>
        <h1 className="text-2xl font-bold text-zinc-900">Editar campaña</h1>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Título</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Prioridad</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="NORMAL">Normal</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Mensaje push</label>
            <textarea value={pushMessage} onChange={e => setPushMessage(e.target.value)} required rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">URL de imagen (opcional)</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Segmento</label>
              <select value={segmentId} onChange={e => setSegmentId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos los suscriptores</option>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Tipo de acción</label>
              <select value={actionType} onChange={e => { setActionType(e.target.value); setActionValue("") }}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {actionTypes.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>

          {(actionType === "WHATSAPP" || actionType === "URL_EXTERNA" || actionType === "MAPS" || actionType === "LLAMAR") && (
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                {actionType === "WHATSAPP" ? "Número WhatsApp" : actionType === "MAPS" ? "Dirección" : actionType === "LLAMAR" ? "Teléfono" : "URL"}
              </label>
              <input type="text" value={actionValue} onChange={e => setActionValue(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}

          {(actionType === "LANDING_INTERNA" || actionType === "FORMULARIO") && (
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Landing page de destino</label>
              <select value={landingPageId} onChange={e => setLandingPageId(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Ninguna</option>
                {landingPages.map(lp => <option key={lp.id} value={lp.id}>{lp.title} ({lp.slug})</option>)}
              </select>

              {linkedLanding && (
                <div className="mt-3 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-800 truncate">{linkedLanding.title}</p>
                    <p className="text-xs text-blue-500">/landing/{linkedLanding.slug}</p>
                  </div>
                  <a
                    href={`/admin/landing-pages/${linkedLanding.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shrink-0"
                  >
                    Editar landing →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
