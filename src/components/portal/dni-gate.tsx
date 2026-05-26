"use client"

import { useState, useEffect } from "react"

type Props = {
  companyId: string
  companyName: string
  primaryColor: string
  onVerified: (dni: string) => void
}

export function DniGate({ companyId, companyName, primaryColor, onVerified }: Props) {
  const [dni, setDni] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<"red" | "amber" | "green" | "">("")
  const [nombre, setNombre] = useState("")
  const [onesignalId, setOnesignalId] = useState("")

  useEffect(() => {
    const poll = () => {
      if (typeof window !== "undefined" && "OneSignal" in window) {
        const OneSignal = (window as any).OneSignal
        OneSignal.User?.PushSubscription?.id?.then((id: string) => {
          if (id) setOnesignalId(id)
        })
        return
      }
      setTimeout(poll, 500)
    }
    poll()
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni) return
    setLoading(true); setError(""); setErrorType("")

    const res = await fetch("/api/dni/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni, companyId, onesignalId: onesignalId || undefined }),
    })

    const data = await res.json()

    if (data.status === "available") {
      setNombre(`${data.nombre} ${data.apellido}`)
      setErrorType("green")
      setError(data.detail)
      setLoading(false)
      onVerified(data.dni)
      return
    }

    if (data.status === "same_device") {
      setNombre(`${data.nombre} ${data.apellido}`)
      setErrorType("green")
      setError(data.detail)
      setLoading(false)
      return
    }

    if (data.status === "other_device") {
      setNombre(`${data.nombre} ${data.apellido}`)
      setErrorType("amber")
      setError(data.detail)
      setLoading(false)
      return
    }

    // not found
    setErrorType("red")
    setError(data.detail || "DNI no autorizado")
    setLoading(false)
  }

  const formatDni = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  }

  const statusColors = {
    green: "border-emerald-900/50 bg-emerald-950/30 text-emerald-400",
    amber: "border-amber-900/50 bg-amber-950/30 text-amber-400",
    red: "border-red-900/50 bg-red-950/30 text-red-400",
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm animate-scale-in">
        <div className="h-14 w-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
          🔒
        </div>

        <h3 className="font-bold text-xl text-white text-center mb-1">Verificación de afiliado</h3>
        <p className="text-sm text-slate-400 text-center mb-6">
          {nombre
            ? `¡Hola ${nombre}!`
            : `Ingresá tu DNI para recibir notificaciones de ${companyName}`}
        </p>

        {!nombre ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text" inputMode="numeric" value={dni}
              onChange={e => setDni(formatDni(e.target.value))}
              placeholder="12.345.678" maxLength={10}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-center text-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
            />
            {errorType && (
              <div className={`rounded-xl border p-3 text-xs text-center ${statusColors[errorType]}`}>{error}</div>
            )}
            <button type="submit" disabled={loading || dni.length < 8}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
              style={{ backgroundColor: primaryColor }}>
              {loading ? "Verificando..." : "Verificar DNI"}
            </button>
          </form>
        ) : errorType === "green" && error ? (
          <div className={`rounded-xl border p-4 text-sm text-center ${statusColors.green}`}>{error}</div>
        ) : null}

        <p className="text-xs text-slate-500 text-center mt-4">Solo para afiliados de {companyName}</p>
      </div>
    </div>
  )
}
