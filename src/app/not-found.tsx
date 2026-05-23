import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-zinc-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-zinc-500 mb-6">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
