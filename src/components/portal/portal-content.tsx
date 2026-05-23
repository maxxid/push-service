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

export function PortalContent({ companyId, companyName, primaryColor, modules }: Props) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkSub = useCallback(() => {
    if (typeof window !== "undefined" && "OneSignal" in window) {
      const OneSignal = (window as any).OneSignal
      if (OneSignal?.User?.PushSubscription) {
        const opt = OneSignal.User.PushSubscription.optedIn
        const resolve = (v: boolean) => { setSubscribed(v); setLoading(false) }
        if (typeof opt === "boolean") resolve(opt)
        else if (opt && typeof opt.then === "function") opt.then(resolve)
        else setLoading(false)

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
    const timeout = setTimeout(() => setLoading(false), 5000)
    return () => { clearInterval(iv); clearTimeout(timeout) }
  }, [checkSub])

  return (
    <div className="animate-scale-in">
      <div className="max-w-md mx-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor }} />
            <div className="h-2 w-2 rounded-full animate-bounce stagger-1" style={{ backgroundColor: primaryColor, opacity: 0.65 }} />
            <div className="h-2 w-2 rounded-full animate-bounce stagger-2" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
          </div>
        ) : subscribed ? (
          <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-6 animate-scale-in">
            <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-700 dark:text-green-300 font-semibold text-lg">
              ¡Notificaciones activadas!
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
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
        <div className="animate-fade-in stagger-3">
          <PortalModules modules={modules} primaryColor={primaryColor} />
        </div>
      )}
    </div>
  )
}
