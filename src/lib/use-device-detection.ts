"use client"

import { useState, useEffect } from "react"

export type DeviceInfo = {
  userAgent: string
  isIOS: boolean
  isAndroid: boolean
  isDesktop: boolean
  isSafariIOS: boolean
  isChromeIOS: boolean
  isEdgeIOS: boolean
  isFirefoxIOS: boolean
  isWebView: boolean
  isInstagram: boolean
  isFacebook: boolean
  isWhatsApp: boolean
  isStandalone: boolean
  isSafari: boolean
  browser: string
}

function detect(): DeviceInfo {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
  const isIOS = /iPhone|iPad|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)

  const isChromeIOS = /CriOS/.test(ua)
  const isEdgeIOS = /EdgiOS/.test(ua)
  const isFirefoxIOS = /FxiOS/.test(ua)
  const isSafariIOS = isIOS && /Safari/.test(ua) && !isChromeIOS && !isEdgeIOS && !isFirefoxIOS
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|Edg/.test(ua)

  const isInstagram = /Instagram/.test(ua)
  const isFacebook = /FBAN|FBAV/.test(ua)
  const isWhatsApp = /WhatsApp/.test(ua)
  const isWebView = isInstagram || isFacebook || isWhatsApp

  const isStandalone = typeof window !== "undefined" && (
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  )

  let browser = "Desconocido"
  if (isStandalone) browser = "PWA Instalada"
  else if (isChromeIOS) browser = "Chrome iOS"
  else if (isEdgeIOS) browser = "Edge iOS"
  else if (isFirefoxIOS) browser = "Firefox iOS"
  else if (isSafariIOS) browser = "Safari iOS"
  else if (isInstagram) browser = "Instagram WebView"
  else if (isFacebook) browser = "Facebook WebView"
  else if (isWhatsApp) browser = "WhatsApp WebView"
  else if (isIOS) browser = "iOS (otro)"
  else if (isAndroid) browser = "Android"
  else browser = "Desktop"

  const info: DeviceInfo = {
    userAgent: ua,
    isIOS,
    isAndroid,
    isDesktop: !isIOS && !isAndroid,
    isSafariIOS,
    isChromeIOS,
    isEdgeIOS,
    isFirefoxIOS,
    isWebView,
    isInstagram,
    isFacebook,
    isWhatsApp,
    isStandalone,
    isSafari,
    browser,
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[DeviceDetection]", info)
  }

  return info
}

export function useDeviceDetection() {
  const [device, setDevice] = useState<DeviceInfo>(() => ({
    userAgent: "", isIOS: false, isAndroid: false, isDesktop: true,
    isSafariIOS: false, isChromeIOS: false, isEdgeIOS: false, isFirefoxIOS: false,
    isWebView: false, isInstagram: false, isFacebook: false, isWhatsApp: false,
    isStandalone: false, isSafari: false, browser: "Cargando...",
  }))

  useEffect(() => {
    setDevice(detect())
  }, [])

  return device
}
