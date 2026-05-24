"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"
import { NotificationPreview } from "@/components/admin/notification-preview"
import { LandingMobilePreview } from "@/components/admin/landing-mobile-preview"

type CampaignDetail = {
  id: string
  title: string
  pushMessage: string
  imageUrl: string | null
  status: string
  priority: string
  actionType: string
  actionValue: string | null
  deliveries: number
  clicks: number
  scheduledAt: string | null
  sentAt: string | null
  segment?: { id: string; name: string }
  landingPage?: { id: string; title: string; slug: string }
  company?: { name: string }
  createdAt: string
}

const statusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  SCHEDULED: "Programada",
  SENT: "Enviada",
  FAILED: "Fallida",
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState("")
  const [sendSuccess, setSendSuccess] = useState("")

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}`)
      .then((r) => r.json())
      .then(setCampaign)
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSaveAsTemplate = async () => {
    const res = await fetch(`/api/campaigns/${params.id}`)
    const c = await res.json()

    let content = []
    if (c.landingPageId) {
      const lRes = await fetch(`/api/landing-pages/${c.landingPageId}`)
      const l = await lRes.json()
      content = l.content || []
    }

    const tres = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: c.title,
        pushMessage: c.pushMessage,
        landingTitle: c.landingPage?.title || c.title,
        landingContent: content,
        actionType: c.actionType,
        actionValue: c.actionValue,
        priority: c.priority,
        companyId: null,
      }),
    })

    if (tres.ok) {
      toast.success("Guardada como plantilla")
    } else {
      toast.error("Error al guardar plantilla")
    }
  }

  const handleSend = async () => {
    if (!confirm("¿Enviar esta campaña ahora?")) return
    setSending(true)
    setSendError("")
    setSendSuccess("")

    const res = await fetch(`/api/campaigns/${params.id}/send`, {
      method: "POST",
    })

    const data = await res.json()

    if (!res.ok) {
      setSendError(data.error || "Error al enviar")
      setSending(false)
      return
    }

    setSendSuccess(`Enviada a ${data.sent} suscriptores`)
    toast.success(`Campaña enviada a ${data.sent} suscriptores`)
    setCampaign((prev) =>
      prev ? { ...prev, status: "SENT", deliveries: data.sent } : prev
    )
    setSending(false)
  }

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  if (!campaign) {
    return <p className="text-red-600">Campaña no encontrada</p>
  }

  const ctr =
    campaign.deliveries > 0
      ? ((campaign.clicks / campaign.deliveries) * 100).toFixed(1)
      : "0"

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/campaigns")}
          className="text-zinc-500 hover:text-zinc-600"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-zinc-900">{campaign.title}</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            {
              DRAFT: "bg-zinc-100 text-zinc-600",
              SCHEDULED: "bg-amber-100 text-amber-700",
              SENT: "bg-green-100 text-green-700",
              FAILED: "bg-red-100 text-red-700",
            }[campaign.status] || "bg-zinc-100"
          }`}
        >
          {statusLabels[campaign.status] || campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-600">Contenido</h2>
              <div className="flex gap-3">
                <NotificationPreview
                  title={campaign.title}
                  message={campaign.pushMessage}
                  imageUrl={campaign.imageUrl}
                  priority={campaign.priority}
                />
                {campaign.landingPage && (
                  <LandingMobilePreview slug={campaign.landingPage.slug} />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Mensaje push</p>
                <p className="text-sm text-zinc-900 bg-zinc-50 rounded-lg p-3 break-words whitespace-pre-wrap">
                  {campaign.pushMessage}
                </p>
              </div>

              {campaign.imageUrl && (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Imagen</p>
                  <img
                    src={campaign.imageUrl}
                    alt=""
                    className="max-w-xs rounded-lg border border-zinc-200"
                  />
                </div>
              )}

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-xs text-zinc-500">Prioridad: </span>
                  <span
                    className={
                      campaign.priority === "URGENTE"
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {campaign.priority === "URGENTE" ? "Urgente" : "Normal"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Acción al tocar: </span>
                  <span className="text-zinc-700">{campaign.actionType}</span>
                  {campaign.actionValue && (
                    <code className="text-xs bg-zinc-100 px-1 ml-1 rounded">
                      {campaign.actionValue}
                    </code>
                  )}
                </div>
              </div>
            </div>
          </div>

          {(campaign.status === "DRAFT" ||
            campaign.status === "SCHEDULED") && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-sm font-semibold text-zinc-600 mb-3">
                Acciones
              </h2>

              {sendError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">
                  {sendError}
                </p>
              )}
              {sendSuccess && (
                <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-3">
                  {sendSuccess}
                </p>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSend} disabled={sending}>
                  {sending ? "Enviando..." : "Enviar ahora"}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/admin/campaigns/${params.id}/edit`)}>
                  Editar
                </Button>
                <Button variant="outline" onClick={handleSaveAsTemplate}>
                  Guardar como plantilla
                </Button>
              </div>
            </div>
          )}

          {campaign.status === "SENT" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-sm font-semibold text-zinc-600 mb-3">
                Resultados
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-900">
                    {campaign.deliveries}
                  </p>
                  <p className="text-xs text-zinc-500">Entregas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-900">
                    {campaign.clicks}
                  </p>
                  <p className="text-xs text-zinc-500">Clics</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-900">{ctr}%</p>
                  <p className="text-xs text-zinc-500">CTR</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <h3 className="text-sm font-semibold text-zinc-600 mb-3">
              Detalles
            </h3>
            <dl className="space-y-2 text-sm">
              {campaign.company && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Empresa</dt>
                  <dd className="text-zinc-900">{campaign.company.name}</dd>
                </div>
              )}
              {campaign.segment && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Segmento</dt>
                  <dd>
                    <a href={`/admin/segments/${campaign.segment.id}`} className="text-blue-600 hover:text-blue-800">
                      {campaign.segment.name}
                    </a>
                  </dd>
                </div>
              )}
              {campaign.landingPage && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Landing</dt>
                  <dd>
                    <a href={`/admin/landing-pages/${campaign.landingPage.id}`} className="text-blue-600 hover:text-blue-800">
                      {campaign.landingPage.title}
                    </a>
                  </dd>
                </div>
              )}
              {campaign.scheduledAt && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Programada</dt>
                  <dd className="text-zinc-900">
                    {new Date(campaign.scheduledAt).toLocaleString("es-AR")}
                  </dd>
                </div>
              )}
              {campaign.sentAt && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Enviada</dt>
                  <dd className="text-zinc-900">
                    {new Date(campaign.sentAt).toLocaleString("es-AR")}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-zinc-500">Creada</dt>
                <dd className="text-zinc-900">
                  {new Date(campaign.createdAt).toLocaleString("es-AR")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
