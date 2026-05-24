"use client"

import { useState } from "react"

export function LandingMobilePreview({ slug }: { slug?: string | null }) {
  const [open, setOpen] = useState(false)

  if (!slug) return null

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-green-600 hover:text-green-800 text-sm">
        Ver landing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-medium text-zinc-500">Vista previa mobile</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-lg leading-none">&times;</button>
            </div>
            <div className="relative" style={{ height: "70vh" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[375px] h-full border-x border-zinc-200 dark:border-zinc-800">
                <iframe
                  src={`/portal/landing/${slug}`}
                  className="w-full h-full border-0"
                  title="Landing preview"
                />
              </div>
            </div>
            <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800">
              <a href={`/portal/landing/${slug}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800">
                Abrir en pestaña nueva →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
