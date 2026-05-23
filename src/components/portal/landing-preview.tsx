import type { LandingBlock } from "./landing-blocks"

export function BlockPreview({ block }: { block: LandingBlock }) {
  if (block.type === "texto") {
    const hasMd =
      block.content.includes("##") || block.content.includes("**")
    if (hasMd) {
      const html = block.content
        .replace(
          /^## (.+)$/gm,
          '<h2 class="text-xl font-bold mb-2 text-zinc-900">$1</h2>'
        )
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, "<br>")
      return <div dangerouslySetInnerHTML={{ __html: html }} />
    }
    return (
      <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed text-[15px]">
        {block.content}
      </p>
    )
  }

  if (block.type === "imagen" && block.url) {
    return (
      <img
        src={block.url}
        alt=""
        className="max-w-full rounded-xl"
      />
    )
  }

  if ((block.type === "boton" || block.type === "pdf") && block.label) {
    return (
      <a
        href={block.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block px-6 py-3 rounded-xl font-medium text-sm transition-colors ${
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
        <div className="rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="w-full aspect-video"
            allowFullScreen
          />
        </div>
      )
    }
    return (
      <video
        src={block.url}
        controls
        className="max-w-full rounded-xl"
      />
    )
  }

  if (block.type === "separador") {
    return <hr className="border-zinc-200 my-4" />
  }

  return null
}
