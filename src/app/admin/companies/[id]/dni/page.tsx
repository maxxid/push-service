"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

type DniRecord = {
  id: string
  nombre: string
  apellido: string
  dni: string
  celular: string
  subscribed: boolean
  subscribedAt: string | null
  deviceInfo: string | null
}

export default function DniManagementPage() {
  const params = useParams()
  const router = useRouter()
  const [records, setRecords] = useState<DniRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState("")

  const fetchRecords = () => {
    fetch(`/api/companies/${params.id}/dni`)
      .then(r => r.json())
      .then((d: any[]) => setRecords(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRecords() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/dni/import", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) {
      toast.success(`${data.created} afiliados importados${data.skipped ? ` · ${data.skipped} duplicados` : ""}`)
      if (data.errors?.length) toast.error(data.errors[0])
    } else {
      toast.error(data.error || "Error al importar")
    }
    setUploading(false)
    fetchRecords()
  }

  const handleDelete = async (dniId: string) => {
    if (!confirm("¿Eliminar este registro?")) return
    await fetch(`/api/companies/${params.id}/dni`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dniId }),
    })
    toast.success("Eliminado")
    fetchRecords()
  }

  const filtered = filter
    ? records.filter(r =>
        r.dni.includes(filter) ||
        r.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        r.apellido.toLowerCase().includes(filter.toLowerCase())
      )
    : records

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-300">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Afiliados autorizados</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
          placeholder="Buscar por DNI o nombre..." className="flex-1 max-w-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploading ? "bg-slate-700 text-slate-400" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
          {uploading ? "Importando..." : "Importar CSV"}
          <input type="file" accept=".csv" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        {records.filter(r => r.subscribed).length} registrados de {records.length} totales.
        Formato CSV: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">nombre,apellido,dni,celular</code>
      </p>

      {records.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-3">No hay afiliados cargados</p>
          <p className="text-xs text-slate-500">Importá un CSV con el formato indicado arriba</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800">
              <tr className="text-left text-xs font-medium text-slate-500">
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">DNI</th>
                <th className="px-5 py-3 hidden md:table-cell">Celular</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 hidden lg:table-cell">Fecha suscripción</th>
                <th className="px-5 py-3 hidden lg:table-cell">Dispositivo</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="px-5 py-3 text-slate-300">{r.apellido}, {r.nombre}</td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">{r.dni}</td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{r.celular}</td>
                  <td className="px-5 py-3">
                    {r.subscribed ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Registrado</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Pendiente</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500 hidden lg:table-cell">
                    {r.subscribedAt ? new Date(r.subscribedAt).toLocaleDateString("es-AR") : "-"}
                  </td>
                  <td className="px-5 py-3 text-slate-500 hidden lg:table-cell">
                    {r.deviceInfo || "-"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(r.id)}
                      className="text-xs text-red-400 hover:text-red-300">
                      Eliminar
                    </button>
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
