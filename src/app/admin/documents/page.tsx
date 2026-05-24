"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type Document = {
  id: string
  title: string
  description: string | null
  fileUrl: string
  category: string
  company?: { name: string }
  createdAt: string
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("general")
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const fetchDocs = () => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocs(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    let url = fileUrl
    if (file) {
      setUploading(true)
      const fd = new FormData()
      fd.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd })
      if (!uploadRes.ok) { setUploading(false); return }
      const blob = await uploadRes.json()
      url = blob.url
      setUploading(false)
    }

    if (!url) return

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, fileUrl: url, description: description || undefined, category }),
    })
    if (res.ok) {
      setTitle(""); setFileUrl(""); setDescription(""); setCategory("general")
      setShowForm(false); setFile(null)
      fetchDocs()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este documento?")) return
    await fetch(`/api/documents/${id}`, { method: "DELETE" })
    fetchDocs()
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Documentación</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Subir documento"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-zinc-200 p-6 mb-6 space-y-3 max-w-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resolución 2026-01"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="resolucion">Resolución</option>
                <option value="estatuto">Estatuto</option>
                <option value="formulario">Formulario</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Subir archivo (PDF, imagen, etc.)
            </label>
            <input
              type="file"
              onChange={(e) => { setFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setFileUrl("") }}
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
            />
            <p className="text-xs text-zinc-400 mt-1">{file ? `Archivo: ${file.name}` : "O pegá una URL abajo"}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              O pegá una URL
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://...documento.pdf"
              disabled={!!file}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breve descripción del documento"
            />
          </div>
          <Button type="submit" size="sm" disabled={uploading}>
            {uploading ? "Subiendo..." : "Agregar"}
          </Button>
        </form>
      )}

      {docs.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500">No hay documentos cargados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-zinc-200 p-4 flex justify-between items-start hover:border-blue-200 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-zinc-900 text-sm truncate">
                  📄 {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {doc.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Abrir →
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-400 hover:text-red-600 text-sm ml-3"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
