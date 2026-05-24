"use client"

import { useState, useEffect } from "react"

type Props = { companyId: string; companyName: string; primaryColor: string }

export function NotificationPrompt({ companyId, companyName, primaryColor }: Props) {
  const [supported, setSupported] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showInstall, setShowInstall] = useState(false)
  const [regError, setRegError] = useState("")

  useEffect(() => {
    let cancelled = false
    function wait() {
      if (cancelled) return
      if (typeof window !== "undefined" && "OneSignal" in window) {
        const OneSignal = (window as any).OneSignal
        if (OneSignal.User?.PushSubscription) { setSupported(true); return }
      }
      setTimeout(wait, 300)
    }
    wait()
    return () => { cancelled = true }
  }, [])

  const handleSubscribe = async () => {
    if (!supported) { setRegError("Navegador no compatible. Probá Chrome, Edge o Safari en iOS 16.4+."); return }
    setLoading(true); setRegError("")
    try {
      const OneSignal = (window as any).OneSignal
      await OneSignal.User.PushSubscription.optIn()
      const id = await OneSignal.User.PushSubscription.id
      if (!id) { setRegError("No se pudo obtener el ID"); return }
      const res = await fetch("/api/onesignal/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onesignalId: id, companyId, deviceInfo: { userAgent: navigator.userAgent, platform: navigator.platform, language: navigator.language } }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); setRegError(d.error || "Error al registrar"); return }
      setShowInstall(true)
      window.location.reload()
    } catch { setRegError("Error de conexión") }
    finally { setLoading(false) }
  }

  return (
    <div className="text-left">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center text-xl shadow-sm" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            🔔
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">¿Querés recibir avisos?</h3>
            <p className="text-sm text-slate-400 mt-0.5">Enterate al instante de comunicados y alertas de {companyName}</p>
          </div>
        </div>

        <button onClick={handleSubscribe} disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          style={{ backgroundColor: primaryColor }}>
          {loading ? "Activando..." : "Activar notificaciones"}
        </button>

        {regError && (
            <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400">{regError}</div>
        )}

        <p className="text-xs text-zinc-400 dark:text-slate-500 mt-4 text-center">Sin spam. Solo avisos importantes.</p>
      </div>

      {showInstall && <InstallGuide />}
    </div>
  )
}

function InstallGuide() {
  const [isIOS, setIsIOS] = useState(false)
  useEffect(() => { setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent)) }, [])
  if (!isIOS) return null

  return (
    <div className="mt-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 p-5 text-left animate-slide-up">
      <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-3 flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">📲</span>
        Instalar en pantalla principal
      </h3>
      <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
        <li>Tocá <strong>Compartir</strong> en Safari</li>
        <li>Seleccioná <strong>Agregar a pantalla de inicio</strong></li>
        <li>Tocá <strong>Agregar</strong> y abrí desde el nuevo ícono</li>
      </ol>
    </div>
  )
}
