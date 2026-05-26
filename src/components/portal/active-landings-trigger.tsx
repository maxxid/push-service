"use client"

import { useState, useEffect } from "react"

type ActiveLanding = {
  id: string; title: string; slug: string; views: number; createdAt: string
}

export function ActiveLandingsTrigger({ subdomain, requireDni }: { subdomain: string; requireDni?: boolean }) {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState<ActiveLanding[]>([])
  const [loading, setLoading] = useState(false)
  const [dniOk, setDniOk] = useState(false)

  useEffect(() => {
    if (requireDni) {
      const match = document.cookie.match(/dni-verified=true/)
      setDniOk(!!match)
    } else {
      setDniOk(true)
    }
  }, [requireDni])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/public/active-landings?company=${encodeURIComponent(subdomain)}`)
      .then(r => r.json())
      .then(data => setPages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [open, subdomain])

  if (requireDni && !dniOk) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-1.5 rounded-full border border-slate-800 hover:border-slate-700 bg-transparent hover:bg-slate-900/50"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Ver más comunicados activos
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-white">Comunicados activos</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-7 w-7 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin" />
                </div>
              ) : pages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                    <svg className="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">No hay otras notificaciones activas</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {pages.map((page, i) => (
                    <a
                      key={page.id}
                      href={`/portal/landing/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-800/50 transition-colors group animate-fade-in"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                        <svg className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-blue-300 truncate transition-colors">
                          {page.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(page.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-xs text-slate-600">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {page.views}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
