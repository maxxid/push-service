"use client"

import { useState } from "react"

type Props = {
  title: string
  message: string
  imageUrl?: string | null
  priority?: string
}

export function NotificationPreview({ title, message, imageUrl, priority }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-blue-600 hover:text-blue-800 text-sm">
        Previsualizar notificación
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-medium text-zinc-500">Vista previa de notificación</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-lg leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Android style */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Android</p>
                <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg max-w-[320px]">
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`h-4 w-4 rounded-full ${priority === "URGENTE" ? "bg-red-500" : "bg-blue-500"} flex items-center justify-center`}>
                        <span className="text-[8px] text-white">P</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">ahora · Notificaciones</span>
                    </div>
                    <p className="text-[13px] font-semibold text-white leading-tight">{title || "Título de la notificación"}</p>
                    <p className="text-[11px] text-zinc-300 mt-0.5 leading-tight">{message || "Mensaje de la notificación..."}</p>
                    {imageUrl && (
                      <img src={imageUrl} alt="" className="mt-2 rounded-lg max-h-20 object-cover" />
                    )}
                  </div>
                  <div className="h-1 bg-zinc-800" />
                </div>
              </div>

              {/* iOS style */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">iOS</p>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden shadow max-w-[320px]">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-5 w-5 rounded-md ${priority === "URGENTE" ? "bg-red-500" : "bg-blue-500"} flex items-center justify-center`}>
                          <span className="text-[9px] text-white font-bold">P</span>
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">Notificaciones</span>
                      </div>
                      <span className="text-[9px] text-zinc-400">ahora</span>
                    </div>
                    <p className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{title || "Título"}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{message || "Mensaje..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
