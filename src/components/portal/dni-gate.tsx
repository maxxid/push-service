"use client"

import { useState } from "react"

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
  const [nombre, setNombre] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni) return
    setLoading(true); setError("")

    const res = await fetch("/api/dni/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni, companyId }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Error al verificar")
      setLoading(false)
      return
    }

    setNombre(`${data.nombre} ${data.apellido}`)
    setError("")
    setLoading(false)
    onVerified(data.dni)
  }

  const formatDni = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
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
            ? `¡Hola ${nombre}! Ahora activá tus notificaciones.`
            : `Ingresá tu DNI para recibir notificaciones de ${companyName}`}
        </p>

        {!nombre ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              value={dni}
              onChange={e => setDni(formatDni(e.target.value))}
              placeholder="12.345.678"
              maxLength={10}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-center text-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
            />
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400 text-center">{error}</div>
            )}
            <button type="submit" disabled={loading || dni.length < 8}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
              style={{ backgroundColor: primaryColor }}>
              {loading ? "Verificando..." : "Verificar DNI"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-2">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
              <p className="text-emerald-400 text-sm font-medium">✓ Identidad verificada</p>
              <p className="text-emerald-300 text-xs mt-0.5">{nombre}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 text-center mt-4">
          Solo para afiliados de {companyName}
        </p>
      </div>
    </div>
  )
}
