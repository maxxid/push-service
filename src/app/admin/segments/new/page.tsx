"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

type Company = { id: string; name: string }

export default function NewSegmentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const userData = session?.user as Record<string, unknown> | undefined
  const role = userData?.role as string
  const userCompanyId = userData?.companyId as string | undefined

  const [name, setName] = useState("")
  const [companyId, setCompanyId] = useState(userCompanyId || "")
  const [companies, setCompanies] = useState<Company[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role === "SUPERADMIN") {
      fetch("/api/companies")
        .then((r) => r.json())
        .then(setCompanies)
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/segments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        companyId: role === "SUPERADMIN" ? companyId : undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al crear segmento")
      setLoading(false)
      return
    }

    router.push("/admin/segments")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Nuevo segmento
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Nombre del segmento
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Productores"
            required
          />
        </div>

        {role === "SUPERADMIN" && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Empresa
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar empresa</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear segmento"}
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
