"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type Template = {
  id: string
  name: string
  description: string | null
  pushMessage: string
  landingTitle: string
  actionType: string
  priority: string
  company?: { name: string }
  updatedAt: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const router = useRouter()

  const fetchTemplates = () => {
    fetch("/api/templates")
      .then(r => r.json())
      .then(d => setTemplates(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTemplates() }, [])

  const handleUse = async (t: Template) => {
    setActionLoading(`use-${t.id}`)
    const res = await fetch(`/api/templates/${t.id}/use`, { method: "POST" })
    setActionLoading(null)
    if (res.ok) {
      const { campaign } = await res.json()
      router.push(`/admin/campaigns/${campaign.id}`)
    }
  }

  const handleDuplicate = async (t: Template) => {
    setActionLoading(`dup-${t.id}`)
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${t.name} (copia)`,
        description: t.description,
        pushMessage: t.pushMessage,
        landingTitle: t.landingTitle,
        actionType: t.actionType,
        priority: t.priority,
        companyId: null,
      }),
    })
    setActionLoading(null)
    fetchTemplates()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta plantilla?")) return
    setActionLoading(`del-${id}`)
    await fetch(`/api/templates/${id}`, { method: "DELETE" })
    setActionLoading(null)
    fetchTemplates()
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Plantillas</h1>
        <Link href="/admin/templates/new"><Button>Nueva plantilla</Button></Link>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay plantillas</p>
          <p className="text-sm text-zinc-400 mb-4">Creá una plantilla con mensaje y landing predefinidos para reusar.</p>
          <Link href="/admin/templates/new"><Button variant="outline" size="sm">Crear la primera</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-zinc-900">{t.name}</h3>
                  {t.description && <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>}
                </div>
                {t.priority === "URGENTE" && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Urgente</span>
                )}
              </div>

              <p className="text-sm text-zinc-600 line-clamp-2 mb-2">{t.pushMessage}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                <span>📄 {t.landingTitle}</span>
                <span>· {t.actionType}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleUse(t)} disabled={!!actionLoading}>
                  {actionLoading === `use-${t.id}` ? "Creando..." : "Usar"}
                </Button>
                <Link href={`/admin/templates/${t.id}`} className="text-blue-600 hover:text-blue-800 text-sm">Editar</Link>
                <button onClick={() => handleDuplicate(t)} disabled={actionLoading === `dup-${t.id}`}
                  className="text-zinc-500 hover:text-zinc-700 text-sm disabled:opacity-50">
                  {actionLoading === `dup-${t.id}` ? "..." : "Duplicar"}
                </button>
                <button onClick={() => handleDelete(t.id)} disabled={actionLoading === `del-${t.id}`}
                  className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50">
                  {actionLoading === `del-${t.id}` ? "..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
