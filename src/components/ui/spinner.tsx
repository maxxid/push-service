export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 ${className}`}
    />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}
