"use client"
import { useEffect, useState } from "react"; import { useParams, useRouter } from "next/navigation"; import { toast } from "@/lib/toast"

type SubInfo = { subscriber: { id: string; onesignalId: string; subscribedAt: string; active: boolean; deviceInfo: unknown } }
type Avail = { id: string; onesignalId: string; subscribedAt: string; active: boolean; deviceInfo: unknown }

export default function SegmentDetailPage() {
  const params = useParams(); const router = useRouter()
  const [segment, setSegment] = useState<any>(null); const [avail, setAvail] = useState<Avail[]>([])
  const [en, setEn] = useState(false); const [nn, setNn] = useState(""); const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<Set<string>>(new Set()); const [al, setAl] = useState(false)

  const fs = () => {
    fetch(`/api/segments/${params.id}`).then(r => r.json()).then(data => { setSegment(data); setNn(data.name) }).finally(() => setLoading(false))
  }
  const fa = () => {
    fetch("/api/subscribers").then(r => r.json()).then((data: any[]) => {
      if (segment) {
        const existing = new Set(segment.subscribers.map((s: SubInfo) => s.subscriber.id))
        setAvail((Array.isArray(data) ? data : []).filter((s: Avail) => !existing.has(s.id)))
      }
    })
  }
  useEffect(() => { fs() }, [params.id])
  useEffect(() => { if (segment) fa() }, [segment])

  const dl = (info: unknown) => { const d = info as Record<string, string> | null; if (!d) return "?"; const ua = d.userAgent || ""; if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"; if (ua.includes("Android")) return "Android"; if (ua.includes("Windows")) return "Win"; return "Web" }

  const handleRename = async () => { if (!nn.trim()) return; await fetch(`/api/segments/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nn }) }); setEn(false); fs() }
  const handleAdd = async () => { if (sel.size === 0 || al) return; setAl(true); await fetch(`/api/segments/${params.id}/subscribers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriberIds: Array.from(sel) }) }); setSel(new Set()); setAl(false); toast.success(`${sel.size} agregados`); fs() }
  const handleRemove = async (sid: string) => { if (al) return; setAl(true); await fetch(`/api/segments/${params.id}/subscribers`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriberIds: [sid] }) }); setAl(false); toast.info("Quitado del segmento"); fs() }

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-slate-800 rounded-xl mb-6" /><div className="h-64 bg-slate-800 rounded-2xl" /></div>
  if (!segment) return <p className="text-red-400">No encontrado</p>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/segments")} className="text-slate-500 hover:text-slate-300">← Volver</button>
        <h1 className="text-2xl font-bold text-white">
          {en ? <span className="flex items-center gap-2"><input type="text" value={nn} onChange={e => setNn(e.target.value)} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus onKeyDown={e => e.key === "Enter" && handleRename()} /><button onClick={handleRename} className="text-xs px-3 py-1.5 bg-blue-600 rounded-lg text-white">Guardar</button><button onClick={() => setEn(false)} className="text-xs px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">Cancelar</button></span>
            : <span className="cursor-pointer hover:text-blue-400" onClick={() => setEn(true)}>{segment.name}</span>}
        </h1>
        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{segment.subscribers.length} subs</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">En este segmento</h2>
          {segment.subscribers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center"><p className="text-sm text-slate-500">Sin suscriptores</p></div>
          ) : (
            <div className="space-y-2">
              {segment.subscribers.map(({ subscriber: sub }: SubInfo, i: number) => (
                <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${sub.active ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-500"}`}>{dl(sub.deviceInfo).slice(0, 2)}</div>
                    <div className="min-w-0"><p className="text-sm font-medium text-white">{dl(sub.deviceInfo)} · #{i + 1}</p><p className="text-xs text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sub.active ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-500"}`}>{sub.active ? "Activo" : "Inactivo"}</span>
                    <button onClick={() => handleRemove(sub.id)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">Agregar suscriptores</h2>
            <div className="flex gap-2">
              {avail.filter(s => s.active).length > 0 && (
                <button onClick={() => setSel(new Set(avail.filter(s => s.active).map(s => s.id)))} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">Todos</button>
              )}
              {sel.size > 0 && (
                <button onClick={handleAdd} disabled={al} className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50">{al ? "..." : `Agregar ${sel.size}`}</button>
              )}
            </div>
          </div>
          {avail.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center"><p className="text-sm text-slate-500">No hay disponibles</p></div>
          ) : (
            <div className="space-y-2">
              {avail.filter(s => s.active).map(sub => (
                <label key={sub.id} className={`flex items-center gap-3 bg-slate-900 border rounded-2xl p-3 cursor-pointer transition-all ${sel.has(sub.id) ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700"}`}>
                  <input type="checkbox" checked={sel.has(sub.id)} onChange={() => { const n = new Set(sel); n.has(sub.id) ? n.delete(sub.id) : n.add(sub.id); setSel(n) }} className="rounded accent-blue-500" />
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${sel.has(sub.id) ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500"}`}>{dl(sub.deviceInfo).slice(0, 2)}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white">{dl(sub.deviceInfo)} · Suscriptor</p><p className="text-xs text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</p></div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
