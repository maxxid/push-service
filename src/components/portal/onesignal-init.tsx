"use client"

import Script from "next/script"
import { useEffect } from "react"

export function OneSignalInit({ appId }: { appId: string }) {
  useEffect(() => {
    if (!appId) return

    const w = window as any
    w.OneSignalDeferred = w.OneSignalDeferred || []
    w.OneSignalDeferred.push(async (OneSignal: any) => {
      await OneSignal.init({
        appId,
      })
    })
  }, [appId])

  if (!appId) return null

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="afterInteractive"
    />
  )
}
