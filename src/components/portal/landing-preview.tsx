import type { LandingBlock } from "./landing-blocks"

function fixUrl(url: string): string {
  if (!url) return "#"
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(url)) return url
  return `https://${url}`
}

export function BlockPreview({ block }: { block: LandingBlock }) {
  if (block.type === "texto") {
    const text = block.content || ""
    if (text.startsWith("## ")) {
      return (
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-10 mb-4 leading-tight tracking-tight">
          {text.replace(/^## /, "")}
        </h2>
      )
    }

    const hasMd = text.includes("**") || text.includes("\n- ")
    if (hasMd) {
      const html = text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-900 dark:text-white">$1</strong>')
        .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-700 dark:text-slate-300 leading-relaxed">$1</li>')
        .replace(/\n/g, "<br>")
      return <div className="text-[15px] text-zinc-700 dark:text-slate-300 leading-relaxed space-y-1" dangerouslySetInnerHTML={{ __html: html }} />
    }

    return (
      <p className="text-[15px] text-zinc-700 dark:text-slate-300 leading-relaxed">
        {text}
      </p>
    )
  }

  if (block.type === "imagen" && block.url) {
    return (
      <figure className="my-8">
        <img src={block.url} alt="" className="w-full rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/5" />
      </figure>
    )
  }

  if ((block.type === "boton" || block.type === "pdf") && block.label) {
    return (
      <div className="flex pt-2">
        <a
          href={fixUrl(block.url || "")}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
            block.type === "boton"
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-red-600 text-white hover:bg-red-500"
          }`}
        >
          {block.type === "pdf" && (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {block.label}
        </a>
      </div>
    )
  }

  if (block.type === "video" && block.url) {
    const youtubeMatch = block.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/)
    return (
      <figure className="my-8">
        <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/5">
          {youtubeMatch ? (
            <iframe src={`https://www.youtube.com/embed/${youtubeMatch[1]}`} className="w-full aspect-video" allowFullScreen />
          ) : (
            <video src={block.url} controls className="w-full" />
          )}
        </div>
      </figure>
    )
  }

  if (block.type === "separador") {
    return <hr className="my-10 border-zinc-100 dark:border-slate-800" />
  }

  return null
}
