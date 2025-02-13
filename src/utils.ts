import { DatePattern } from "./types"

const normalizeInput = (input: string): string => input.trim().toLowerCase()

const isValidDate = (date: Date): boolean => !isNaN(date.getTime())

const tryPattern = (
  input: string,
  pattern: DatePattern,
  baseDate: Date
): Date | null => {
  const matches = input.match(pattern.regex)
  if (!matches) return null

  const result = pattern.handler(matches, new Date(baseDate))
  return result && isValidDate(result) ? result : null
}

export { normalizeInput, isValidDate, tryPattern }
