"use client"

import { useState } from "react"
import { useDeviceDetection, type DeviceInfo } from "@/lib/use-device-detection"

function ChromeIOSGuide() {
  const [copied, setCopied] = useState(false)
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="rounded-2xl border border-amber-800/50 bg-amber-950/30 p-6 text-left animate-scale-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg">⚠️</div>
        <div>
          <p className="font-semibold text-amber-200 text-sm">Abrir en Safari</p>
          <p className="text-xs text-amber-400/80">Chrome en iPhone no permite notificaciones push</p>
        </div>
      </div>
      <ol className="text-xs text-amber-200/80 space-y-2 ml-4 list-decimal leading-relaxed">
        <li>Tocá el botón <strong className="text-amber-100">Copiar enlace</strong></li>
        <li>Abrí la app <strong className="text-amber-100">Safari</strong></li>
        <li>Pegá el enlace y entrá</li>
      </ol>
      <button onClick={copyLink}
        className="mt-4 w-full py-2.5 rounded-xl border border-amber-700/50 bg-amber-500/10 text-amber-200 font-medium text-sm hover:bg-amber-500/20 transition-colors">
        {copied ? "✓ Enlace copiado" : "Copiar enlace"}
      </button>
    </div>
  )
}

function WebViewGuide({ device }: { device: DeviceInfo }) {
  const [copied, setCopied] = useState(false)
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const source = device.isInstagram ? "Instagram" : device.isFacebook ? "Facebook" : device.isWhatsApp ? "WhatsApp" : "esta app"

  return (
    <div className="rounded-2xl border border-red-800/50 bg-red-950/30 p-6 text-left animate-scale-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-lg">🚫</div>
        <div>
          <p className="font-semibold text-red-200 text-sm">Navegador integrado</p>
          <p className="text-xs text-red-400/80">{source} no permite notificaciones. Abrí el enlace en Safari.</p>
        </div>
      </div>
      <ol className="text-xs text-red-200/80 space-y-2 ml-4 list-decimal leading-relaxed">
        <li>Tocá <strong className="text-red-100">⋯</strong> (menú)</li>
        <li>Seleccioná <strong className="text-red-100">Abrir en Safari</strong></li>
      </ol>
      <div className="flex gap-2 mt-4">
        <button onClick={copyLink}
          className="flex-1 py-2.5 rounded-xl border border-red-700/50 bg-red-500/10 text-red-200 font-medium text-sm hover:bg-red-500/20 transition-colors">
          {copied ? "✓ Copiado" : "Copiar enlace"}
        </button>
      </div>
    </div>
  )
}

function SafariIOSGuide() {
  return (
    <div className="rounded-2xl border border-blue-800/50 bg-blue-950/30 p-6 text-left animate-scale-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg">📲</div>
        <div>
          <p className="font-semibold text-blue-200 text-sm">Instalar en pantalla principal</p>
          <p className="text-xs text-blue-400/80">iPhone/iPad requiere instalar la app para recibir notificaciones</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0">1</div>
          <p className="text-sm text-blue-200">Tocá <strong className="text-blue-100">Compartir</strong> en la barra inferior de Safari</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0">2</div>
          <p className="text-sm text-blue-200">Seleccioná <strong className="text-blue-100">Agregar a pantalla de inicio</strong></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0">3</div>
          <p className="text-sm text-blue-200">Tocá <strong className="text-blue-100">Agregar</strong></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0">4</div>
          <p className="text-sm text-blue-200">Abrí la app desde el nuevo ícono y <strong className="text-blue-100">activá notificaciones</strong></p>
        </div>
      </div>
    </div>
  )
}

export function PWAInstallGuide() {
  const device = useDeviceDetection()

  if (device.isStandalone) return null

  if (device.isWebView) return <WebViewGuide device={device} />
  if (device.isChromeIOS || device.isEdgeIOS || device.isFirefoxIOS) return <ChromeIOSGuide />
  if (device.isSafariIOS && !device.isStandalone) return <SafariIOSGuide />

  return null
}
