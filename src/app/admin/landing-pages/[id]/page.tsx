"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"
import { LandingBuilder } from "@/components/portal/landing-builder"
import { type LandingBlock } from "@/components/portal/landing-blocks"

type LandingDetail = {
  id: string
  title: string
  slug: string
  content: LandingBlock[]
  published: boolean
  company?: { name: string }
}

export default function EditLandingPage() {
  const params = useParams()
  const router = useRouter()
  const [landing, setLanding] = useState<LandingDetail | null>(null)
  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<LandingBlock[]>([])
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/landing-pages/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setLanding(data)
        setTitle(data.title)
        setBlocks(Array.isArray(data.content) ? data.content : [])
        setPublished(data.published)
      })
      .catch(() => setError("No se pudo cargar la landing"))
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const res = await fetch(`/api/landing-pages/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content: blocks,
        published,
      }),
    })

    if (!res.ok) {
      toast.error("Error al guardar")
    } else {
      setSaved(true)
      toast.success("Landing actualizada")
      setTimeout(() => setSaved(false), 2000)
    }

    setSaving(false)
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>
  if (!landing) return <p className="text-red-600">{error || "No encontrada"}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/landing-pages")}
            className="text-zinc-400 hover:text-zinc-600"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-zinc-900">
            Editar landing
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={landing.slug}
                disabled
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 text-zinc-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-zinc-700">Publicada</span>
            </label>
            {published && (
              <a
                href={`/portal/landing/${landing.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Ver página pública →
              </a>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <LandingBuilder initialBlocks={blocks} onChange={setBlocks} />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  )
}
