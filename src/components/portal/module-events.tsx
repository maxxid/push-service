"use client"

import { useEffect, useState } from "react"

type Event = {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
}

export function EventsModule() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (events.length === 0) return null

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold text-zinc-900 mb-4">📅 Agenda</h2>
      <div className="space-y-3">
        {events.slice(0, 4).map((event) => {
          const d = new Date(event.date)
          return (
            <div
              key={event.id}
              className="bg-zinc-50 rounded-xl p-4 flex items-start gap-4"
            >
              <div className="text-center min-w-[50px] bg-white rounded-lg p-2 border border-zinc-200">
                <p className="text-lg font-bold text-zinc-900">{d.getDate()}</p>
                <p className="text-[10px] text-zinc-500 uppercase">
                  {d.toLocaleDateString("es-AR", { month: "short" })}
                </p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 text-sm">
                  {event.title}
                </p>
                {event.location && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    📍 {event.location}
                  </p>
                )}
                <p className="text-xs text-zinc-400 mt-0.5">
                  {d.toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
