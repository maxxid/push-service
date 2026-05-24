"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  type LandingBlock,
  blockTypes,
  generateId,
} from "./landing-blocks"

function BlockEditor({
  block,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: LandingBlock
  onChange: (b: LandingBlock) => void
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}) {
  const typeInfo = blockTypes.find((t) => t.value === block.type)

  return (
    <div className="border border-slate-700 rounded-lg p-3 bg-slate-900 group hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span>{typeInfo?.icon}</span> {typeInfo?.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="text-xs text-slate-400 hover:text-zinc-600"
              title="Subir"
              type="button"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="text-xs text-slate-400 hover:text-zinc-600"
              title="Bajar"
              type="button"
            >
              ↓
            </button>
          )}
          <button
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-600"
            title="Eliminar"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      {block.type === "texto" && (
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Escribí el contenido acá..."
        />
      )}

      {block.type === "imagen" && (
        <div className="space-y-2">
          <input
            type="url"
            value={block.url || ""}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="URL de la imagen"
          />
          {block.url && (
            <img
              src={block.url}
              alt="preview"
              className="max-h-40 rounded-lg border border-slate-700"
            />
          )}
        </div>
      )}

      {(block.type === "boton" || block.type === "pdf") && (
        <div className="space-y-2">
          <input
            type="text"
            value={block.label || ""}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Texto del botón"
          />
          <input
            type="url"
            value={block.url || ""}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="URL de destino"
          />
        </div>
      )}

      {block.type === "video" && (
        <input
          type="url"
          value={block.url || ""}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL del video (YouTube, etc.)"
        />
      )}

      {block.type === "separador" && <hr className="border-slate-700" />}
    </div>
  )
}

function fixUrl(url: string): string {
  if (!url) return "#"
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(url)) return url
  return `https://${url}`
}

function BlockPreview({ block }: { block: LandingBlock }) {
  if (block.type === "texto") {
    const hasMd =
      block.content.includes("##") || block.content.includes("**")
    if (hasMd) {
      const html = block.content
        .replace(
          /^## (.+)$/gm,
          '<h2 class="text-xl font-bold mb-2 text-white">$1</h2>'
        )
        .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white'>$1</strong>")
        .replace(/\n/g, "<br>")
      return <div dangerouslySetInnerHTML={{ __html: html }} />
    }
    return (
      <p className="text-white whitespace-pre-wrap leading-relaxed text-[15px]">
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

  if (
    (block.type === "boton" || block.type === "pdf") &&
    block.label
  ) {
    return (
      <a
        href={fixUrl(block.url || "")}
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
    return <hr className="border-slate-700 my-4" />
  }

  return null
}

export function LandingBuilder({
  initialBlocks,
  onChange,
}: {
  initialBlocks: LandingBlock[]
  onChange: (blocks: LandingBlock[]) => void
}) {
  const [blocks, setBlocks] = useState<LandingBlock[]>(initialBlocks)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const updateBlock = (index: number, block: LandingBlock) => {
    const next = [...blocks]
    next[index] = block
    setBlocks(next)
    onChange(next)
  }

  const removeBlock = (index: number) => {
    const next = blocks.filter((_, i) => i !== index)
    setBlocks(next)
    onChange(next)
  }

  const moveBlock = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return
    const next = [...blocks]
    ;[next[from], next[to]] = [next[to], next[from]]
    setBlocks(next)
    onChange(next)
  }

  const addBlock = (type: LandingBlock["type"]) => {
    const block: LandingBlock = {
      id: generateId(),
      type,
      content: "",
    }
    const next = [...blocks, block]
    setBlocks(next)
    onChange(next)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 flex-wrap">
          {blockTypes.map((bt) => (
            <button
              key={bt.value}
              onClick={() => addBlock(bt.value)}
              type="button"
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>{bt.icon}</span> {bt.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPreview(!preview)}
          type="button"
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {preview ? "Editar" : "Vista previa"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!preview && (
          <div className="space-y-3">
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
                <p className="text-slate-400 text-sm">
                  Agregá bloques con los botones de arriba
                </p>
              </div>
            ) : (
              blocks.map((block, i) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onChange={(b) => updateBlock(i, b)}
                  onRemove={() => removeBlock(i)}
                  onMoveUp={i > 0 ? () => moveBlock(i, i - 1) : undefined}
                  onMoveDown={
                    i < blocks.length - 1
                      ? () => moveBlock(i, i + 1)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        )}

        <div
          className={`bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4 ${
            preview ? "max-w-lg mx-auto w-full" : ""
          }`}
        >
          <div className="text-xs text-slate-400 text-center pb-2 border-b border-slate-800 mb-4">
            Vista previa mobile
          </div>
          {blocks.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">
              Sin contenido todavía
            </p>
          ) : (
            blocks.map((block) => (
              <BlockPreview key={block.id} block={block} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
