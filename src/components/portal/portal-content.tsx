"use client"

import { useState, useEffect, useCallback } from "react"
import { NotificationPrompt } from "./notification-prompt"
import { PortalModules } from "./portal-modules"

type Props = { companyId: string; companyName: string; primaryColor: string; modules: string[] }

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
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor }} />
          <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, opacity: 0.6, animationDelay: "0.1s" }} />
          <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, opacity: 0.3, animationDelay: "0.2s" }} />
        </div>
      ) : subscribed ? (
        <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/30 p-7 text-center animate-scale-in">
          <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-900/50">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-emerald-200 font-bold text-lg">Notificaciones activadas</p>
          <p className="text-emerald-400 text-sm mt-1">Recibirás los avisos de {companyName}</p>
        </div>
      ) : (
        <NotificationPrompt companyId={companyId} companyName={companyName} primaryColor={primaryColor} />
      )}

      {subscribed && modules.length > 0 && (
        <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <PortalModules modules={modules} primaryColor={primaryColor} />
        </div>
      )}
    </div>
  )
}
