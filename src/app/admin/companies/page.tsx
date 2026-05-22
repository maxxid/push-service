"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Company = {
  id: string
  name: string
  slug: string
  subdomain: string
  logo: string | null
  primaryColor: string
  _count: { subscribers: number; campaigns: number }
  createdAt: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then(setCompanies)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Empresas</h1>
        <Link href="/admin/companies/new">
          <Button>Nueva empresa</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay empresas todavía</p>
          <Link href="/admin/companies/new">
            <Button variant="outline" size="sm">
              Crear la primera
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">
                  Empresa
                </th>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">
                  Subdominio
                </th>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">
                  Suscriptores
                </th>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">
                  Campañas
                </th>
                <th className="text-right px-6 py-3 font-medium text-zinc-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: c.primaryColor }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-zinc-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {c.subdomain}.plataforma.com
                  </td>
                  <td className="px-6 py-4 text-zinc-900">
                    {c._count.subscribers}
                  </td>
                  <td className="px-6 py-4 text-zinc-900">
                    {c._count.campaigns}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/companies/${c.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
