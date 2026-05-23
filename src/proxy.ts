import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const parts = host.split(".")
  const subdomain = parts.length >= 3 ? parts[0] : null

  if (
    subdomain &&
    subdomain !== "localhost" &&
    subdomain !== "www" &&
    subdomain !== "admin"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `/portal${url.pathname}`

    const res = NextResponse.rewrite(url)
    res.headers.set("x-company-subdomain", subdomain)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin|portal).*)"],
}
