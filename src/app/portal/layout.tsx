import { headers } from "next/headers"
import { getCompanyFromHeaders } from "@/lib/company-context"
import Link from "next/link"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const subdomain = headersList.get("x-company-subdomain")
  const company = await getCompanyFromHeaders(subdomain)

  return (
    <div className="min-h-screen bg-white">
      <header
        className="border-b"
        style={{
          backgroundColor: company?.primaryColor ?? "#1a56db",
          borderColor: "transparent",
        }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          {company?.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-8 h-8 rounded object-contain bg-white p-0.5"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: company?.secondaryColor ?? "#fff",
                color: company?.primaryColor ?? "#1a56db",
              }}
            >
              {(company?.name ?? "P").charAt(0)}
            </div>
          )}
          <span
            className="font-semibold"
            style={{ color: company?.secondaryColor ?? "#fff" }}
          >
            {company?.name ?? "Portal Institucional"}
          </span>
        </div>
      </header>
      <main>{children}</main>
      {!subdomain && (
        <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-400">
          <Link href="/admin/login" className="hover:text-zinc-600">
            Panel Admin
          </Link>
        </footer>
      )}
    </div>
  )
}
