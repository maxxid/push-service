"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "@/lib/toast"

type Segment = { id: string; name: string; companyId: string; company?: { name: string }; _count: { subscribers: number; campaigns: number } }

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSegments = () => {
    fetch("/api/segments").then(r => r.json()).then((d: any[]) => setSegments(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }
  useEffect(() => { fetchSegments() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este segmento?")) return
    const res = await fetch(`/api/segments/${id}`, { method: "DELETE" })
    if (!res.ok) { const d = await res.json(); toast.error(d.error || "Error"); return }
    toast.success("Segmento eliminado"); fetchSegments()
  }

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Segmentos</h1>
        <Link href="/admin/segments/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors">✚ Nuevo</Link>
      </div>
      {segments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-3">No hay segmentos creados</p>
          <Link href="/admin/segments/new" className="text-blue-400 hover:text-blue-300 text-sm">Crear el primero →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map(s => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{s.name}</h3>
                  {s.company && <p className="text-xs text-slate-500">{s.company.name}</p>}
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium">{s._count.subscribers}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/segments/${s.id}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Gestionar</Link>
                {s.name !== "Todos" && (
                  <button onClick={() => handleDelete(s.id)} className="text-sm text-red-400 hover:text-red-300">Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
