"use client"

import { useState, useEffect } from "react"
import { LandingBuilder } from "@/components/portal/landing-builder"
import { getDefaultBlocks, type LandingBlock } from "@/components/portal/landing-blocks"
import { toast } from "@/lib/toast"

type LP = { id: string; title: string; slug: string; content?: LandingBlock[]; published: boolean; expiresAt: string | null; updatedAt: string }

type Props = {
  companyId: string
  selectedId: string
  onSelect: (id: string, title: string) => void
}

const templates = [
  { key: "", label: "En blanco" },
  { key: "comunicado", label: "Comunicado" },
  { key: "asamblea", label: "Asamblea" },
  { key: "alerta", label: "Alerta urgente" },
  { key: "reunion", label: "Reunión" },
  { key: "documento", label: "Documento" },
  { key: "aviso", label: "Aviso" },
]

export function InlineLandingPicker({ companyId, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"select" | "create">("select")
  const [landings, setLandings] = useState<LP[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // Create mode
  const [newTitle, setNewTitle] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [blocks, setBlocks] = useState<LandingBlock[]>([])
  const [template, setTemplate] = useState("")
  const [creating, setCreating] = useState(false)
  const [previewHover, setPreviewHover] = useState<string | null>(null)
  const [newExpiresAt, setNewExpiresAt] = useState("")
  const [editingExpiry, setEditingExpiry] = useState<string | null>(null)
  const [extendDate, setExtendDate] = useState("")

  const [saving, setSaving] = useState(false)

  const selectedLanding = landings.find(l => l.id === selectedId)

  useEffect(() => {
    if (open) {
      fetch("/api/landing-pages").then(r => r.json()).then((d: any[]) => setLandings(Array.isArray(d) ? d : []))
    }
  }, [open])

  const filtered = search ? landings.filter(l => l.title.toLowerCase().includes(search.toLowerCase())) : landings

  const handleCreate = async () => {
    if (!newTitle || !newSlug) { toast.error("Título y slug requeridos"); return }
    setSaving(true)
    const res = await fetch("/api/landing-pages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, slug: newSlug.toLowerCase().replace(/\s+/g, "-"), content: blocks, expiresAt: newExpiresAt ? `${newExpiresAt}:00-03:00` : null, companyId: null }),
    })
    if (res.ok) {
      const lp = await res.json()
      toast.success("Landing creada")
      onSelect(lp.id, lp.title)
      setOpen(false)
    } else { toast.error("Error al crear") }
    setSaving(false)
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}
        className="w-full text-left px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm transition-colors hover:border-blue-500/50 group">
        {selectedLanding ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">{selectedLanding.title}</span>
              <span className="text-xs text-slate-500 ml-2">/{selectedLanding.slug}</span>
            </div>
            <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Cambiar</span>
          </div>
        ) : (
          <span className="text-slate-400">Seleccionar o crear landing...</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">Landing Page</h2>
                <p className="text-xs text-slate-400">Seleccioná una existente o creá una nueva</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 py-3 border-b border-slate-800 shrink-0">
              {(["select", "create"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${tab === t ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
                  {t === "select" ? "Seleccionar existente" : "Crear nueva"}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6">
              {tab === "select" ? (
                <div className="space-y-4">
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar landing..."
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {filtered.length === 0 ? (
                    <div className="text-center py-12"><p className="text-slate-400 text-sm">No hay landings{search ? " con ese nombre" : ""}</p></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filtered.map(lp => (
                        <div key={lp.id}
                          className={`relative rounded-xl border p-4 transition-all ${selectedId === lp.id ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-800/30"}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium text-white">{lp.title}</p>
                              <p className="text-xs text-slate-400">/{lp.slug}</p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${lp.published ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-500"}`}>{lp.published ? "Publicada" : "Borrador"}</span>
                                {lp.expiresAt && new Date(lp.expiresAt) < new Date() && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Vencida</span>
                                )}
                                {lp.expiresAt && new Date(lp.expiresAt) > new Date() && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">Vence {new Date(lp.expiresAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>
                                )}
                              </div>
                            </div>
                            {selectedId === lp.id && <span className="text-xs text-blue-400">✓</span>}
                          </div>

                          <div className="flex items-center gap-2">
                            <button type="button"
                              onClick={(e) => { e.stopPropagation(); window.open(`/portal/landing/${lp.slug}`, "_blank") }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                              Ver
                            </button>
                            <button type="button"
                              onClick={(e) => { e.stopPropagation(); window.open(`/admin/landing-pages/${lp.id}`, "_blank") }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-blue-300 hover:text-blue-200 hover:bg-slate-700 transition-colors">
                              Editar
                            </button>
                            <button type="button"
                              onClick={async (e) => {
                                e.stopPropagation()
                                // Auto-publish if not published
                                if (!lp.published) {
                                  await fetch(`/api/landing-pages/${lp.id}`, {
                                    method: "PUT", headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ published: true }),
                                  })
                                }
                                // Refresh list and select
                                const res = await fetch("/api/landing-pages")
                                const list = await res.json()
                                setLandings(Array.isArray(list) ? list : [])
                                onSelect(lp.id, lp.title)
                                setOpen(false)
                                toast.success(lp.published ? "Landing seleccionada" : "Landing publicada y seleccionada")
                              }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors ml-auto">
                              Seleccionar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Extender vencimiento si seleccionó una vencida */}
                  {(() => {
                    const sel = landings.find(l => l.id === selectedId)
                    if (!sel?.expiresAt || new Date(sel.expiresAt) > new Date()) return null
                    return (
                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                        <p className="text-xs text-red-400 font-medium">⚠️ Esta landing está vencida. Extendé su vencimiento para usarla.</p>
                        <div className="flex gap-2">
                          <input type="datetime-local" value={extendDate} onChange={e => setExtendDate(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <button type="button" onClick={async () => {
                            if (!extendDate) return
                            await fetch(`/api/landing-pages/${selectedId}`, {
                              method: "PUT", headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ expiresAt: `${extendDate}:00-03:00` }),
                            })
                            toast.success("Vencimiento actualizado")
                            setEditingExpiry(null); setExtendDate("")
                            // refresh landings list
                            fetch("/api/landing-pages").then(r => r.json()).then((d: any[]) => setLandings(Array.isArray(d) ? d : []))
                          }}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl">
                            Extender
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Título de la landing *</label>
                      <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Comunicado - Mayo 2026" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Slug (URL) *</label>
                      <input type="text" value={newSlug} onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="comunicado-mayo-2026" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Vence el <span className="text-slate-600">(opcional, UTC-3)</span></label>
                    <input type="datetime-local" value={newExpiresAt} onChange={e => setNewExpiresAt(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Template inicial</label>
                    <div className="flex flex-wrap gap-2">
                      {templates.map(tm => (
                        <button key={tm.key} type="button" onClick={() => { setTemplate(tm.key); if (tm.key) setBlocks(getDefaultBlocks(tm.key)); else setBlocks([]) }}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${template === tm.key ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                          {tm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <LandingBuilder initialBlocks={blocks} onChange={setBlocks} />
                  </div>

                  <button onClick={handleCreate} disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors">
                    {saving ? "Creando..." : "Crear landing y seleccionar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
