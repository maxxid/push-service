"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Company = { id: string; name: string }

export function CompanySwitcher() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selected, setSelected] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setCompanies(d)
      })
    const match = document.cookie.match(/selected-company-id=([^;]+)/)
    if (match) setSelected(match[1])
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelected(id)
    if (id) {
      document.cookie = `selected-company-id=${id};path=/;max-age=86400;samesite=lax`
    } else {
      document.cookie = "selected-company-id=;path=/;max-age=0"
    }
    router.refresh()
  }

  return (
    <div className="px-4 py-2">
      <select
        value={selected}
        onChange={handleChange}
        className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
      >
        <option value="">Todas las empresas</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
