"use client"

import { useState, useEffect, useCallback } from "react"

type CheckStatus = "idle" | "loading" | "success" | "error" | "warning"
type Platform = "android" | "ios"

type Check = { key: string; label: string; status: CheckStatus; detail?: string }

export function PushDiagnostic({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [checks, setChecks] = useState<Check[]>([])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!open) return
    const ua = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/.test(ua)
    setPlatform(isIOS ? "ios" : "android")
  }, [open])

  const runChecks = useCallback(async (p: Platform) => {
    setRunning(true)
    const items: Check[] = []
    const add = (key: string, label: string) => { items.push({ key, label, status: "loading" }); setChecks([...items]) }
    const done = (key: string, status: CheckStatus, detail?: string) => {
      const idx = items.findIndex(c => c.key === key)
      if (idx >= 0) { items[idx] = { ...items[idx], status, detail }; setChecks([...items]) }
    }

    // 1. Browser check
    add("browser", "Estás usando el navegador correcto")
    await new Promise(r => setTimeout(r, 400))
    if (p === "ios") {
      const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent)
      done("browser", isSafari ? "success" : "error",
        isSafari ? "Perfecto, estás en Safari" : "Abrí esta página en la app Safari de tu iPhone")
    } else {
      const ok = /Chrome|Edge|Brave|Chromium/.test(navigator.userAgent) && !/CriOS|EdgiOS/.test(navigator.userAgent)
      done("browser", ok ? "success" : "warning",
        ok ? "Navegador compatible detectado" : "Probá abrir esta página en Google Chrome")
    }

    // 2. HTTPS
    add("https", "La conexión es segura")
    await new Promise(r => setTimeout(r, 300))
    const isHttps = window.location.protocol === "https:" || window.location.hostname === "localhost"
    done("https", isHttps ? "success" : "error",
      isHttps ? "Conexión segura verificada" : "El sitio debe cargar con candado verde (https://)")

    // 3. PWA (iOS only)
    if (p === "ios") {
      add("pwa", "La app está instalada en el inicio")
      await new Promise(r => setTimeout(r, 400))
      const standalone = (window.navigator as any).standalone || window.matchMedia("(display-mode: standalone)").matches
      done("pwa", standalone ? "success" : "warning",
        standalone ? "Ya está instalada en tu pantalla principal" : "Tocá Compartir ↑ → Agregar a pantalla de inicio")
    }

    // Check subscription state first
    const hasOneSignal = typeof window !== "undefined" && "OneSignal" in window
    let isSubscribed = false
    if (hasOneSignal) {
      try {
        const OneSignal = (window as any).OneSignal
        const sub = await OneSignal.User?.PushSubscription?.optedIn
        isSubscribed = typeof sub === "boolean" ? sub : await Promise.resolve(sub).catch(() => false)
      } catch {}
    }

    // Determine root cause
    const permBlocked = "Notification" in window && Notification.permission === "denied"
    const permPending = "Notification" in window && Notification.permission === "default"
    const permGranted = "Notification" in window && Notification.permission === "granted"

    // 4. Permission (ROOT CAUSE DETECTOR)
    add("permission", "Diste permiso para recibir notificaciones")
    await new Promise(r => setTimeout(r, 300))
    if (permBlocked) {
      const msg = p === "ios"
        ? "⚠️ Bloqueado. Andá a Ajustes > Safari > Notificaciones > Permitir."
        : "⚠️ Bloqueado. Tocá el candado 🔒 junto a la URL > Permisos > Notificaciones > Permitir."
      done("permission", "error", msg)
    } else if (permGranted) {
      done("permission", "success", "Sí, ya diste permiso")
    } else {
      done("permission", "warning", "Tocá Activar notificaciones y aceptá cuando el navegador pregunte")
    }

    // 5. OneSignal
    add("onesignal", "El servicio de notificaciones está listo")
    await new Promise(r => setTimeout(r, 400))
    if (permBlocked) {
      done("onesignal", "warning", "Bloqueado porque las notificaciones están denegadas ↑")
    } else if (isSubscribed) {
      done("onesignal", "success", "Estás suscripto y listo para recibir avisos")
    } else if (hasOneSignal) {
      done("onesignal", "warning", "Tocá Activar notificaciones para completar")
    } else {
      done("onesignal", "warning", "Se activa al tocar el botón de notificaciones")
    }

    // 6. Service Worker
    add("sw", "El sistema está listo para funcionar")
    await new Promise(r => setTimeout(r, 500))
    try {
      const regs = await navigator.serviceWorker?.getRegistrations()
      const hasSW = regs && regs.length > 0
      if (hasSW) {
        done("sw", "success", "Todo listo para recibir notificaciones")
      } else if (permBlocked) {
        done("sw", "warning", "Depende de arreglar los permisos bloqueados ↑")
      } else if (permGranted && !hasSW) {
        done("sw", "error", "⚠️ Algo no cargó bien. Recargá la página para intentar de nuevo.")
      } else {
        done("sw", "warning", "Se activa cuando aceptás las notificaciones")
      }
    } catch { done("sw", "warning", "Se verificará al activar notificaciones") }

    setRunning(false)
  }, [])

  useEffect(() => { if (platform) runChecks(platform) }, [platform, runChecks])

  if (!open) return null

  const icon = (s: CheckStatus) => {
    if (s === "loading") return <div className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin" />
    if (s === "success") return <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
    if (s === "warning") return <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
    if (s === "error") return <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    return <div className="h-4 w-4 rounded-full border-2 border-slate-700" />
  }

  const allDone = checks.length > 0 && checks.every(c => c.status !== "loading")
  const hasErrors = checks.some(c => c.status === "error")
  const hasWarnings = checks.some(c => c.status === "warning")
  const allGood = allDone && !hasErrors && !hasWarnings

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Diagnóstico de notificaciones</h2>
            <p className="text-xs text-slate-400 mt-0.5">{platform === "ios" ? "iPhone / iPad" : "Android"}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        <div className="p-6">
          {/* Platform selector */}
          {!running && checks.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <p className="text-slate-400 text-sm">Seleccioná tu dispositivo</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setPlatform("android"); runChecks("android") }}
                  className="px-6 py-3 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-800/50 text-white font-medium text-sm transition-colors">
                  📱 Android
                </button>
                <button onClick={() => { setPlatform("ios"); runChecks("ios") }}
                  className="px-6 py-3 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-800/50 text-white font-medium text-sm transition-colors">
                  📱 iPhone / iPad
                </button>
              </div>
              {platform && (
                <p className="text-xs text-slate-500">Detectado: {platform === "ios" ? "iOS" : "Android"} · Podés cambiar manualmente</p>
              )}
            </div>
          )}

          {/* Checklist */}
          {checks.length > 0 && (
            <div className="space-y-1">
              {checks.map((c, i) => (
                <div key={c.key}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${c.status === "loading" ? "opacity-60" : ""}`}
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="shrink-0">{icon(c.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${c.status === "error" ? "text-red-300" : c.status === "warning" ? "text-amber-300" : c.status === "success" ? "text-emerald-300" : "text-slate-300"}`}>
                      {c.label}
                    </p>
                    {c.detail && (
                      <p className={`text-xs mt-0.5 ${c.status === "error" ? "text-red-400/70" : c.status === "warning" ? "text-amber-400/70" : "text-slate-500"}`}>
                        {c.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Result */}
          {allDone && (
            <div className="space-y-3">
              <div className={`mt-6 rounded-xl p-4 text-center ${allGood ? "bg-emerald-500/10 border border-emerald-500/20" : hasErrors ? "bg-red-500/10 border border-red-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                <p className={`font-semibold text-sm ${allGood ? "text-emerald-300" : hasErrors ? "text-red-300" : "text-amber-300"}`}>
                  {allGood ? "✅ Todo listo. Ya podés recibir notificaciones." : hasErrors ? "❗ El ítem en rojo es lo que está trabando al resto." : "⚠️ Solo falta activar. Estás a un toque."}
                </p>
              </div>

              {/* Action buttons */}
              {!allGood && (
                <div className="flex flex-col gap-2">
                  {checks.some(c => c.key === "permission" && c.status === "error") && (
                    <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-left">
                      <p className="text-xs text-slate-300 mb-2">🛠️ Cómo arreglarlo:</p>
                      {platform === "android" ? (
                        <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                          <li>Tocá el ícono 🔒 a la izquierda de la URL</li>
                          <li>Seleccioná <strong className="text-white">Permisos</strong></li>
                          <li>Activá <strong className="text-white">Notificaciones</strong></li>
                        </ol>
                      ) : (
                        <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                          <li>Abrí <strong className="text-white">Ajustes</strong> del iPhone</li>
                          <li>Bajá hasta <strong className="text-white">Safari</strong></li>
                          <li>Entrá a <strong className="text-white">Notificaciones</strong> y permitilas</li>
                        </ol>
                      )}
                    </div>
                  )}
                  {checks.some(c => c.status === "warning" && c.key !== "permission" && c.key !== "onesignal") && (
                    <button onClick={() => { onClose(); setTimeout(() => document.querySelector<HTMLButtonElement>('[data-activar]')?.click(), 300) }}
                      className="py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-colors">
                      Volver a intentar activar notificaciones
                    </button>
                  )}
                  {!allGood && !checks.some(c => c.key === "permission" && c.status === "error") && (
                    <button onClick={() => window.location.reload()}
                      className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
                      Recargar página
                    </button>
                  )}
                </div>
              )}

              <button onClick={() => { setChecks([]); setRunning(false); runChecks(platform!) }}
                className="w-full text-xs text-slate-400 hover:text-white underline underline-offset-2">
                Volver a ejecutar diagnóstico
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
