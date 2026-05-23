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

  const handleChange = useCallback((subscription: any) => {
    setSubscribed(subscription.current.optedIn)
  }, [])

  useEffect(() => {
    let cancelled = false
    let oneSignalRef: any = null

    function waitForOneSignal() {
      if (cancelled) return
      if (typeof window !== "undefined" && "OneSignal" in window) {
        const OneSignal = (window as any).OneSignal
        if (OneSignal.User?.PushSubscription) {
          oneSignalRef = OneSignal
          setSupported(true)

          OneSignal.User.PushSubscription.addEventListener(
            "change",
            handleChange
          )

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
      if (oneSignalRef?.User?.PushSubscription) {
        oneSignalRef.User.PushSubscription.removeEventListener(
          "change",
          handleChange
        )
      }
    }
  }, [handleChange])

  const handleSubscribe = async () => {
    if (!supported) {
      alert(
        "Tu navegador no soporta notificaciones push. Probá con Chrome, Edge o Safari en iOS 16.4+."
      )
      return
    }

    setLoading(true)

    try {
      const OneSignal = (window as any).OneSignal

      await OneSignal.User.PushSubscription.optIn()

      const playerId = await OneSignal.User.PushSubscription.id

      if (playerId) {
        await fetch("/api/onesignal/register", {
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
      }

      setSubscribed(true)
      setShowInstall(true)
    } catch (err) {
      console.error("Error al suscribir:", err)
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
      <p className="text-xs text-zinc-400 text-center">
        No enviamos spam. Solo avisos institucionales importantes.
      </p>
    </div>
  )
}

function InstallGuide({ primaryColor }: { primaryColor: string }) {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent))
  }, [])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
      <h3 className="font-semibold text-blue-900 text-sm mb-2">
        Instalar en tu pantalla principal
      </h3>
      {isIOS ? (
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>
            Tocá el botón <strong>Compartir</strong> en Safari
          </li>
          <li>
            Seleccioná{" "}
            <strong>&quot;Agregar a la pantalla de inicio&quot;</strong>
          </li>
          <li>
            Tocá <strong>Agregar</strong>
          </li>
        </ol>
      ) : (
        <p className="text-xs text-blue-800">
          Se instalará automáticamente. También podés usar el botón de instalar
          en la barra del navegador.
        </p>
      )}
      <p className="text-xs text-blue-600 mt-2">
        Así accedés más rápido y sin abrir el navegador.
      </p>
    </div>
  )
}
