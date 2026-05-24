let container: HTMLDivElement | null = null

function getContainer() {
  if (container) return container
  container = document.createElement("div")
  container.className = "fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
  document.body.appendChild(container)
  return container
}

function show(message: string, type: "success" | "error" | "info") {
  const c = getContainer()
  const el = document.createElement("div")

  const colors = {
    success: "bg-emerald-600 text-white shadow-emerald-200",
    error: "bg-red-600 text-white shadow-red-200",
    info: "bg-zinc-800 text-white shadow-zinc-200",
  }

  const icons = {
    success: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  }

  el.className = `pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 translate-x-4 opacity-0 ${colors[type]}`
  el.innerHTML = `${icons[type]}<span>${message}</span>`
  c.appendChild(el)

  requestAnimationFrame(() => {
    el.style.transform = "translateX(0)"
    el.style.opacity = "1"
  })

  setTimeout(() => {
    el.style.transform = "translateX(8px)"
    el.style.opacity = "0"
    setTimeout(() => el.remove(), 300)
  }, 3000)
}

export const toast = {
  success: (msg: string) => show(msg, "success"),
  error: (msg: string) => show(msg, "error"),
  info: (msg: string) => show(msg, "info"),
}
