"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type UserRow = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

const roleLabel: Record<string, string> = {
  SUPERADMIN: "Superadmin",
  COMPANY_OWNER: "Dueño",
  COMPANY_EDITOR: "Editor",
}

export default function UsersPage() {
  const params = useParams()
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("COMPANY_OWNER")
  const [error, setError] = useState("")

  const fetchUsers = () => {
    fetch(`/api/companies/${params.id}/users`)
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch(`/api/companies/${params.id}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || null, email, password, role }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || "Error")
      return
    }

    setName("")
    setEmail("")
    setPassword("")
    setRole("COMPANY_OWNER")
    setShowForm(false)
    fetchUsers()
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Eliminar este usuario?")) return
    await fetch(`/api/companies/${params.id}/users/${userId}`, { method: "DELETE" })
    fetchUsers()
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-600">← Volver</button>
        <h1 className="text-2xl font-bold text-zinc-900">Usuarios de la empresa</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo usuario"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-zinc-200 p-4 mb-4 max-w-md space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Contraseña</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="COMPANY_OWNER">Dueño (acceso total a su empresa)</option>
              <option value="COMPANY_EDITOR">Editor (gestiona campañas)</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <Button type="submit" size="sm">Crear usuario</Button>
        </form>
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500 mb-2">No hay usuarios para esta empresa</p>
          <p className="text-sm text-zinc-400">Creá uno para que puedan gestionar su panel.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">Nombre</th>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">Email</th>
                <th className="text-left px-6 py-3 font-medium text-zinc-600">Rol</th>
                <th className="text-right px-6 py-3 font-medium text-zinc-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-6 py-3 text-zinc-900">{u.name || "-"}</td>
                  <td className="px-6 py-3 text-zinc-600">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                      {roleLabel[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {u.role !== "SUPERADMIN" && (
                      <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 text-sm">
                        Eliminar
                      </button>
                    )}
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
