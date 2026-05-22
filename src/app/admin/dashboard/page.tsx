export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">Suscriptores</p>
          <p className="text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">Campañas enviadas</p>
          <p className="text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <p className="text-sm text-zinc-500">CTR promedio</p>
          <p className="text-3xl font-bold text-zinc-900">0%</p>
        </div>
      </div>
    </div>
  )
}
