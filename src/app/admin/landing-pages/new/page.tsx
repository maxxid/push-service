"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"
import { LandingBuilder } from "@/components/portal/landing-builder"
import { getDefaultBlocks, type LandingBlock } from "@/components/portal/landing-blocks"

const templates = [
  { value: "comunicado", label: "Comunicado institucional" },
  { value: "asamblea", label: "Asamblea" },
  { value: "alerta", label: "Alerta urgente" },
  { value: "reunion", label: "Reunión" },
  { value: "documento", label: "Documento importante" },
  { value: "horario", label: "Cambio de horario" },
  { value: "aviso", label: "Aviso importante" },
  { value: "", label: "En blanco" },
]

export default function NewLandingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const userData = session?.user as Record<string, unknown> | undefined
  const role = userData?.role as string
  const userCompanyId = userData?.companyId as string | undefined

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [companyId, setCompanyId] = useState(userCompanyId || "")
  const [blocks, setBlocks] = useState<LandingBlock[]>([])
  const [template, setTemplate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  )

  useEffect(() => {
    if (role === "SUPERADMIN") {
      fetch("/api/companies")
        .then((r) => r.json())
        .then(setCompanies)
    }
  }, [role])

  const handleTemplateChange = (val: string) => {
    setTemplate(val)
    if (val) {
      setBlocks(getDefaultBlocks(val))
    } else {
      setBlocks([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!title || !slug) {
      setError("Título y slug son obligatorios")
      setLoading(false)
      return
    }

    const res = await fetch("/api/landing-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        content: blocks,
        companyId: role === "SUPERADMIN" ? companyId : undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Error al crear")
      setError(data.error || "Error al crear")
      setLoading(false)
      return
    }

    toast.success("Landing creada")
    router.push("/admin/landing-pages")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">
        Nueva landing page
      </h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
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
                placeholder="Comunicado - Mayo 2026"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="comunicado-mayo-2026"
                required
              />
            </div>
          </div>

          {role === "SUPERADMIN" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Empresa
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Template inicial
            </label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {templates.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <LandingBuilder
            initialBlocks={blocks}
            onChange={setBlocks}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear landing"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
