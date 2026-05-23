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
  const companyId = session?.user?.companyId as string | undefined

  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#1a56db")
  const [secondaryColor, setSecondaryColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#1a1a1a")
  const [portalTitle, setPortalTitle] = useState("")
  const [portalDescription, setPortalDescription] = useState("")
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  useEffect(() => {
    if (!companyId && role !== "SUPERADMIN") { setLoading(false); return }

    const fetchCompany = role === "SUPERADMIN"
      ? fetch("/api/companies").then(r => r.json()).then((d: any[]) => d?.[0])
      : fetch("/api/companies").then(r => r.json()).then((d: any[]) => Array.isArray(d) ? d[0] : null)

    fetchCompany.then((myCompany) => {
      if (myCompany) {
        setName(myCompany.name || "")
        setLogo(myCompany.logo || "")
        setPrimaryColor(myCompany.primaryColor || "#1a56db")
        setSecondaryColor(myCompany.secondaryColor || "#ffffff")
        setTextColor(myCompany.textColor || "#1a1a1a")
        setPortalTitle(myCompany.portalTitle || "")
        setPortalDescription(myCompany.portalDescription || "")
        setActiveModules(myCompany.modules || [])
        setSelectedCompanyId(myCompany.id)
      }
    }).finally(() => setLoading(false))
  }, [companyId, role])

  const toggleModule = (key: string) => {
    setActiveModules((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const handleSave = async () => {
    const targetId = role === "SUPERADMIN" ? selectedCompanyId : companyId
    if (!targetId) return

    await fetch(`/api/companies/${targetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, logo: logo || null, primaryColor, secondaryColor,
        textColor, portalTitle: portalTitle || null, portalDescription: portalDescription || null,
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
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Branding y ajustes</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-600">Identidad</h2>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre institucional</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">URL del logo / ícono</label>
            <input type="url" value={logo} onChange={(e) => setLogo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Color principal</label>
              <div className="flex gap-1 items-center">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer" />
                <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Color secundario</label>
              <div className="flex gap-1 items-center">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer" />
                <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Color de texto</label>
              <div className="flex gap-1 items-center">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer" />
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-600">Textos del portal</h2>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Título principal (dejar vacío para default)
            </label>
            <input type="text" value={portalTitle} onChange={(e) => setPortalTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Recibí avisos importantes de..." />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Descripción
            </label>
            <textarea value={portalDescription} onChange={(e) => setPortalDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2}
              placeholder="Activá las notificaciones para estar al día..." />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-600">Módulos activos</h2>
          <p className="text-xs text-zinc-500">Activá los módulos que querés mostrar en el portal.</p>

          <div className="space-y-2">
            {availableModules.map((mod) => (
              <label key={mod.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 hover:border-blue-200 cursor-pointer transition-colors">
                <input type="checkbox" checked={activeModules.includes(mod.key)}
                  onChange={() => toggleModule(mod.key)} className="mt-0.5 rounded" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">{mod.label}</p>
                  <p className="text-xs text-zinc-500">{mod.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <p className="text-xs font-medium text-zinc-500 mb-2">Vista previa del header</p>
          <div className="rounded-lg p-4 flex items-center gap-3" style={{ backgroundColor: primaryColor, color: secondaryColor }}>
            {logo && <img src={logo} alt="" className="w-8 h-8 rounded object-contain bg-white p-1" />}
            <span className="font-bold">{name || "Nombre"}</span>
          </div>
        </div>

        {saved && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Cambios guardados</p>}

        <Button onClick={handleSave}>Guardar cambios</Button>
      </div>
    </div>
  )
}
