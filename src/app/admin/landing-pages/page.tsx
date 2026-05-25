"use client"
import { useEffect, useState } from "react"; import Link from "next/link"; import { toast } from "@/lib/toast"
type LP = { id: string; title: string; slug: string; published: boolean; views: number; shares: number; expiresAt: string | null; company?: { name: string } }
export default function LandingPagesPage() {
  const [pages, setPages] = useState<LP[]>([]); const [loading, setLoading] = useState(true); const [al, setAl] = useState<string | null>(null)
  const fp = () => { fetch("/api/landing-pages").then(r => r.json()).then((d: any[]) => setPages(Array.isArray(d) ? d : [])).finally(() => setLoading(false)) }
  useEffect(() => { fp() }, [])
  const hd = async (id: string) => { if (!confirm("¿Eliminar?")) return; setAl(`del-${id}`); await fetch(`/api/landing-pages/${id}`, { method: "DELETE" }); setAl(null); toast.success("Eliminada"); fp() }
  const hdup = async (lp: LP) => { setAl(`dup-${lp.id}`); await fetch("/api/landing-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `${lp.title} (copia)`, slug: `${lp.slug}-copia`, companyId: null }) }); setAl(null); toast.success("Duplicada"); fp() }
  const hpub = async (lp: LP) => { setAl(`pub-${lp.id}`); await fetch(`/api/landing-pages/${lp.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !lp.published }) }); setAl(null); toast.success(lp.published ? "Despublicada" : "Publicada"); fp() }
  if (loading) return <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-slate-800 rounded-2xl" />)}</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-white">Landing Pages</h1><Link href="/admin/landing-pages/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl">✚ Nueva</Link></div>
      {pages.length === 0 ? (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"><p className="text-slate-400 mb-3">No hay landings</p><Link href="/admin/landing-pages/new" className="text-blue-400 text-sm">Crear la primera →</Link></div>) : (
        <div className="space-y-2">{pages.map(lp => (
          <div key={lp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold text-white truncate">{lp.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${lp.published ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-400"}`}>{lp.published ? "Publicada" : "Borrador"}</span>
                {lp.expiresAt && new Date(lp.expiresAt) < new Date() && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Vencida</span>
                )}
                {lp.expiresAt && new Date(lp.expiresAt) > new Date() && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Vence {new Date(lp.expiresAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>
                )}
              </div>
              <p className="text-xs text-slate-500">/landing/{lp.slug}{lp.company && ` · ${lp.company.name}`}</p>
              {(lp.views > 0 || lp.shares > 0) && (
                <p className="text-[10px] text-slate-600 mt-1">👁 {lp.views} vistas · 🔗 {lp.shares} compartidos</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button onClick={() => hpub(lp)} disabled={al === `pub-${lp.id}`} className={`text-xs px-3 py-1.5 rounded-lg disabled:opacity-50 ${lp.published ? "bg-slate-800 text-slate-400" : "bg-green-500/10 text-green-400"}`}>{al === `pub-${lp.id}` ? "..." : lp.published ? "Despublicar" : "Publicar"}</button>
              <Link href={`/admin/landing-pages/${lp.id}`} className="text-sm text-blue-400 hover:text-blue-300">Editar</Link>
              <button onClick={() => hdup(lp)} disabled={al === `dup-${lp.id}`} className="text-sm text-slate-400 hover:text-white disabled:opacity-50">{al === `dup-${lp.id}` ? "..." : "Duplicar"}</button>
              <a href={`/portal/landing/${lp.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300">Ver</a>
              <button onClick={() => hd(lp.id)} disabled={al === `del-${lp.id}`} className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50">{al === `del-${lp.id}` ? "..." : "Eliminar"}</button>
            </div>
          </div>))}
        </div>
      )}
    </div>
  )
}
