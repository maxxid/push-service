"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Segment = {
  id: string
  name: string
  companyId: string
  company?: { name: string }
  _count: { subscribers: number; campaigns: number }
  createdAt: string
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSegments = () => {
    fetch("/api/segments")
      .then((r) => r.json())
      .then(setSegments)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSegments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este segmento?")) return
    await fetch(`/api/segments/${id}`, { method: "DELETE" })
    fetchSegments()
  }

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Segmentos</h1>
        <Link href="/admin/segments/new">
          <Button>Nuevo segmento</Button>
        </Link>
      </div>

      {segments.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay segmentos creados</p>
          <p className="text-sm text-zinc-400">
            Creá segmentos como &ldquo;Productores&rdquo;,
            &ldquo;Directivos&rdquo; o &ldquo;Zona Norte&rdquo; para segmentar
            tus campañas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-zinc-900">{s.name}</h3>
                  {s.company && (
                    <p className="text-xs text-zinc-400">{s.company.name}</p>
                  )}
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {s._count.subscribers} suscriptores
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                <span>{s._count.campaigns} campañas</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/segments/${s.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Gestionar
                </Link>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
