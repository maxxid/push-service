"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LandingBuilder } from "@/components/portal/landing-builder"
import { type LandingBlock, getDefaultBlocks } from "@/components/portal/landing-blocks"

const actionTypes = [
  { value: "LANDING_INTERNA", label: "Landing interna" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "URL_EXTERNA", label: "URL externa" },
  { value: "PDF", label: "Descargar PDF" },
  { value: "MAPS", label: "Google Maps" },
  { value: "LLAMAR", label: "Llamar" },
  { value: "FORMULARIO", label: "Formulario" },
]

const templates = [
  { value: "", label: "En blanco" },
  { value: "comunicado", label: "Comunicado institucional" },
  { value: "asamblea", label: "Convocatoria a asamblea" },
  { value: "reunion", label: "Reunión informativa" },
  { value: "alerta", label: "Alerta urgente" },
]

export default function NewTemplatePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [pushMessage, setPushMessage] = useState("")
  const [landingTitle, setLandingTitle] = useState("")
  const [blocks, setBlocks] = useState<LandingBlock[]>([])
  const [actionType, setActionType] = useState("LANDING_INTERNA")
  const [actionValue, setActionValue] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [template, setTemplate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTemplate = (val: string) => {
    setTemplate(val)
    if (val) setBlocks(getDefaultBlocks(val))
    else setBlocks([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !pushMessage || !landingTitle) {
      setError("Nombre, mensaje y título de landing son obligatorios")
      return
    }
    setLoading(true)
    setError("")

    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, description: description || null, pushMessage, landingTitle,
        landingContent: blocks, actionType, actionValue: actionValue || null, priority,
        companyId: null,
      }),
    })

    if (!res.ok) { setError("Error al crear"); setLoading(false); return }
    router.push("/admin/templates")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Nueva plantilla</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre de la plantilla</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comunicado semanal" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Prioridad</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="NORMAL">Normal</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Descripción (opcional)</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Para qué se usa esta plantilla" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Mensaje push</label>
            <textarea value={pushMessage} onChange={e => setPushMessage(e.target.value)} required rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mensaje que verán en la notificación..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Título de la landing</label>
              <input type="text" value={landingTitle} onChange={e => setLandingTitle(e.target.value)} required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comunicado - Mayo 2026" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Tipo de acción</label>
              <select value={actionType} onChange={e => { setActionType(e.target.value); setActionValue("") }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {actionTypes.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Template inicial de landing</label>
            <select value={template} onChange={e => handleTemplate(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {templates.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <LandingBuilder initialBlocks={blocks} onChange={setBlocks} />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear plantilla"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
