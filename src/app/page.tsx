import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const companyCount = await prisma.company.count()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-6">
      <h1 className="text-3xl font-bold text-zinc-900 mb-2 text-center">
        Plataforma de Comunicación Institucional
      </h1>
      <p className="text-zinc-500 mb-8 text-center">
        PWA + Push Notifications multiempresa
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        {companyCount > 0 && (
          <Link
            href="/portal"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Portal de notificaciones →
          </Link>
        )}
        <Link
          href="/admin/login"
          className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
        >
          Panel Admin
        </Link>
      </div>

      {companyCount === 0 && (
        <p className="text-sm text-zinc-400 mt-6 max-w-xs text-center">
          Creá tu primera empresa desde el Panel Admin para empezar a enviar
          notificaciones.
        </p>
      )}
    </div>
  )
}
