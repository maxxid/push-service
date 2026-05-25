export function ContactoModule({
  primaryColor,
  whatsappNumber,
}: {
  primaryColor: string
  whatsappNumber?: string | null
}) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">📞 Contacto rápido</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {whatsappNumber ? (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-50 dark:bg-green-950 rounded-xl p-4 text-center hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
          >
            <p className="text-2xl mb-1">💬</p>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">WhatsApp</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Enviar mensaje</p>
          </a>
        ) : (
          <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 text-center opacity-50 cursor-not-allowed">
            <p className="text-2xl mb-1">💬</p>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">WhatsApp</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">No configurado</p>
          </div>
        )}
        <a
          href="tel:"
          className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4 text-center hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        >
          <p className="text-2xl mb-1">📞</p>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Llamar</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Contacto directo</p>
        </a>
        <a
          href="mailto:"
          className="bg-amber-50 dark:bg-amber-950 rounded-xl p-4 text-center hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
        >
          <p className="text-2xl mb-1">✉️</p>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Email</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Enviar correo</p>
        </a>
      </div>
    </section>
  )
}
