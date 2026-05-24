import { headers } from "next/headers"
import { getCompanyFromHeaders } from "@/lib/company-context"
import { getOneSignalAppId } from "@/lib/onesignal"
import { OneSignalInit } from "@/components/portal/onesignal-init"
import { ThemeToggle } from "@/components/portal/theme-toggle"
import { prisma } from "@/lib/prisma"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const subdomain = headersList.get("x-company-subdomain")

  let company = await getCompanyFromHeaders(subdomain)
  if (!company) {
    company = await prisma.company.findFirst({ orderBy: { createdAt: "asc" } })
  }

  const onesignalAppId = getOneSignalAppId()

  const primary = company?.primaryColor ?? "#1a56db"
  const secondary = company?.secondaryColor ?? "#ffffff"

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <header
        className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl transition-all duration-300"
        style={{ borderColor: primary + "20" }}
      >
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company?.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-9 w-9 rounded-xl object-contain bg-white p-0.5 shadow-sm ring-1 ring-black/5"
              />
            ) : (
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: primary }}
              >
                {(company?.name ?? "P").charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold tracking-tight text-base" style={{ color: "#ffffff" }}>
              {company?.headerTitle || (company?.name ? `Notificaciones ${company.name}` : "Notificaciones")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative">{children}</main>

      {!subdomain && (
        <footer className="border-t border-[var(--card-border)] py-10 text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            Plataforma de Comunicación Institucional
          </p>
        </footer>
      )}

      {onesignalAppId && <OneSignalInit appId={onesignalAppId} />}
    </div>
  )
}
