"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type LandingPage = {
  id: string
  title: string
  slug: string
  published: boolean
  company?: { name: string }
  updatedAt: string
}

export default function LandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = () => {
    fetch("/api/landing-pages")
      .then((r) => r.json())
      .then((d) => setPages(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta landing?")) return
    await fetch(`/api/landing-pages/${id}`, { method: "DELETE" })
    fetchPages()
  }

  const handleDuplicate = async (lp: LandingPage) => {
    await fetch("/api/landing-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${lp.title} (copia)`,
        slug: `${lp.slug}-copia`,
        companyId: null,
      }),
    })
    fetchPages()
  }

  const handleTogglePublish = async (lp: LandingPage) => {
    await fetch(`/api/landing-pages/${lp.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !lp.published }),
    })
    fetchPages()
  }

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Landing Pages</h1>
        <Link href="/admin/landing-pages/new">
          <Button>Nueva landing</Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay landing pages</p>
          <p className="text-sm text-zinc-400 mb-4">
            Creá micrositios informativos con bloques de texto, imágenes,
            botones y más.
          </p>
          <Link href="/admin/landing-pages/new">
            <Button>Crear la primera</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((lp) => (
            <div
              key={lp.id}
              className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center justify-between hover:border-blue-200 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-900 truncate">
                    {lp.title}
                  </h3>
                  {lp.published ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Publicada
                    </span>
                  ) : (
                    <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
                      Borrador
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  /landing/{lp.slug}
                  {lp.company && ` · ${lp.company.name}`}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleTogglePublish(lp)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    lp.published
                      ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {lp.published ? "Despublicar" : "Publicar"}
                </button>
                <Link
                  href={`/admin/landing-pages/${lp.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDuplicate(lp)}
                  className="text-zinc-500 hover:text-zinc-700 text-sm"
                >
                  Duplicar
                </button>
                <a
                  href={`/portal/landing/${lp.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Ver →
                </a>
                <button
                  onClick={() => handleDelete(lp.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
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
