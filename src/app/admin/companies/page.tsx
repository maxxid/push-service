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
        <h1 className="text-2xl font-bold text-white">Empresas</h1>
        <Link href="/admin/companies/new">
          <Button>Nueva empresa</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay empresas todavía</p>
          <Link href="/admin/companies/new">
            <Button variant="outline" size="sm">
              Crear la primera
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
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
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-slate-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: c.primaryColor }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {c.subdomain}.plataforma.com
                  </td>
                  <td className="px-6 py-4 text-white">
                    {c._count.subscribers}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {c._count.campaigns}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/companies/${c.id}/users`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Usuarios
                    </Link>
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
