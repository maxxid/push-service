export type LandingBlock = {
  id: string
  type: "texto" | "imagen" | "boton" | "pdf" | "video" | "separador"
  content: string
  url?: string
  label?: string
}

const defaultBlocks: Record<string, LandingBlock[]> = {
  comunicado: [
    {
      id: "1",
      type: "texto",
      content: "## Comunicado institucional\n\nEstimados afiliados, les informamos que...",
    },
    { id: "2", type: "separador", content: "" },
    {
      id: "3",
      type: "boton",
      content: "Leer documento completo",
      label: "Leer documento completo",
      url: "",
    },
  ],
  asamblea: [
    {
      id: "1",
      type: "texto",
      content: "## Convocatoria a Asamblea General\n\nSe convoca a todos los afiliados a la asamblea general ordinaria.",
    },
    {
      id: "2",
      type: "texto",
      content: "**Fecha:** [completar]\n**Hora:** [completar]\n**Lugar:** [completar]",
    },
    {
      id: "3",
      type: "boton",
      content: "Confirmar asistencia",
      label: "Confirmar asistencia",
      url: "",
    },
  ],
  alerta: [
    {
      id: "1",
      type: "texto",
      content: "## ⚡ Alerta urgente\n\nInformamos a todos los afiliados que...",
    },
    { id: "2", type: "separador", content: "" },
    {
      id: "3",
      type: "boton",
      content: "Más información",
      label: "Más información",
      url: "",
    },
  ],
  reunion: [
    {
      id: "1",
      type: "texto",
      content: "## Reunión informativa\n\nSe informa a los afiliados que se realizará una reunión...",
    },
    {
      id: "2",
      type: "texto",
      content: "**Temas a tratar:**\n- Tema 1\n- Tema 2\n- Tema 3",
    },
  ],
  documento: [
    {
      id: "1",
      type: "texto",
      content: "## Documento importante\n\nSe pone a disposición el siguiente documento para su consulta.",
    },
    {
      id: "2",
      type: "pdf",
      content: "Descargar documento",
      label: "Descargar documento",
      url: "",
    },
  ],
  horario: [
    {
      id: "1",
      type: "texto",
      content: "## Cambio de horario\n\nInformamos que a partir del [fecha] el horario de atención será:",
    },
    {
      id: "2",
      type: "texto",
      content: "**Lunes a Viernes:** [horario]\n**Sábados:** [horario]",
    },
  ],
  aviso: [
    {
      id: "1",
      type: "texto",
      content: "## Aviso importante\n\nSe informa a todos los afiliados que...",
    },
    { id: "2", type: "separador", content: "" },
    {
      id: "3",
      type: "boton",
      content: "Más información",
      label: "Más información",
      url: "",
    },
  ],
}

export function getDefaultBlocks(
  template: string
): LandingBlock[] {
  return (
    (defaultBlocks[template] ?? defaultBlocks.comunicado)!.map((b) => ({
      ...b,
      id: crypto.randomUUID(),
    }))
  )
}

export function generateId() {
  return crypto.randomUUID()
}

export const blockTypes: {
  value: LandingBlock["type"]
  label: string
  icon: string
}[] = [
  { value: "texto", label: "Texto", icon: "📝" },
  { value: "imagen", label: "Imagen", icon: "🖼️" },
  { value: "boton", label: "Botón", icon: "🔘" },
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "video", label: "Video", icon: "🎬" },
  { value: "separador", label: "Separador", icon: "➖" },
]
