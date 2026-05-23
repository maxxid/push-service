import { SessionProvider } from "next-auth/react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminInnerLayout } from "@/components/admin/admin-inner-layout"

export const metadata = {
  title: "Panel Administrativo",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminGuard>
        <AdminInnerLayout>{children}</AdminInnerLayout>
      </AdminGuard>
    </SessionProvider>
  )
}
