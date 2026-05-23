"use client"

import { useState, useEffect, useCallback } from "react"
import { NotificationPrompt } from "./notification-prompt"
import { PortalModules } from "./portal-modules"

type Props = {
  companyId: string
  companyName: string
  primaryColor: string
  modules: string[]
}

export function PortalContent({
  companyId,
  companyName,
  primaryColor,
  modules,
}: Props) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkSub = useCallback(() => {
    if (typeof window !== "undefined" && "OneSignal" in window) {
      const OneSignal = (window as any).OneSignal
      if (OneSignal?.User?.PushSubscription) {
        OneSignal.User.PushSubscription.optedIn.then((optedIn: boolean) => {
          setSubscribed(optedIn)
          setLoading(false)
        })
        OneSignal.User.PushSubscription.addEventListener("change", (sub: any) => {
          setSubscribed(sub.current?.optedIn ?? false)
        })
        return true
      }
    }
    return false
  }, [])

  useEffect(() => {
    if (checkSub()) return
    const iv = setInterval(() => { if (checkSub()) clearInterval(iv) }, 300)
    return () => clearInterval(iv)
  }, [checkSub])

  return (
    <div>
      <div className="max-w-sm mx-auto">
        {loading ? (
          <p className="text-zinc-500 text-sm">Verificando...</p>
        ) : subscribed ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-medium">¡Notificaciones activadas!</p>
            <p className="text-green-600 text-sm mt-1">
              Recibirás los avisos de {companyName}
            </p>
          </div>
        ) : (
          <NotificationPrompt
            companyId={companyId}
            companyName={companyName}
            primaryColor={primaryColor}
          />
        )}
      </div>

      {subscribed && modules.length > 0 && (
        <PortalModules modules={modules} primaryColor={primaryColor} />
      )}
    </div>
  )
}
