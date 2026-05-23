"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  {
    title: "Configurá tu branding",
    desc: "Personalizá el portal con tu logo, colores y nombre institucional.",
    href: "/admin/branding",
    cta: "Ir a Branding",
  },
  {
    title: "Creá tu primer segmento",
    desc: "Agrupá suscriptores en segmentos como 'Productores' o 'Directivos'.",
    href: "/admin/segments/new",
    cta: "Crear segmento",
  },
  {
    title: "Enviá tu primera campaña",
    desc: "Creá un comunicado, seleccioná segmento y envialo al instante.",
    href: "/admin/campaigns/new",
    cta: "Crear campaña",
  },
  {
    title: "Compartí el portal",
    desc: "Difundí el link del portal para que tus afiliados activen notificaciones.",
    href: "/admin/branding",
    cta: "Ver mi portal",
  },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const step = steps[currentStep]

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Paso {currentStep + 1} de {steps.length}
          </p>
          <h2 className="text-lg font-bold text-blue-900">{step.title}</h2>
          <p className="text-sm text-blue-700 mt-1">{step.desc}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-blue-400 hover:text-blue-600 text-sm"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Link href={step.href}>
          <Button size="sm">{step.cta} →</Button>
        </Link>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? "bg-blue-600" : "bg-blue-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
