"use client"
import { useState, useEffect } from "react"; import { useParams, useRouter } from "next/navigation"; import { toast } from "@/lib/toast"
import { LandingBuilder } from "@/components/portal/landing-builder"; import type { LandingBlock } from "@/components/portal/landing-blocks"

const ats = [{ v: "LANDING_INTERNA", l: "Landing" },{ v: "WHATSAPP", l: "WhatsApp" },{ v: "URL_EXTERNA", l: "URL" },{ v: "PDF", l: "PDF" },{ v: "MAPS", l: "Maps" },{ v: "LLAMAR", l: "Llamar" }]

export default function EditTemplatePage() {
  const params = useParams(); const router = useRouter()
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [msg, setMsg] = useState(""); const [ltitle, setLtitle] = useState("")
  const [blocks, setBlocks] = useState<LandingBlock[]>([]); const [at, setAt] = useState("LANDING_INTERNA"); const [av, setAv] = useState(""); const [pri, setPri] = useState("NORMAL")
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)

  useEffect(() => { fetch(`/api/templates/${params.id}`).then(r => r.json()).then(data => { setName(data.name); setDesc(data.description || ""); setMsg(data.pushMessage); setLtitle(data.landingTitle); setBlocks(Array.isArray(data.landingContent) ? data.landingContent : []); setAt(data.actionType); setAv(data.actionValue || ""); setPri(data.priority) }).finally(() => setLoading(false)) }, [params.id])

  const hs = async () => { setSaving(true); await fetch(`/api/templates/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: desc || null, pushMessage: msg, landingTitle: ltitle, landingContent: blocks, actionType: at, actionValue: av || null, priority: pri }) }); toast.success("Guardado"); setSaving(false) }
  const hu = async () => { const res = await fetch(`/api/templates/${params.id}/use`, { method: "POST" }); if (res.ok) { const { campaign } = await res.json(); router.push(`/admin/campaigns/${campaign.id}`) } }

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-slate-800 rounded-xl mb-6" /><div className="h-64 bg-slate-800 rounded-2xl" /></div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><button onClick={() => router.push("/admin/templates")} className="text-slate-500 hover:text-slate-300">← Volver</button><h1 className="text-2xl font-bold text-white">Editar plantilla</h1></div>
        <div className="flex gap-2"><button onClick={hu} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl">Usar ahora →</button><button onClick={hs} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl">{saving ? "Guardando..." : "Guardar"}</button></div>
      </div>
      <div className="max-w-4xl space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Nombre</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Prioridad</label><select value={pri} onChange={e => setPri(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"><option value="NORMAL">Normal</option><option value="URGENTE">Urgente</option></select></div>
          </div>
          <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Descripción</label><input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Mensaje push</label><textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Título landing</label><input type="text" value={ltitle} onChange={e => setLtitle(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Tipo acción</label><select value={at} onChange={e => setAt(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">{ats.map(a => <option key={a.v} value={a.v}>{a.l}</option>)}</select></div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6"><LandingBuilder initialBlocks={blocks} onChange={setBlocks} /></div>
        <button onClick={hs} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl">{saving ? "Guardando..." : "Guardar cambios"}</button>
      </div>
    </div>
  )
}
