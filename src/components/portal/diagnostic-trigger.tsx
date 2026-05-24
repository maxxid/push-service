"use client"

import { useState } from "react"
import { PushDiagnostic } from "./push-diagnostic"

export function DiagnosticTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full py-3 px-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-slate-300 text-sm transition-colors group">
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          ¿Problemas con las notificaciones?
        </span>
      </button>
      <PushDiagnostic open={open} onClose={() => setOpen(false)} />
    </>
  )
}
