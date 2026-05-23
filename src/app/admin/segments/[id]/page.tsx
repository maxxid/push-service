"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type SubscriberInfo = {
  subscriber: {
    id: string
    onesignalId: string
    subscribedAt: string
    active: boolean
    deviceInfo: unknown
  }
}

type SegmentDetail = {
  id: string
  name: string
  companyId: string
  subscribers: SubscriberInfo[]
  _count: { campaigns: number }
}

type AvailableSubscriber = {
  id: string
  onesignalId: string
  subscribedAt: string
  active: boolean
}

export default function SegmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [segment, setSegment] = useState<SegmentDetail | null>(null)
  const [availableSubscribers, setAvailableSubscribers] = useState<
    AvailableSubscriber[]
  >([])
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const fetchSegment = () => {
    fetch(`/api/segments/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setSegment(data)
        setNewName(data.name)
      })
      .finally(() => setLoading(false))
  }

  const fetchAvailable = () => {
    fetch(`/api/subscribers`)
      .then((r) => r.json())
      .then((data) => {
        if (segment) {
          const existingIds = new Set(
            segment.subscribers.map((s) => s.subscriber.id)
          )
          setAvailableSubscribers(
            data.filter((s: AvailableSubscriber) => !existingIds.has(s.id))
          )
        }
      })
  }

  useEffect(() => {
    fetchSegment()
  }, [params.id])

  useEffect(() => {
    if (segment) fetchAvailable()
  }, [segment])

  const handleRename = async () => {
    if (!newName.trim()) return

    await fetch(`/api/segments/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })

    setEditingName(false)
    fetchSegment()
  }

  const handleAddSubscribers = async () => {
    if (selectedIds.size === 0) return

    await fetch(`/api/segments/${params.id}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriberIds: Array.from(selectedIds),
      }),
    })

    setSelectedIds(new Set())
    fetchSegment()
  }

  const handleRemoveSubscriber = async (subscriberId: string) => {
    await fetch(`/api/segments/${params.id}/subscribers`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriberIds: [subscriberId] }),
    })

    fetchSegment()
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  if (loading) {
    return <p className="text-zinc-500">Cargando...</p>
  }

  if (!segment) {
    return <p className="text-red-600">Segmento no encontrado</p>
  }

  const deviceLabel = (info: unknown) => {
    const d = info as Record<string, string> | null
    if (!d) return "Desconocido"
    const ua = d.userAgent || ""
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
    if (ua.includes("Android")) return "Android"
    if (ua.includes("Windows")) return "Windows"
    return "Web"
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/segments")}
          className="text-zinc-400 hover:text-zinc-600"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-zinc-900">
          {editingName ? (
            <span className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-2 py-1 border border-zinc-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
              <Button size="sm" onClick={handleRename}>
                Guardar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingName(false)}
              >
                Cancelar
              </Button>
            </span>
          ) : (
            <span
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setEditingName(true)}
              title="Click para renombrar"
            >
              {segment.name}
            </span>
          )}
        </h1>
        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
          {segment.subscribers.length} suscriptores
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-600 mb-3">
            Suscriptores en este segmento
          </h2>

          {segment.subscribers.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No hay suscriptores en este segmento
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Agregalos desde la lista de la derecha
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {segment.subscribers.map(({ subscriber: sub }) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-lg border border-zinc-200 p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">
                      {sub.onesignalId.slice(0, 16)}...
                    </p>
                    <p className="text-xs text-zinc-400">
                      {deviceLabel(sub.deviceInfo)} ·{" "}
                      {new Date(sub.subscribedAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.active ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveSubscriber(sub.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Quitar del segmento"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-600">
              Agregar suscriptores
            </h2>
            {selectedIds.size > 0 && (
              <Button size="sm" onClick={handleAddSubscribers}>
                Agregar {selectedIds.size} seleccionado
                {selectedIds.size > 1 ? "s" : ""}
              </Button>
            )}
          </div>

          {availableSubscribers.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No hay suscriptores disponibles
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableSubscribers
                .filter((s) => s.active)
                .map((sub) => (
                  <label
                    key={sub.id}
                    className={`flex items-center gap-3 bg-white rounded-lg border p-3 cursor-pointer hover:border-blue-300 transition-colors ${
                      selectedIds.has(sub.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-zinc-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                      className="rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {sub.onesignalId.slice(0, 20)}...
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(sub.subscribedAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
