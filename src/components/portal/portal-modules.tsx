import { DocumentosModule } from "./module-documentos"
import { EventsModule } from "./module-events"
import { ContactoModule } from "./module-contacto"

type Props = {
  modules: string[]
  primaryColor: string
  whatsappNumber?: string | null
}

export function PortalModules({ modules, primaryColor, whatsappNumber }: Props) {
  return (
    <div className="text-left mt-16">
      {modules.includes("documentos") && <DocumentosModule />}
      {modules.includes("agenda") && <EventsModule />}
      {modules.includes("contacto") && <ContactoModule primaryColor={primaryColor} whatsappNumber={whatsappNumber} />}
    </div>
  )
}
