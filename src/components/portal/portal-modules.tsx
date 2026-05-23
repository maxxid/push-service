import { DocumentosModule } from "./module-documentos"
import { EventsModule } from "./module-events"
import { ContactoModule } from "./module-contacto"

type Props = {
  modules: string[]
  primaryColor: string
}

export function PortalModules({ modules, primaryColor }: Props) {
  return (
    <div className="text-left">
      {modules.includes("documentos") && <DocumentosModule />}
      {modules.includes("eventos") && <EventsModule />}
      {modules.includes("contacto") && (
        <ContactoModule primaryColor={primaryColor} />
      )}
      {modules.includes("formularios") && (
        <section className="max-w-2xl mx-auto px-6 py-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            📝 Formularios
          </h2>
          <p className="text-sm text-zinc-500">
            Los formularios aparecerán acá. Creá landings con formularios desde
            el panel admin.
          </p>
        </section>
      )}
    </div>
  )
}
