"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type CompanyDetail = {
  id: string
  name: string
  slug: string
  subdomain: string
  logo: string | null
  primaryColor: string
  secondaryColor: string
  _count: { subscribers: number; campaigns: number; users: number }
}

export default function EditCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#1a56db")
  const [secondaryColor, setSecondaryColor] = useState("#ffffff")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/companies/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("No encontrada")
        return r.json()
      })
      .then((data) => {
        setCompany(data)
        setName(data.name)
        setLogo(data.logo || "")
        setPrimaryColor(data.primaryColor)
        setSecondaryColor(data.secondaryColor)
      })
      .catch(() => setError("Empresa no encontrada"))
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(false)
    setError("")

    const res = await fetch(`/api/companies/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logo: logo || null, primaryColor, secondaryColor }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al guardar")
      return
    }

    setSaved(true)
  }

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta empresa? Esta acción no se puede deshacer.")) return

    await fetch(`/api/companies/${params.id}`, { method: "DELETE" })
    router.push("/admin/companies")
  }

  if (loading) {
    return <p className="text-slate-400">Cargando...</p>
  }

  if (error && !company) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Editar empresa</h1>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Eliminar empresa
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <a href="/admin/branding" className="text-sm text-blue-600 hover:text-blue-800">
          Branding y módulos →
        </a>
        <a href={`/admin/companies/${params.id}/users`} className="text-sm text-blue-600 hover:text-blue-800">
          Usuarios →
        </a>
      </div>

      <div className="max-w-lg space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nombre institucional
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Subdominio
            </label>
            <input
              type="text"
              value={company?.subdomain ?? ""}
              disabled
              className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-800 text-slate-400"
            />
            <p className="text-xs text-zinc-400 mt-1">El subdominio no se puede cambiar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              URL del logo
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Color principal
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Color secundario
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-400 mb-2">PREVIEW</p>
            <div
              className="rounded-lg p-4 flex items-center gap-3"
              style={{ backgroundColor: primaryColor, color: secondaryColor }}
            >
              {logo && (
                <img
                  src={logo}
                  alt="logo"
                  className="w-8 h-8 rounded object-contain bg-white p-1"
                />
              )}
              <span className="font-bold">{name || "Nombre empresa"}</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {saved && (
            <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              Cambios guardados
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit">Guardar cambios</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/companies")}
            >
              Volver
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
