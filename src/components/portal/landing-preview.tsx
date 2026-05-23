import type { LandingBlock } from "./landing-blocks"

export function BlockPreview({ block }: { block: LandingBlock }) {
  if (block.type === "texto") {
    const text = block.content || ""
    const hasMd = text.includes("##") || text.includes("**")

    if (hasMd) {
      const html = text
        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-3 mt-6" style="color: var(--foreground)">$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, "<br>")
      return <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    }
    return (
      <div className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)", opacity: 0.9 }}>
        {text}
      </div>
    )
  }

  if (block.type === "imagen" && block.url) {
    return (
      <img src={block.url} alt="" className="max-w-full rounded-2xl shadow-md" />
    )
  }

  if ((block.type === "boton" || block.type === "pdf") && block.label) {
    return (
      <a
        href={block.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
          block.type === "boton"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {block.type === "pdf" && "📄 "}
        {block.label}
      </a>
    )
  }

  if (block.type === "video" && block.url) {
    const youtubeMatch = block.url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/
    )
    if (youtubeMatch) {
      return (
        <div className="rounded-2xl overflow-hidden shadow-md">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="w-full aspect-video"
            allowFullScreen
          />
        </div>
      )
    }
    return <video src={block.url} controls className="max-w-full rounded-2xl shadow-md" />
  }

  if (block.type === "separador") {
    return <hr className="border-[var(--card-border)] my-6" />
  }

  return null
}
