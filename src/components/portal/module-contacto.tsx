export function ContactoModule({
  primaryColor,
}: {
  primaryColor: string
}) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold text-zinc-900 mb-4">📞 Contacto rápido</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-50 rounded-xl p-4 text-center hover:bg-green-100 transition-colors"
        >
          <p className="text-2xl mb-1">💬</p>
          <p className="text-sm font-medium text-green-800">WhatsApp</p>
          <p className="text-xs text-green-600 mt-0.5">Enviar mensaje</p>
        </a>
        <a
          href="tel:"
          className="bg-blue-50 rounded-xl p-4 text-center hover:bg-blue-100 transition-colors"
        >
          <p className="text-2xl mb-1">📞</p>
          <p className="text-sm font-medium text-blue-800">Llamar</p>
          <p className="text-xs text-blue-600 mt-0.5">Contacto directo</p>
        </a>
        <a
          href="mailto:"
          className="bg-amber-50 rounded-xl p-4 text-center hover:bg-amber-100 transition-colors"
        >
          <p className="text-2xl mb-1">✉️</p>
          <p className="text-sm font-medium text-amber-800">Email</p>
          <p className="text-xs text-amber-600 mt-0.5">Enviar correo</p>
        </a>
      </div>
    </section>
  )
}
