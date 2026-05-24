"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LandingBuilder } from "@/components/portal/landing-builder"
import { type LandingBlock } from "@/components/portal/landing-blocks"

const actionTypes = [
  { value: "LANDING_INTERNA", label: "Landing interna" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "URL_EXTERNA", label: "URL externa" },
  { value: "PDF", label: "Descargar PDF" },
  { value: "MAPS", label: "Google Maps" },
  { value: "LLAMAR", label: "Llamar" },
  { value: "FORMULARIO", label: "Formulario" },
]

type TemplateDetail = {
  id: string; name: string; description: string | null
  pushMessage: string; landingTitle: string; landingContent: LandingBlock[]
  actionType: string; actionValue: string | null; priority: string
  company?: { name: string }
}

export default function EditTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<TemplateDetail | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [pushMessage, setPushMessage] = useState("")
  const [landingTitle, setLandingTitle] = useState("")
  const [blocks, setBlocks] = useState<LandingBlock[]>([])
  const [actionType, setActionType] = useState("LANDING_INTERNA")
  const [actionValue, setActionValue] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/templates/${params.id}`).then(r => r.json()).then(data => {
      setTemplate(data)
      setName(data.name); setDescription(data.description || ""); setPushMessage(data.pushMessage)
      setLandingTitle(data.landingTitle); setBlocks(Array.isArray(data.landingContent) ? data.landingContent : [])
      setActionType(data.actionType); setActionValue(data.actionValue || ""); setPriority(data.priority)
    }).finally(() => setLoading(false))
  }, [params.id])

  const handleSave = async () => {
    setSaving(true); setSaved(false)
    await fetch(`/api/templates/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || null, pushMessage, landingTitle, landingContent: blocks, actionType, actionValue: actionValue || null, priority }),
    })
    setSaved(true); setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleUse = async () => {
    const res = await fetch(`/api/templates/${params.id}/use`, { method: "POST" })
    if (res.ok) {
      const { campaign } = await res.json()
      router.push(`/admin/campaigns/${campaign.id}`)
    }
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/templates")} className="text-zinc-400 hover:text-zinc-600">← Volver</button>
          <h1 className="text-2xl font-bold text-zinc-900">Editar plantilla</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUse}>Usar ahora →</Button>
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
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
            <label className="block text-xs font-medium text-zinc-600 mb-1">Descripción</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Mensaje push</label>
            <textarea value={pushMessage} onChange={e => setPushMessage(e.target.value)} rows={2}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Título landing</label>
              <input type="text" value={landingTitle} onChange={e => setLandingTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Tipo de acción</label>
              <select value={actionType} onChange={e => setActionType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {actionTypes.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <LandingBuilder initialBlocks={blocks} onChange={setBlocks} />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
          </Button>
          <Button variant="outline" onClick={handleUse}>Usar ahora →</Button>
        </div>
      </div>
    </div>
  )
}
