import { Sidebar } from "@/components/admin/sidebar"

export const metadata = {
  title: "Panel Administrativo",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
