"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

const availableModules = [
  { key: "documentos", label: "Documentación", desc: "Compartir PDFs, resoluciones, estatutos" },
  { key: "contacto", label: "Contacto rápido", desc: "Botones WhatsApp, llamar, email" },
  { key: "formularios", label: "Formularios", desc: "Confirmar asistencia, inscripciones" },
  { key: "agenda", label: "Agenda / Eventos", desc: "Asambleas, reuniones, capacitaciones" },
]

export default function BrandingPage() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const companyId = (session?.user as any)?.companyId

  const [primaryColor, setPrimaryColor] = useState("#1a56db")
  const [secondaryColor, setSecondaryColor] = useState("#ffffff")
  const [logo, setLogo] = useState("")
  const [name, setName] = useState("")
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!companyId && role !== "SUPERADMIN") return
    fetch("/api/companies")
      .then((r) => r.json())
      .then((companies) => {
        const myCompany = Array.isArray(companies) && companies.length > 0 ? companies[0] : null
        if (myCompany) {
          setName(myCompany.name)
          setLogo(myCompany.logo || "")
          setPrimaryColor(myCompany.primaryColor || "#1a56db")
          setSecondaryColor(myCompany.secondaryColor || "#ffffff")
          setActiveModules(myCompany.modules || [])
        }
      })
      .finally(() => setLoading(false))
  }, [companyId, role])

  const toggleModule = (key: string) => {
    setActiveModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSaveBranding = async () => {
    if (!companyId) return

    await fetch(`/api/companies/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        logo: logo || null,
        primaryColor,
        secondaryColor,
      }),
    })

    await fetch("/api/company/modules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modules: activeModules }),
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Branding y módulos</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-600">Apariencia</h2>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nombre institucional
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              URL del logo
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Color principal
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Color secundario
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-600">
            Módulos activos
          </h2>
          <p className="text-xs text-zinc-400">
            Activá los módulos que querés mostrar en el portal de tus afiliados.
          </p>

          <div className="space-y-2">
            {availableModules.map((mod) => (
              <label
                key={mod.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 hover:border-blue-200 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={activeModules.includes(mod.key)}
                  onChange={() => toggleModule(mod.key)}
                  className="mt-0.5 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {mod.label}
                  </p>
                  <p className="text-xs text-zinc-400">{mod.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {saved && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            Cambios guardados
          </p>
        )}

        <Button onClick={handleSaveBranding}>Guardar cambios</Button>
      </div>
    </div>
  )
}
