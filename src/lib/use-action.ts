"use client"

import { useState, useCallback } from "react"

export function useAction<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  options?: { onError?: (err: unknown) => void }
) {
  const [loading, setLoading] = useState(false)

  const run = useCallback(
    async (...args: T) => {
      if (loading) return
      setLoading(true)
      try {
        await fn(...args)
      } catch (err) {
        options?.onError?.(err)
      } finally {
        setLoading(false)
      }
    },
    [fn, loading, options]
  )

  return { loading, run }
}
