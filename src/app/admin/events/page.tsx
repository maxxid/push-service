"use client"
import { useEffect, useState } from "react"; import { toast } from "@/lib/toast"
type Ev = { id: string; title: string; description: string | null; date: string; location: string | null; company?: { name: string } }
export default function EventsPage() {
  const [events, setEvents] = useState<Ev[]>([]); const [loading, setLoading] = useState(true); const [show, setShow] = useState(false); const [t, setT] = useState(""); const [d, setD] = useState(""); const [dt, setDt] = useState(""); const [loc, setLoc] = useState("")
  const fe = () => { fetch("/api/events").then(r => r.json()).then((d: any[]) => setEvents(Array.isArray(d) ? d : [])).finally(() => setLoading(false)) }
  useEffect(() => { fe() }, [])
  const ha = async (e: React.FormEvent) => { e.preventDefault(); const res = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: t, date: dt ? `${dt}:00-03:00` : dt, description: d || undefined, location: loc || undefined }) }); if (res.ok) { toast.success("Evento agregado"); setT(""); setDt(""); setD(""); setLoc(""); setShow(false); fe() } }
  if (loading) return <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-slate-800 rounded-2xl" />)}</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-white">Agenda</h1><button onClick={() => setShow(!show)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl">{show ? "Cancelar" : "Nuevo evento"}</button></div>
      {show && (
        <form onSubmit={ha} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={t} onChange={e => setT(e.target.value)} placeholder="Título" required className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} required className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="Ubicación (opcional)" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={d} onChange={e => setD(e.target.value)} rows={2} placeholder="Descripción (opcional)" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl">Agregar</button>
        </form>
      )}
      {events.length === 0 ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"><p className="text-slate-400">No hay eventos programados</p></div>) : (
        <div className="space-y-3">{events.map(ev => { const ed = new Date(ev.date); const isPast = ed < new Date()
          return (<div key={ev.id} className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-4 hover:border-slate-700 ${isPast ? "opacity-50" : ""}`}>
            <div className="text-center min-w-[60px] bg-slate-800 rounded-xl p-3"><p className="text-2xl font-bold text-white">{ed.getDate()}</p><p className="text-[10px] text-slate-400 uppercase">{ed.toLocaleDateString("es-AR", { month: "short" })}</p></div>
            <div className="flex-1 min-w-0"><h3 className="font-semibold text-white">{ev.title}</h3>{ev.location && <p className="text-xs text-slate-400 mt-0.5">📍 {ev.location}</p>}{ev.description && <p className="text-sm text-slate-400 mt-1">{ev.description}</p>}<p className="text-xs text-slate-500 mt-1">{ed.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p></div>
            <button onClick={async () => { if (!confirm("¿Eliminar?")) return; await fetch(`/api/events/${ev.id}`, { method: "DELETE" }); toast.success("Evento eliminado"); fe() }} className="text-red-400 hover:text-red-300 text-sm shrink-0">✕</button>
          </div>)})}</div>
      )}
    </div>
  )
}
