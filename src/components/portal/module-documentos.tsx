"use client"

import { useEffect, useState } from "react"

type Document = {
  id: string
  title: string
  description: string | null
  fileUrl: string
  category: string
}

export function DocumentosModule() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocs(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (docs.length === 0) return null

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold text-zinc-900 mb-4">📁 Documentación</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {docs.slice(0, 6).map((doc) => (
          <a
            key={doc.id}
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-50 rounded-xl p-4 hover:bg-blue-50 transition-colors flex items-start gap-3"
          >
            <span className="text-xl">📄</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {doc.title}
              </p>
              {doc.description && (
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                  {doc.description}
                </p>
              )}
              <span className="text-xs text-blue-600 mt-1 inline-block">
                Descargar →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
