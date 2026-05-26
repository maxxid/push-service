"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

type DniRecord = {
  id: string; nombre: string; apellido: string; dni: string; celular: string
  subscribed: boolean; subscribedAt: string | null; deviceInfo: string | null
}

export default function DniPage() {
  const router = useRouter()
  const [records, setRecords] = useState<DniRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState("")
  const [newApellido, setNewApellido] = useState("")
  const [newDni, setNewDni] = useState("")
  const [newCel, setNewCel] = useState("")
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editApellido, setEditApellido] = useState("")
  const [editDni, setEditDni] = useState("")
  const [editCel, setEditCel] = useState("")

  const fetchRecords = () => {
    if (!companyId) { setLoading(false); return }
    fetch(`/api/companies/${companyId}/dni`).then(r => r.json()).then((d: any[]) => setRecords(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch("/api/companies").then(r => r.json()).then((d: any[]) => {
      const c = Array.isArray(d) && d.length > 0 ? d[0] : null
      if (c) setCompanyId(c.id)
    })
  }, [])

  useEffect(() => { if (companyId) fetchRecords() }, [companyId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !companyId) return
    setUploading(true)
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/dni/import", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) {
      toast.success(`${data.created} afiliados importados${data.skipped ? ` \u00b7 ${data.skipped} duplicados` : ""}`)
      if (data.errors?.length) toast.error(data.errors[0])
    } else { toast.error(data.error || "Error al importar") }
    setUploading(false); fetchRecords()
  }

  const handleReset = async (dniId: string) => {
    if (!confirm("\u00bfReestablecer este afiliado? Podr\u00e1 volver a suscribirse con otro dispositivo.")) return
    await fetch(`/api/companies/${companyId}/dni`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dniId }) })
    toast.success("Reestablecido"); fetchRecords()
  }

  const handleDelete = async (dniId: string) => {
    if (!confirm("\u00bfEliminar este registro?")) return
    await fetch(`/api/companies/${companyId}/dni`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dniId }) })
    toast.success("Eliminado"); fetchRecords()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNombre || !newApellido || !newDni) { toast.error("Complet\u00e1 nombre, apellido y DNI"); return }
    setSaving(true)
    const res = await fetch(`/api/companies/${companyId}/dni`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: newNombre, apellido: newApellido, dni: newDni.replace(/\D/g, ""), celular: newCel }),
    })
    if (res.ok) {
      toast.success("Afiliado agregado")
      setNewNombre(""); setNewApellido(""); setNewDni(""); setNewCel(""); setShowNew(false)
      fetchRecords()
    } else { const d = await res.json(); toast.error(d.error || "Error al agregar") }
    setSaving(false)
  }

  const handleEdit = (r: DniRecord) => {
    setEditId(r.id); setEditNombre(r.nombre); setEditApellido(r.apellido); setEditDni(r.dni); setEditCel(r.celular)
  }

  const handleSaveEdit = async () => {
    if (!editId || !editNombre || !editApellido || !editDni) { toast.error("Complet\u00e1 los campos"); return }
    const res = await fetch(`/api/companies/${companyId}/dni`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dniId: editId, nombre: editNombre, apellido: editApellido, dni: editDni.replace(/\D/g, ""), celular: editCel }),
    })
    if (res.ok) { toast.success("Actualizado"); setEditId(null); fetchRecords() }
    else { const d = await res.json(); toast.error(d.error || "Error al actualizar") }
  }

  const filtered = filter ? records.filter(r => r.dni.includes(filter) || r.nombre.toLowerCase().includes(filter.toLowerCase()) || r.apellido.toLowerCase().includes(filter.toLowerCase())) : records

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Afiliados autorizados</h1><p className="text-sm text-slate-400 mt-1">Gestion\u00e1 qui\u00e9n puede suscribirse a las notificaciones</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowNew(!showNew)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-colors">{showNew ? "Cancelar" : "\u271a Nuevo"}</button>
          <button onClick={() => router.back()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors">Cancelar</button>
          <label className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploading ? "bg-slate-700 text-slate-400" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
            {uploading ? "Importando..." : "Importar CSV"}
            <input type="file" accept=".csv" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Nombre *</label><input type="text" value={newNombre} onChange={e => setNewNombre(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Juan" /></div>
          <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Apellido *</label><input type="text" value={newApellido} onChange={e => setNewApellido(e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Perez" /></div>
          <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">DNI * (7-8 d\u00edgitos)</label><input type="text" inputMode="numeric" value={newDni} onChange={e => setNewDni(e.target.value.replace(/\D/g, "").slice(0, 8))} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="12345678" /></div>
          <div><label className="text-xs font-medium text-slate-400 mb-1.5 block">Celular</label><input type="text" inputMode="numeric" value={newCel} onChange={e => setNewCel(e.target.value.replace(/\D/g, ""))} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="3884123456" /></div>
          <div className="flex items-end pb-0.5"><button type="submit" disabled={saving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors">{saving ? "Guardando..." : "Guardar"}</button></div>
        </form>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <p className="text-xs text-slate-400">Formato CSV: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">nombre,apellido,dni,celular</code><span className="ml-4 text-slate-500">{records.filter(r => r.subscribed).length} registrados de {records.length} totales</span></p>
      </div>

      <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Buscar por DNI o nombre..." className="w-full max-w-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

      {records.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"><p className="text-slate-400 mb-3">No hay afiliados cargados</p><p className="text-xs text-slate-500">Import\u00e1 un CSV para comenzar</p></div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800"><tr className="text-left text-xs font-medium text-slate-500">
              <th className="px-5 py-3">Nombre</th><th className="px-5 py-3">Apellido</th><th className="px-5 py-3">DNI</th><th className="px-5 py-3 hidden md:table-cell">Celular</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 hidden lg:table-cell">Fecha suscripci\u00f3n</th><th className="px-5 py-3 hidden lg:table-cell">Dispositivo</th><th className="px-5 py-3 text-right">Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-500">Sin resultados</td></tr> : filtered.map(r => (editId === r.id ? (
                <tr key={r.id} className="border-b border-slate-800/50 bg-blue-500/5">
                  <td className="px-5 py-2"><input value={editNombre} onChange={e => setEditNombre(e.target.value)} className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-5 py-2"><input value={editApellido} onChange={e => setEditApellido(e.target.value)} className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-5 py-2"><input value={editDni} onChange={e => setEditDni(e.target.value.replace(/\D/g, "").slice(0, 8))} className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-5 py-2 hidden md:table-cell"><input value={editCel} onChange={e => setEditCel(e.target.value.replace(/\D/g, ""))} className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-5 py-2 text-slate-400 text-xs">Editando</td>
                  <td className="px-5 py-2 hidden lg:table-cell"></td>
                  <td className="px-5 py-2 hidden lg:table-cell"></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={handleSaveEdit} className="text-xs text-emerald-400 hover:text-emerald-300 mr-2">Guardar</button>
                    <button onClick={() => setEditId(null)} className="text-xs text-slate-400 hover:text-slate-300">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="px-5 py-3 text-slate-300">{r.nombre}</td>
                  <td className="px-5 py-3 text-slate-300">{r.apellido}</td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">{r.dni}</td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{r.celular}</td>
                  <td className="px-5 py-3">{r.subscribed ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Registrado</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Pendiente</span>}</td>
                  <td className="px-5 py-3 text-slate-500 hidden lg:table-cell">{r.subscribedAt ? new Date(r.subscribedAt).toLocaleDateString("es-AR") : "-"}</td>
                  <td className="px-5 py-3 text-slate-500 hidden lg:table-cell">{r.deviceInfo || "-"}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleEdit(r)} className="text-xs text-blue-400 hover:text-blue-300 mr-2">Editar</button>
                    {r.subscribed && <button onClick={() => handleReset(r.id)} className="text-xs text-amber-400 hover:text-amber-300 mr-2">Reestablecer</button>}
                    <button onClick={() => handleDelete(r.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
