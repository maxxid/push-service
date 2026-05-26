function normalizeDni(input: string): string | null {
  const digits = input.replace(/\D/g, "")
  if (digits.length === 7) return "0" + digits
  if (digits.length === 8) return digits
  return null
}

export { normalizeDni }
