"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  companyId: string
  companyName: string
  primaryColor: string
}

export function NotificationPrompt({
  companyId,
  companyName,
  primaryColor,
}: Props) {
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
          OneSignal.User.PushSubscription.optedIn.then((optedIn: boolean) => {
            if (!cancelled) setSubscribed(optedIn)
          })
          return
        }
      }
      setTimeout(waitForOneSignal, 300)
    }

    waitForOneSignal()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubscribe = async () => {
    if (!supported) {
      setRegError(
        "Tu navegador no soporta notificaciones push. Probá con Chrome, Edge o Safari en iOS 16.4+."
      )
      return
    }

    setLoading(true)
    setRegError("")

    try {
      const OneSignal = (window as any).OneSignal

      await OneSignal.User.PushSubscription.optIn()

      const playerId = await OneSignal.User.PushSubscription.id

      if (!playerId) {
        setRegError("No se pudo obtener el ID de suscripción")
        return
      }

      const res = await fetch("/api/onesignal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onesignalId: playerId,
          companyId,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
          },
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setRegError(data.error || "Error al registrar suscriptor")
        return
      }

      setSubscribed(true)
      setShowInstall(true)
    } catch (err) {
      setRegError("Error de conexión al registrar")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-medium">
            ¡Notificaciones activadas!
          </p>
          <p className="text-green-600 text-sm mt-1">
            Recibirás los avisos de {companyName}
          </p>
        </div>
        {showInstall && <InstallGuide primaryColor={primaryColor} />}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full"
        size="lg"
        style={{
          backgroundColor: primaryColor,
          borderColor: primaryColor,
        }}
      >
        {loading ? "Activando..." : "Activar notificaciones"}
      </Button>
      {regError && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {regError}
        </p>
      )}
      <p className="text-xs text-zinc-400 text-center">
        No enviamos spam. Solo avisos institucionales importantes.
      </p>
    </div>
  )
}

function InstallGuide({ primaryColor }: { primaryColor: string }) {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    setIsIOS(/iPhone|iPad|iPod/.test(ua))
    setIsAndroid(/Android/.test(ua))
  }, [])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
      <h3 className="font-semibold text-blue-900 text-sm mb-2">
        Instalar en tu pantalla principal
      </h3>
      {isIOS ? (
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Tocá <strong>Compartir</strong> en Safari (↑)</li>
          <li>Seleccioná <strong>Agregar a la pantalla de inicio</strong></li>
          <li>Tocá <strong>Agregar</strong></li>
          <li>Abrí la app desde el nuevo ícono</li>
        </ol>
      ) : isAndroid ? (
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Tocá <strong>⋮</strong> (tres puntos) en Chrome</li>
          <li>Seleccioná <strong>Agregar a pantalla principal</strong></li>
          <li>Tocá <strong>Instalar</strong></li>
        </ol>
      ) : (
        <p className="text-xs text-blue-800">
          Buscá el botón de instalar en la barra del navegador o en el menú de opciones.
        </p>
      )}
      <p className="text-xs text-blue-600 mt-2">
        Cuando abras desde el ícono, las notificaciones mostrarán el nombre de la institución.
      </p>
    </div>
  )
}
