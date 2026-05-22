import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function proxy(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const subdomain = host.split(".")[0]

  if (
    subdomain &&
    subdomain !== "localhost" &&
    subdomain !== "www"
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
