import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
      <h1 className="text-3xl font-bold text-zinc-900 mb-2">
        Plataforma de Comunicación Institucional
      </h1>
      <p className="text-zinc-500 mb-8">
        PWA + Push Notifications multiempresa
      </p>

      <div className="flex gap-4">
        <Link
          href="/admin/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Panel Admin
        </Link>
        <Link
          href="/portal"
          className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
        >
          Portal Demo
        </Link>
      </div>
    </div>
  )
}
