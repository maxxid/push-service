import { cookies } from "next/headers"

const COOKIE_NAME = "selected-company-id"

export async function getSelectedCompanyId(userRole: string, userCompanyId: string | null): Promise<string | null> {
  if (userRole !== "SUPERADMIN") return userCompanyId ?? null

  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value || null
}

export async function getCompanyWhere(userRole: string, userCompanyId: string | null) {
  const selectedId = await getSelectedCompanyId(userRole, userCompanyId)
  return selectedId ? { companyId: selectedId } : {}
}
