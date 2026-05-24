"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"

const availableModules = [
  { key: "documentos", label: "Documentación", desc: "Compartir PDFs, resoluciones, estatutos" },
  { key: "contacto", label: "Contacto rápido", desc: "Botones WhatsApp, llamar, email" },
  { key: "agenda", label: "Agenda / Eventos", desc: "Asambleas, reuniones, capacitaciones" },
]

function getContrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff"
}

export default function BrandingPage() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const companyId = session?.user?.companyId as string | undefined

  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#1a56db")
  const [headerTitle, setHeaderTitle] = useState("")
  const [portalTitle, setPortalTitle] = useState("")
  const [portalDescription, setPortalDescription] = useState("")
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [previewDark, setPreviewDark] = useState(false)

  useEffect(() => {
    if (!companyId && role !== "SUPERADMIN") { setLoading(false); return }
    fetch("/api/companies").then(r => r.json()).then((d: any[]) => {
      const c = Array.isArray(d) ? d[0] : null
      if (c) {
        setName(c.name || ""); setLogo(c.logo || "")
        setPrimaryColor(c.primaryColor || "#1a56db")
        setHeaderTitle(c.headerTitle || "")
        setPortalTitle(c.portalTitle || "")
        setPortalDescription(c.portalDescription || "")
        setActiveModules(c.modules || [])
        setSelectedCompanyId(c.id)
      }
    }).finally(() => setLoading(false))
  }, [companyId, role])

  const toggleModule = (key: string) => {
    setActiveModules(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])
  }

  const handleSave = async () => {
    const targetId = role === "SUPERADMIN" ? selectedCompanyId : companyId
    if (!targetId) return; setSaving(true)
    try {
      await fetch(`/api/companies/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo: logo || null, primaryColor, headerTitle: headerTitle || null, portalTitle: portalTitle || null, portalDescription: portalDescription || null }),
      })
      await fetch("/api/company/modules", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ modules: activeModules }) })
      toast.success("Cambios guardados")
    } catch { toast.error("Error al guardar") }
    finally { setSaving(false) }
  }

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  const textOnPrimary = getContrastColor(primaryColor)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Branding</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Color */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Color de marca</h2>
            <p className="text-xs text-slate-400">Elegí un solo color. El sistema deriva automáticamente texto, fondos y acentos.</p>
            <div className="flex items-center gap-4">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-14 h-14 rounded-xl border-2 border-zinc-200 cursor-pointer" />
              <div>
                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  className="w-32 px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex gap-2 mt-2">
                  {["#1a56db", "#059669", "#dc2626", "#7c3aed", "#d97706", "#db2777"].map(c => (
                    <button key={c} onClick={() => setPrimaryColor(c)}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: c, borderColor: primaryColor === c ? "#000" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Identidad</h2>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nombre institucional</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Título del header (vacío = "Notificaciones Nombre")</label>
              <input type="text" value={headerTitle} onChange={e => setHeaderTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Notificaciones Cámara del Tabaco" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Logo / ícono</label>
              <div className="flex gap-2 items-center">
                <input type="url" value={logo} onChange={e => setLogo(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://... o subir" />
                <label className="text-xs px-3 py-2 rounded-lg border cursor-pointer hover:bg-zinc-50 font-medium text-slate-300 shrink-0">
                  Subir
                  <input type="file" className="hidden" accept="image/*" onChange={async e => {
                    const f = e.target.files?.[0]; if (!f) return
                    const fd = new FormData(); fd.append("file", f); fd.append("name", `logo-${Date.now()}.${f.name.split(".").pop()}`)
                    const res = await fetch("/api/upload", { method: "POST", body: fd })
                    if (res.ok) { const b = await res.json(); setLogo(b.url); toast.success("Logo subido") }
                    else toast.error("Error al subir")
                  }} />
                </label>
              </div>
              {logo && <img src={logo} alt="" className="h-10 w-10 rounded-xl object-contain bg-white border mt-2" />}
            </div>
          </div>

          {/* Portal texts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Texto del portal</h2>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Título principal</label>
              <input type="text" value={portalTitle} onChange={e => setPortalTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Recibí avisos importantes de..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Descripción</label>
              <textarea value={portalDescription} onChange={e => setPortalDescription(e.target.value)} rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Activá las notificaciones para estar al día..." />
            </div>
          </div>

          {/* Modules */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Módulos activos</h2>
            <div className="space-y-2">
              {availableModules.map(mod => (
                <label key={mod.key} className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 hover:border-blue-200 cursor-pointer transition-colors">
                  <input type="checkbox" checked={activeModules.includes(mod.key)} onChange={() => toggleModule(mod.key)} className="mt-0.5 rounded" />
                  <div><p className="text-sm font-medium text-white">{mod.label}</p><p className="text-xs text-slate-400">{mod.desc}</p></div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="xl:sticky xl:top-24 space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">Vista previa</h2>
            <button onClick={() => setPreviewDark(!previewDark)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${previewDark ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-slate-300 border-zinc-200"}`}>
              {previewDark ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>

          <div className={`rounded-2xl overflow-hidden border shadow-xl transition-colors ${previewDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`}>
            {/* Mock header */}
            <div className="h-14 flex items-center px-4 gap-3 border-b" style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor + "30"
            }}>
              {logo ? (
                <img src={logo} alt="" className="h-7 w-7 rounded-lg object-contain bg-white p-0.5" />
              ) : (
                <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: textOnPrimary + "20" }}>
                  {(name || "P").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-sm" style={{ color: textOnPrimary }}>
                {headerTitle || (name ? `Notificaciones ${name}` : "Notificaciones")}
              </span>
              <div className="flex-1" />
              <div className="h-4 w-4 rounded-full border opacity-50" style={{ borderColor: textOnPrimary }} />
            </div>

            {/* Mock content */}
            <div className="p-6 space-y-4 text-center" style={{ backgroundColor: previewDark ? "#0a0a0b" : "#ffffff" }}>
              {logo && (
                <div className="inline-block p-3 rounded-2xl shadow-lg mb-2" style={{ backgroundColor: previewDark ? "#18181b" : "#fff" }}>
                  <img src={logo} alt="" className="h-10 w-10 object-contain" />
                </div>
              )}
              {!logo && (
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-2xl text-white font-bold text-lg shadow-lg mx-auto"
                  style={{ backgroundColor: primaryColor }}>
                  {(name || "P").charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-xl font-extrabold" style={{ color: previewDark ? "#fafafa" : "#1a1a1a" }}>
                {portalTitle || `Recibí avisos de ${name || "la institución"}`}
              </h3>
              <p style={{ color: previewDark ? "#a1a1aa" : "#6b7280", fontSize: 14, maxWidth: 320, margin: "0 auto" }}>
                {portalDescription || "Activá las notificaciones para estar al día con comunicados, alertas y novedades."}
              </p>

              {/* Mock button */}
              <button className="px-8 py-3 rounded-2xl font-semibold text-white text-sm shadow-lg" style={{ backgroundColor: primaryColor }}>
                🔔 Activar notificaciones
              </button>

              {/* Feature cards */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {["📢 Comunicados", "⚡ Alertas", "📄 Docs"].map(t => (
                  <div key={t} className="rounded-xl p-3 text-xs" style={{ backgroundColor: previewDark ? "#18181b" : "#f9fafb", color: previewDark ? "#a1a1aa" : "#6b7280" }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
