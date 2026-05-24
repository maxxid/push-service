"use client"

import { useState, useEffect } from "react"

type Props = {
  companyId: string
  companyName: string
  primaryColor: string
}

export function NotificationPrompt({ companyId, companyName, primaryColor }: Props) {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showInstall, setShowInstall] = useState(false)
  const [regError, setRegError] = useState("")

  useEffect(() => {
    let cancelled = false
    function waitForOneSignal() {
      if (cancelled) return
      if (typeof window !== "undefined" && "OneSignal" in window) {
        const OneSignal = (window as any).OneSignal
        if (OneSignal.User?.PushSubscription) {
          setSupported(true)
          const opt = OneSignal.User.PushSubscription.optedIn
          if (typeof opt === "boolean") { if (!cancelled) setSubscribed(opt) }
          else if (opt && typeof opt.then === "function") opt.then((v: boolean) => { if (!cancelled) setSubscribed(v) })
          return
        }
      }
      setTimeout(waitForOneSignal, 300)
    }
    waitForOneSignal()
    return () => { cancelled = true }
  }, [])

  const handleSubscribe = async () => {
    if (!supported) {
      setRegError("Tu navegador no soporta notificaciones. Probá Chrome, Edge o Safari en iOS 16.4+.")
      return
    }
    setLoading(true); setRegError("")
    try {
      const OneSignal = (window as any).OneSignal
      await OneSignal.User.PushSubscription.optIn()
      const playerId = await OneSignal.User.PushSubscription.id
      if (!playerId) { setRegError("No se pudo obtener el ID"); return }
      const res = await fetch("/api/onesignal/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onesignalId: playerId, companyId, deviceInfo: { userAgent: navigator.userAgent, platform: navigator.platform, language: navigator.language } }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); setRegError(d.error || "Error al registrar"); return }
      setSubscribed(true); setShowInstall(true)
    } catch { setRegError("Error de conexión") }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="h-16 w-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
          🔔
        </div>

        <h3 className="font-bold text-xl text-[var(--foreground)] mb-1">¿Querés recibir avisos?</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">Enterate al instante de comunicados, alertas y novedades de {companyName}.</p>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="group relative w-full px-6 py-3.5 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 overflow-hidden"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Activando...</>
            ) : "Activar notificaciones"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {regError && (
          <div className="mt-4 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950 p-3 text-xs text-red-600 dark:text-red-400">{regError}</div>
        )}

        <p className="text-xs text-[var(--muted-foreground)] mt-4">Sin spam. Solo avisos importantes.</p>
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
    <div className="rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/50 p-5 text-left animate-slide-up">
      <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-3 flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">📲</span>
        Instalar en pantalla principal
      </h3>
      <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside leading-relaxed">
        <li>Tocá <strong className="text-blue-900 dark:text-blue-100">Compartir</strong> en Safari</li>
        <li>Seleccioná <strong className="text-blue-900 dark:text-blue-100">Agregar a pantalla de inicio</strong></li>
        <li>Tocá <strong className="text-blue-900 dark:text-blue-100">Agregar</strong> y abrí desde el nuevo ícono</li>
      </ol>
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 pt-3 border-t border-blue-100 dark:border-blue-900">iPhone/iPad requiere instalar la app para recibir notificaciones.</p>
    </div>
  )
}
