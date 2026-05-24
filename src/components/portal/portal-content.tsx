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
    <div>
      <div className="max-w-md mx-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <div className="h-2.5 w-2.5 rounded-full animate-bounce" style={{ backgroundColor: primaryColor }} />
            <div className="h-2.5 w-2.5 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, opacity: 0.6, animationDelay: "0.1s" }} />
            <div className="h-2.5 w-2.5 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, opacity: 0.3, animationDelay: "0.2s" }} />
          </div>
        ) : subscribed ? (
          <div className="rounded-3xl bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-100 dark:border-green-900 p-8 animate-scale-in">
            <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-green-500 dark:bg-green-600 flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-800 dark:text-green-200 font-bold text-xl">¡Notificaciones activadas!</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1.5">Recibirás los avisos de {companyName}</p>
          </div>
        ) : (
          <NotificationPrompt companyId={companyId} companyName={companyName} primaryColor={primaryColor} />
        )}
      </div>

      {subscribed && modules.length > 0 && (
        <div className="animate-fade-in stagger-3 mt-16">
          <PortalModules modules={modules} primaryColor={primaryColor} />
        </div>
      )}
    </div>
  )
}
