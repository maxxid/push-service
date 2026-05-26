"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { InlineLandingPicker } from "@/components/admin/inline-landing-picker"

type Segment = { id: string; name: string; companyId: string; _count?: { subscribers: number } }
type LandingPage = { id: string; title: string; slug: string }

const actionTypes = [
  { value: "LANDING_INTERNA", label: "Landing Interna", desc: "Micrositio dentro de la plataforma" },
  { value: "WHATSAPP", label: "WhatsApp", desc: "Abre un chat de WhatsApp" },
  { value: "URL_EXTERNA", label: "URL Externa", desc: "Cualquier página web" },
  { value: "PDF", label: "Descargar PDF", desc: "Archivo para descargar" },
  { value: "MAPS", label: "Google Maps", desc: "Abre una ubicación" },
  { value: "LLAMAR", label: "Llamar", desc: "Inicia una llamada" },
]

const TOTAL_STEPS = 5
const STEPS = ["Mensaje", "Acción", "Destinatarios", "Programación", "Revisar"]

export default function NewCampaignPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const userCompanyId = (session?.user as any)?.companyId

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [pushMessage, setPushMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [actionType, setActionType] = useState("LANDING_INTERNA")
  const [actionValue, setActionValue] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [segmentId, setSegmentId] = useState("__todos__")
  const [landingPageId, setLandingPageId] = useState("")
  const [sendNow, setSendNow] = useState(true)
  const [scheduledAt, setScheduledAt] = useState("")
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderDelay, setReminderDelay] = useState(6)
  const [reminderTarget, setReminderTarget] = useState("no-clickers")
  const [reminderTitle, setReminderTitle] = useState("")
  const [reminderMessage, setReminderMessage] = useState("")
  const [companyId, setCompanyId] = useState(userCompanyId || "")

  const [segments, setSegments] = useState<Segment[]>([])
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/segments").then(r => r.json()).then((d: any[]) => {
      const list = Array.isArray(d) ? d : []
      setSegments(list)
      const todos = list.find((s: any) => s.name === "Todos")
      if (todos) setSegmentId(todos.id)
    })
    fetch("/api/landing-pages").then(r => r.json()).then((d: any[]) => setLandingPages(Array.isArray(d) ? d : []))
    if (role === "SUPERADMIN") fetch("/api/companies").then(r => r.json()).then(setCompanies)
  }, [role])

  const selectedSegment = segments.find(s => s.id === segmentId)

  const handleCreate = async () => {
    setLoading(true); setError("")
    const body: any = { title, pushMessage, imageUrl: imageUrl || undefined, actionType, actionValue: actionValue || undefined, landingPageId: landingPageId || undefined, priority, segmentId: segmentId || undefined, companyId: role === "SUPERADMIN" ? companyId : undefined, scheduledAt: sendNow ? undefined : scheduledAt ? `${scheduledAt}:00-03:00` : undefined, reminderEnabled, reminderDelayHours: reminderEnabled ? reminderDelay : undefined, reminderTarget: reminderEnabled ? reminderTarget : undefined, reminderTitle: reminderEnabled && reminderTitle ? reminderTitle : undefined, reminderMessage: reminderEnabled && reminderMessage ? reminderMessage : undefined }
    const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (!res.ok) { const d = await res.json(); setError(d.error || "Error"); setLoading(false); return }
    const c = await res.json()
    if (sendNow) {
      const sRes = await fetch(`/api/campaigns/${c.id}/send`, { method: "POST" })
      if (!sRes.ok) { const d = await sRes.json(); setError(d.error || "Creada pero error al enviar"); setLoading(false); return }
    }
    router.push("/admin/campaigns")
  }

  const canNext = () => {
    if (step === 1) return title && pushMessage
    if (step === 2) return actionType !== "LANDING_INTERNA" || !!landingPageId
    if (step === 3) return !!segmentId
    return true
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Crear Campaña</h1>
          <p className="text-slate-400 text-sm mt-1">Paso {step} de {TOTAL_STEPS} · {STEPS[step - 1]}</p>
        </div>
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-sm">Cancelar</button>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${i < step ? "bg-blue-500" : "bg-slate-800"}`} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form - 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Mensaje</h2>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Título de la campaña *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Asamblea General 15 de Marzo" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-400">Mensaje push *</label>
                  <span className="text-[10px] text-slate-500">{pushMessage.length}/160</span>
                </div>
                <textarea value={pushMessage} onChange={e => setPushMessage(e.target.value)} rows={3} maxLength={160}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Asamblea General del 15 de marzo a las 14hs en el salón institucional. Se tratarán temas importantes..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Imagen (opcional)</label>
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Tipo de acción</h2>
              <p className="text-sm text-slate-400">¿A dónde va el usuario cuando toca la notificación?</p>
              <div className="space-y-2">
                {actionTypes.map(a => (
                  <label key={a.value}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      actionType === a.value ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-800/50"
                    }`}>
                    <input type="radio" name="action" value={a.value} checked={actionType === a.value}
                      onChange={e => { setActionType(e.target.value); setActionValue("") }}
                      className="mt-0.5 accent-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{a.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {(actionType === "WHATSAPP" || actionType === "URL_EXTERNA" || actionType === "MAPS" || actionType === "LLAMAR") && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    {actionType === "WHATSAPP" ? "Número WhatsApp" : actionType === "MAPS" ? "Dirección" : actionType === "LLAMAR" ? "Teléfono" : "URL"}
                  </label>
                  <input type="text" value={actionValue} onChange={e => setActionValue(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              {(actionType === "LANDING_INTERNA" || actionType === "FORMULARIO") && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Landing page de destino</label>
                  <InlineLandingPicker
                    companyId={role === "SUPERADMIN" ? companyId : userCompanyId || ""}
                    selectedId={landingPageId}
                    onSelect={(id, title) => { setLandingPageId(id) }}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Recipients */}
          {step === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold text-white">Destinatarios</h2>
              <p className="text-sm text-slate-400">¿A quién le llega esta campaña?</p>

              {role === "SUPERADMIN" && (
                <div className="pb-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Empresa</label>
                  <select value={companyId} onChange={e => setCompanyId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleccionar</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                {segments.filter(s => role === "SUPERADMIN" || !s.companyId || s.companyId === userCompanyId).map(s => (
                  <label key={s.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      segmentId === s.id ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-800/50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="segment" value={s.id} checked={segmentId === s.id}
                        onChange={() => setSegmentId(s.id)} className="accent-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        {s._count && <p className="text-xs text-slate-400">{s._count.subscribers} suscriptores</p>}
                      </div>
                    </div>
                    {s._count && (
                      <span className="text-xs text-blue-400 font-medium">{s._count.subscribers} dest.</span>
                    )}
                  </label>
                ))}
              </div>
              <Link href="/admin/segments/new" className="text-xs text-blue-400 hover:text-blue-300 inline-block mt-2">+ Crear nuevo segmento</Link>
            </div>
          )}

          {/* STEP 4: Schedule */}
          {step === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Programación</h2>
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${sendNow ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-800/50"}`}>
                <input type="radio" checked={sendNow} onChange={() => setSendNow(true)} className="mt-0.5 accent-blue-500" />
                <div>
                  <p className="text-sm font-medium text-white">Enviar ahora</p>
                  <p className="text-xs text-slate-400 mt-0.5">Se enviará inmediatamente</p>
                </div>
              </label>
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${!sendNow ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-800/50"}`}>
                <input type="radio" checked={!sendNow} onChange={() => setSendNow(false)} className="mt-0.5 accent-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Programar</p>
                  <div className="mt-3">
                    <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                      className="w-full max-w-xs px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-[10px] text-slate-500 mt-1">Horario: UTC-3 (Buenos Aires)</p>
                  </div>
                </div>
              </label>

              {/* Reminder */}
              <div className="border-t border-slate-800 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={reminderEnabled} onChange={e => setReminderEnabled(e.target.checked)} className="rounded accent-blue-500" />
                  <span className="text-sm font-medium text-white">Enviar recordatorio</span>
                </label>

                {reminderEnabled && (
                  <div className="mt-4 space-y-4 pl-7">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Enviar en</span>
                      <select value={reminderDelay} onChange={e => setReminderDelay(Number(e.target.value))}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
                        {[1,3,6,12,24,48].map(h => <option key={h} value={h}>{h}h</option>)}
                      </select>
                      <span className="text-xs text-slate-400">después</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-400">Enviar a</p>
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${reminderTarget === "all" ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700"}`}>
                        <input type="radio" checked={reminderTarget === "all"} onChange={() => setReminderTarget("all")} className="accent-blue-500" />
                        <span className="text-sm text-white">Todos los suscriptores</span>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${reminderTarget === "no-clickers" ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700"}`}>
                        <input type="radio" checked={reminderTarget === "no-clickers"} onChange={() => setReminderTarget("no-clickers")} className="accent-blue-500" />
                        <span className="text-sm text-white">Solo quienes no abrieron</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Título del recordatorio</label>
                      <input type="text" value={reminderTitle} onChange={e => setReminderTitle(e.target.value)}
                        placeholder={`⏰ Recordatorio: ${title || "..."}`}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Mensaje del recordatorio</label>
                      <textarea value={reminderMessage} onChange={e => setReminderMessage(e.target.value)} rows={2}
                        placeholder={pushMessage || "Mismo mensaje que el original"}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 5 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Revisar antes de enviar</h2>
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Título</span><span className="text-white font-medium">{title}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Mensaje</span><span className="text-white font-medium max-w-[200px] truncate">{pushMessage}</span></div>
                {imageUrl && <div className="flex justify-between"><span className="text-slate-400">Imagen</span><span className="text-green-400 text-xs">✓</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Acción</span><span className="text-white">{actionTypes.find(a => a.value === actionType)?.label}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Segmento</span><span className="text-white">{selectedSegment?.name || "Todos"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Envío</span><span className="text-white">{sendNow ? "Ahora" : scheduledAt ? new Date(scheduledAt).toLocaleString("es-AR") : "Sin fecha"}</span></div>
                {reminderEnabled && (
                  <div className="flex justify-between"><span className="text-slate-400">Recordatorio</span><span className="text-amber-400">+{reminderDelay}h · {reminderTarget === "no-clickers" ? "No-clickers" : "Todos"}</span></div>
                )}
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{error}</div>}
              <button onClick={handleCreate} disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors">
                {loading ? "Enviando..." : sendNow ? "Enviar campaña ahora" : "Programar campaña"}
              </button>
            </div>
          )}
        </div>

        {/* Preview - 2 cols */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Vista previa</p>

            <div className="flex gap-4">
              {/* Box 1: Notification */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex-1">
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                  <span className="text-[11px] text-slate-400">Notificación</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">Android</span>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[200px]">
                  <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl w-full max-w-[280px]">
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-[7px] text-white font-bold">P</span>
                        </div>
                        <span className="text-[10px] text-slate-500">ahora · Notificaciones</span>
                      </div>
                      <p className="text-[13px] font-semibold text-white leading-tight">{title || "Título"}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-3">{pushMessage || "Mensaje..."}</p>
                      {imageUrl && <img src={imageUrl} alt="" className="mt-2 rounded-lg max-h-12 object-cover w-full" />}
                      {actionType !== "LANDING_INTERNA" && actionValue && (
                        <p className="text-[10px] text-blue-400 mt-1.5">{actionType === "WHATSAPP" ? "💬 WhatsApp" : actionType === "MAPS" ? "📍 Google Maps" : actionType === "LLAMAR" ? "📞 Llamar" : "🔗 URL externa"}</p>
                      )}
                    </div>
                    <div className="h-0.5 bg-slate-800" />
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500">Paso {step}/{TOTAL_STEPS} · {selectedSegment?._count?.subscribers || 0} dest.</span>
                </div>
              </div>

              {/* Box 2: Landing (fills remaining space) */}
              {landingPageId && (() => {
                const selectedLP = landingPages.find(lp => lp.id === landingPageId)
                if (!selectedLP) return null
                return (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex-[2] flex flex-col">
                    <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                      <span className="text-[11px] text-slate-400">Landing</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Preview</span>
                        <a href={`/portal/landing/${selectedLP.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-slate-400 hover:text-white">↗</a>
                      </div>
                    </div>
                    <div className="flex-1 p-3 min-h-0">
                      <iframe
                        src={`/portal/landing/${selectedLP.slug}`}
                        className="w-full h-full min-h-[350px] rounded-xl border border-slate-700"
                        title="Landing preview"
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white disabled:opacity-30 transition-colors">
          ← Atrás
        </button>
        {step < TOTAL_STEPS ? (
          <button onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))} disabled={!canNext()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-semibold text-sm rounded-xl transition-colors">
            Siguiente →
          </button>
        ) : null}
      </div>
    </div>
  )
}
