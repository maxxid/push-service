"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { LandingBlock } from "@/components/portal/landing-blocks"
import { BlockPreview } from "@/components/portal/landing-preview"

type Props = {
  landingTitle: string
  blocks: LandingBlock[]
  companyId: string
  companyName: string
}

export function LandingSubscriptionGate({
  landingTitle,
  blocks,
  companyId,
  companyName,
}: Props) {
  const [status, setStatus] = useState<"loading" | "subscribed" | "unsubscribed">("loading")
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState("")
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkSubscription = useCallback(() => {
    if (typeof window === "undefined" || !("OneSignal" in window)) {
      if (pollRef.current) clearTimeout(pollRef.current)
      pollRef.current = setTimeout(checkSubscription, 300)
      return
    }
    const OneSignal = (window as any).OneSignal
    if (!OneSignal?.User?.PushSubscription) {
      if (pollRef.current) clearTimeout(pollRef.current)
      pollRef.current = setTimeout(checkSubscription, 300)
      return
    }

    const opt = OneSignal.User.PushSubscription.optedIn
    if (typeof opt === "boolean") {
      setStatus(opt ? "subscribed" : "unsubscribed")
    } else if (opt && typeof opt.then === "function") {
      opt.then((optedIn: boolean) => {
        setStatus(optedIn ? "subscribed" : "unsubscribed")
      })
    } else {
      setStatus("unsubscribed")
    }

    OneSignal.User.PushSubscription.addEventListener("change", async (sub: any) => {
      const optedIn = sub.current?.optedIn ?? false
      setStatus(optedIn ? "subscribed" : "unsubscribed")

      if (!optedIn) {
        const playerId = await OneSignal.User.PushSubscription.id
        if (playerId) {
          fetch("/api/onesignal/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ onesignalId: playerId }),
          }).catch(() => {})
        }
      } else {
        handleSubscribeSilent()
      }
    })
  }, [])

  useEffect(() => {
    checkSubscription()
    const timeout = setTimeout(() => setStatus("unsubscribed"), 5000)
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current)
      clearTimeout(timeout)
    }
  }, [checkSubscription])

  const doSubscribe = useCallback(async () => {
    if (typeof window === "undefined" || !("OneSignal" in window)) return
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
  }, [companyId])

  const handleSubscribeSilent = useCallback(async () => {
    try { await doSubscribe() } catch {}
  }, [doSubscribe])

  const handleSubscribe = async () => {
    setRegLoading(true)
    setRegError("")

    try {
      await doSubscribe()
      setStatus("subscribed")
    } catch {
      setRegError("No se pudo completar la suscripción. ¿Ya aceptaste el permiso del navegador?")
    } finally {
      setRegLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-zinc-500 animate-pulse">Cargando...</p>
      </div>
    )
  }

  if (status === "unsubscribed") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          {landingTitle}
        </h1>
        <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
          Activá las notificaciones para ver el contenido de {companyName}.
        </p>

        <div className="max-w-sm mx-auto space-y-3">
          <Button
            onClick={handleSubscribe}
            disabled={regLoading}
            className="w-full"
            size="lg"
          >
            {regLoading ? "Activando..." : "Activar notificaciones"}
          </Button>
          {regError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {regError}
            </p>
          )}
          <p className="text-xs text-zinc-400">
            Sin spam. Solo avisos de {companyName}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">{landingTitle}</h1>
      {blocks.length === 0 ? (
        <p className="text-zinc-500">Sin contenido</p>
      ) : (
        blocks.map((block) => <BlockPreview key={block.id} block={block} />)
      )}
    </div>
  )
}
