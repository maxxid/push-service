"use client"
import { useEffect, useState } from "react"; import Link from "next/link"; import { useRouter } from "next/navigation"; import { toast } from "@/lib/toast"
type T = { id: string; name: string; description: string | null; pushMessage: string; landingTitle: string; actionType: string; priority: string; company?: { name: string } }
export default function TemplatesPage() {
  const [items, setItems] = useState<T[]>([]); const [loading, setLoading] = useState(true); const [al, setAl] = useState<string | null>(null); const router = useRouter()
  const ft = () => { fetch("/api/templates").then(r => r.json()).then((d: any[]) => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false)) }
  useEffect(() => { ft() }, [])
  const hu = async (t: T) => { setAl(`use-${t.id}`); const res = await fetch(`/api/templates/${t.id}/use`, { method: "POST" }); setAl(null); if (res.ok) { toast.success("Creada desde plantilla"); const { campaign } = await res.json(); router.push(`/admin/campaigns/${campaign.id}`) } }
  const hdup = async (t: T) => { setAl(`dup-${t.id}`); await fetch("/api/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `${t.name} (copia)`, description: t.description, pushMessage: t.pushMessage, landingTitle: t.landingTitle, actionType: t.actionType, priority: t.priority, companyId: null }) }); setAl(null); toast.success("Duplicada"); ft() }
  const hd = async (id: string) => { if (!confirm("¿Eliminar?")) return; setAl(`del-${id}`); await fetch(`/api/templates/${id}`, { method: "DELETE" }); setAl(null); toast.success("Eliminada"); ft() }
  if (loading) return <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-slate-800 rounded-2xl" />)}</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-white">Plantillas</h1><Link href="/admin/templates/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl">✚ Nueva</Link></div>
      {items.length === 0 ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"><p className="text-slate-400 mb-3">No hay plantillas</p><Link href="/admin/templates/new" className="text-blue-400 text-sm">Crear la primera →</Link></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{items.map(t => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700">
            <div className="flex items-start justify-between mb-2"><div><h3 className="font-semibold text-white">{t.name}</h3>{t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}</div>{t.priority === "URGENTE" && <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">Urgente</span>}</div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-2">{t.pushMessage}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => hu(t)} disabled={!!al} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50">{al === `use-${t.id}` ? "Creando..." : "Usar"}</button>
              <Link href={`/admin/templates/${t.id}`} className="text-sm text-blue-400 hover:text-blue-300">Editar</Link>
              <button onClick={() => hdup(t)} disabled={al === `dup-${t.id}`} className="text-sm text-slate-400 hover:text-white disabled:opacity-50">{al === `dup-${t.id}` ? "..." : "Duplicar"}</button>
              <button onClick={() => hd(t.id)} disabled={al === `del-${t.id}`} className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50">{al === `del-${t.id}` ? "..." : "Eliminar"}</button>
            </div>
          </div>))}</div>
      )}
    </div>
  )
}
