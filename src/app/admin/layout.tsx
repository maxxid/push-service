import { SessionProvider } from "next-auth/react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminInnerLayout } from "@/components/admin/admin-inner-layout"
import { ToastProvider } from "@/components/ui/toast"

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
      <ToastProvider>
        <AdminGuard>
          <AdminInnerLayout>{children}</AdminInnerLayout>
        </AdminGuard>
      </ToastProvider>
    </SessionProvider>
  )
}
