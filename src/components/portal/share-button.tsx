"use client"

import { useState } from "react"

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ url })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="shrink-0 h-9 w-9 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-colors group"
      title="Copiar enlace"
    >
      {copied ? (
        <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  )
}
