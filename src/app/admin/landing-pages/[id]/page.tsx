"use client"
import { useEffect, useState } from "react"; import { useParams, useRouter } from "next/navigation"; import { toast } from "@/lib/toast"
import { LandingBuilder } from "@/components/portal/landing-builder"; import type { LandingBlock } from "@/components/portal/landing-blocks"

export default function EditLandingPage() {
  const params = useParams(); const router = useRouter()
  const [landing, setLanding] = useState<any>(null); const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<LandingBlock[]>([]); const [published, setPublished] = useState(false)
  const [expiresAt, setExpiresAt] = useState(""); const [noExpiry, setNoExpiry] = useState(false)
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)

  useEffect(() => { fetch(`/api/landing-pages/${params.id}`).then(r => r.json()).then(data => { setLanding(data); setTitle(data.title); setBlocks(Array.isArray(data.content) ? data.content : []); setPublished(data.published); if (data.expiresAt) { const d = new Date(data.expiresAt); setExpiresAt(d.toISOString().slice(0, 16)) } else { setExpiresAt(""); setNoExpiry(true) } }).finally(() => setLoading(false)) }, [params.id])

  const handleSave = async () => { setSaving(true); const expiry = noExpiry ? null : expiresAt ? `${expiresAt}:00-03:00` : null; await fetch(`/api/landing-pages/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content: blocks, published, expiresAt: expiry }) }); toast.success("Landing actualizada"); setSaving(false) }

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-slate-800 rounded-xl mb-6" /><div className="h-64 bg-slate-800 rounded-2xl" /></div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><button onClick={() => router.push("/admin/landing-pages")} className="text-slate-500 hover:text-slate-300">← Volver</button><h1 className="text-2xl font-bold text-white">Editar landing</h1></div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl">{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      <div className="max-w-4xl space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Título</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Slug</label><input type="text" value={landing?.slug || ""} disabled className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-500" /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded accent-blue-500" /><span className="text-sm text-slate-300">Publicada</span>{published && <a href={`/portal/landing/${landing?.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400">Ver →</a>}</label>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Vence el <span className="text-slate-600">(UTC-3 Bs As)</span></label>
                <input type="datetime-local" value={expiresAt} onChange={e => { setExpiresAt(e.target.value); setNoExpiry(false) }}
                  disabled={noExpiry}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={noExpiry} onChange={e => { setNoExpiry(e.target.checked); if (e.target.checked) setExpiresAt("") }}
                  className="rounded accent-blue-500" />
                <span className="text-sm text-slate-400">Sin vencimiento</span>
              </label>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6"><LandingBuilder initialBlocks={blocks} onChange={setBlocks} /></div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl">{saving ? "Guardando..." : "Guardar cambios"}</button>
      </div>
    </div>
  )
}
