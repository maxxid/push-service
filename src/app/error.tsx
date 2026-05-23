"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center max-w-sm">
        <p className="text-6xl font-bold text-zinc-200 mb-4">500</p>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">
          Algo salió mal
        </h1>
        <p className="text-zinc-500 mb-6 text-sm">
          {error.message || "Ocurrió un error inesperado."}
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
