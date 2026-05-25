"use client"

import { useState } from "react"
import { toPng } from "html-to-image"

export function DownloadButton({ filename }: { filename: string }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    const el = document.getElementById("landing-content")
    if (!el) return

    setLoading(true)
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#0a0a0b",
        pixelRatio: 2,
      })
      const link = document.createElement("a")
      link.download = `${filename.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="shrink-0 h-9 w-9 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-colors group disabled:opacity-50"
      title="Descargar como imagen"
    >
      {loading ? (
        <div className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin" />
      ) : (
        <svg className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )}
    </button>
  )
}
