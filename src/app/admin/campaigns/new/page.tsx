"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

type Segment = { id: string; name: string; companyId: string }
type Company = { id: string; name: string }
type LandingPage = { id: string; title: string; slug: string; companyId: string }

const actionTypes = [
  { value: "LANDING_INTERNA", label: "Landing interna" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "URL_EXTERNA", label: "URL externa" },
  { value: "PDF", label: "Descargar PDF" },
  { value: "MAPS", label: "Google Maps" },
  { value: "LLAMAR", label: "Llamar" },
  { value: "FORMULARIO", label: "Formulario" },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const userData = session?.user as Record<string, unknown> | undefined
  const role = userData?.role as string
  const userCompanyId = userData?.companyId as string | undefined

  const [title, setTitle] = useState("")
  const [pushMessage, setPushMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [actionType, setActionType] = useState("LANDING_INTERNA")
  const [actionValue, setActionValue] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [segmentId, setSegmentId] = useState("")
  const [companyId, setCompanyId] = useState(userCompanyId || "")
  const [landingPageId, setLandingPageId] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [sendNow, setSendNow] = useState(true)

  const [segments, setSegments] = useState<Segment[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/segments").then((r) => r.json()).then((d) => setSegments(Array.isArray(d) ? d : []))
    fetch("/api/landing-pages").then((r) => r.json()).then((d) => setLandingPages(Array.isArray(d) ? d : []))
    if (role === "SUPERADMIN") {
      fetch("/api/companies").then((r) => r.json()).then(setCompanies)
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const campaignBody = {
      title,
      pushMessage,
      imageUrl: imageUrl || undefined,
      actionType,
      actionValue: actionValue || undefined,
      landingPageId: landingPageId || undefined,
      priority,
      segmentId: segmentId || undefined,
      companyId: role === "SUPERADMIN" ? companyId : undefined,
      scheduledAt: sendNow ? undefined : scheduledAt ? `${scheduledAt}:00-03:00` : undefined,
    }

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaignBody),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al crear campaña")
      setLoading(false)
      return
    }

    const campaign = await res.json()

    if (sendNow) {
      const sendRes = await fetch(`/api/campaigns/${campaign.id}/send`, {
        method: "POST",
      })

      if (!sendRes.ok) {
        const data = await sendRes.json()
        setError(data.error || "Campaña creada pero error al enviar")
        setLoading(false)
        return
      }
    }

    router.push("/admin/campaigns")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Nueva campaña</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white rounded-xl border border-zinc-200 p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Título de la campaña
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Comunicado importante"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Prioridad
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Mensaje push
          </label>
          <textarea
            value={pushMessage}
            onChange={(e) => setPushMessage(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Mensaje que verán los suscriptores en la notificación..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            URL de imagen (opcional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Segmento
            </label>
            <select
              value={segmentId}
              onChange={(e) => setSegmentId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los suscriptores</option>
              {segments
                .filter(
                  (s) => role === "SUPERADMIN" || s.companyId === userCompanyId
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          {role === "SUPERADMIN" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Empresa
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Tipo de acción al tocar
            </label>
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value)
                setActionValue("")
              }}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {actionTypes.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {(actionType === "WHATSAPP" ||
            actionType === "URL_EXTERNA" ||
            actionType === "MAPS" ||
            actionType === "LLAMAR") && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                {actionType === "WHATSAPP"
                  ? "Número de WhatsApp"
                  : actionType === "MAPS"
                  ? "Dirección"
                  : actionType === "LLAMAR"
                  ? "Número de teléfono"
                  : "URL"}
              </label>
              <input
                type="text"
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  actionType === "WHATSAPP"
                    ? "5493884123456"
                    : actionType === "LLAMAR"
                    ? "+543884123456"
                    : actionType === "MAPS"
                    ? "San Salvador de Jujuy"
                    : "https://..."
                }
              />
            </div>
          )}

          {(actionType === "LANDING_INTERNA" ||
            actionType === "FORMULARIO") && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Landing page de destino
              </label>
              <select
                value={landingPageId}
                onChange={(e) => setLandingPageId(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguna (sin landing)</option>
                {landingPages.map((lp) => (
                  <option key={lp.id} value={lp.id}>
                    {lp.title} ({lp.slug})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={sendNow}
              onChange={(e) => setSendNow(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-zinc-700">Enviar ahora</span>
          </label>

          {!sendNow && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Programar para <span className="text-xs text-zinc-400">(UTC-3, Buenos Aires)</span>
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Enviando..."
              : sendNow
              ? "Crear y enviar"
              : "Crear campaña"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
