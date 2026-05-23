"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type Event = {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  company?: { name: string }
  createdAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [showForm, setShowForm] = useState(false)

  const fetchEvents = () => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        date,
        description: description || undefined,
        location: location || undefined,
      }),
    })
    if (res.ok) {
      setTitle("")
      setDate("")
      setDescription("")
      setLocation("")
      setShowForm(false)
      fetchEvents()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este evento?")) return
    await fetch(`/api/events/${id}`, { method: "DELETE" })
    fetchEvents()
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  if (loading) return <p className="text-zinc-500">Cargando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Agenda / Eventos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Nuevo evento"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-zinc-200 p-6 mb-6 space-y-3 max-w-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Asamblea general"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Fecha y hora
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Ubicación (opcional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Salón principal - San Salvador de Jujuy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Detalles adicionales..."
            />
          </div>
          <Button type="submit" size="sm">
            Agregar
          </Button>
        </form>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500">No hay eventos programados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const eventDate = new Date(event.date)
            const isPast = eventDate < new Date()
            return (
              <div
                key={event.id}
                className={`bg-white rounded-xl border p-4 flex items-start justify-between hover:border-blue-200 transition-colors ${
                  isPast ? "opacity-60" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-2xl font-bold text-zinc-900">
                      {eventDate.getDate()}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {eventDate
                        .toLocaleDateString("es-AR", { month: "short" })
                        .toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        📍 {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm text-zinc-600 mt-1">
                        {event.description}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 mt-1">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-400 hover:text-red-600 text-sm ml-3"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
