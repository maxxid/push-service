"use client"
import { useEffect, useState } from "react"; import { toast } from "@/lib/toast"
type Doc = { id: string; title: string; description: string | null; fileUrl: string; category: string; company?: { name: string } }
export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]); const [loading, setLoading] = useState(true); const [show, setShow] = useState(false); const [t, setT] = useState(""); const [u, setU] = useState(""); const [d, setD] = useState(""); const [cat, setCat] = useState("general"); const [file, setFile] = useState<File | null>(null); const [uploading, setUploading] = useState(false)
  const fd = () => { fetch("/api/documents").then(r => r.json()).then((d: any[]) => setDocs(Array.isArray(d) ? d : [])).finally(() => setLoading(false)) }
  useEffect(() => { fd() }, [])
  const ha = async (e: React.FormEvent) => { e.preventDefault(); if (!t) { toast.error("Poné un título"); return }; if (!file && !u) { toast.error("Subí un archivo o pegá una URL"); return }
    let url = u; if (file) { setUploading(true); try { const fd = new FormData(); fd.append("file", file); const ext = file.name.split(".").pop() || "file"; fd.append("name", `${t.replace(/\s+/g, "-").toLowerCase()}.${ext}`); const ur = await fetch("/api/upload", { method: "POST", body: fd }); if (!ur.ok) { const e = await ur.json().catch(() => ({})); toast.error(e.error || "Error al subir. ¿BLOB_READ_WRITE_TOKEN?"); setUploading(false); return }; const b = await ur.json(); url = b.url } catch { toast.error("Error de conexión"); setUploading(false); return }; setUploading(false) }
    const r = await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: t, fileUrl: url, description: d || undefined, category: cat }) })
    if (r.ok) { toast.success("Documento agregado"); setT(""); setU(""); setD(""); setCat("general"); setShow(false); setFile(null); fd() } else { const e = await r.json().catch(() => ({})); toast.error(e.error || "Error") }
  }
  if (loading) return <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-20 bg-slate-800 rounded-2xl" />)}</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-white">Documentación</h1><button onClick={() => setShow(!show)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl">{show ? "Cancelar" : "Subir documento"}</button></div>
      {show && (
        <form onSubmit={ha} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 space-y-4 max-w-xl">
          <input type="text" value={t} onChange={e => setT(e.target.value)} placeholder="Título" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div><input type="file" onChange={e => { setFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setU("") }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx" className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" /><p className="text-xs text-slate-500 mt-1">{file ? file.name : "O pegá una URL abajo"}</p></div>
          <input type="url" value={u} onChange={e => setU(e.target.value)} placeholder="https://..." disabled={!!file} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40" />
          <div className="flex gap-3">
            <select value={cat} onChange={e => setCat(e.target.value)} className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"><option value="general">General</option><option value="resolucion">Resolución</option><option value="estatuto">Estatuto</option><option value="formulario">Formulario</option></select>
            <input type="text" value={d} onChange={e => setD(e.target.value)} placeholder="Descripción (opcional)" className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl">{uploading ? "Subiendo..." : "Agregar"}</button>
        </form>
      )}
      {docs.length === 0 ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"><p className="text-slate-400">No hay documentos cargados</p></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{docs.map(doc => (
          <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-start hover:border-slate-700">
            <div className="min-w-0 flex-1"><h3 className="font-medium text-white text-sm truncate">📄 {doc.title}</h3>{doc.description && <p className="text-xs text-slate-500 mt-1 truncate">{doc.description}</p>}
              <div className="flex items-center gap-2 mt-2"><span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{doc.category}</span><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">Abrir →</a></div></div>
            <button onClick={async () => { if (!confirm("¿Eliminar?")) return; await fetch(`/api/documents/${doc.id}`, { method: "DELETE" }); toast.success("Eliminado"); fd() }} className="text-red-400 hover:text-red-300 text-sm ml-3">✕</button>
          </div>))}</div>
      )}
    </div>
  )
}
