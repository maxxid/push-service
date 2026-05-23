const rateMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, maxRequests = 30, windowMs = 60000) {
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || "unknown"
  const url = new URL(request.url)
  return `${ip}:${url.pathname}`
}
