import { StrToTimeOptions } from "./types"
import { defaultPatterns } from "./patterns"
import { isValidDate, tryPattern } from "./utils"
import { normalizeInput } from "./utils"

export const strtotime = (
  input: string,
  baseDate: Date = new Date(),
  options: StrToTimeOptions = {
    weekStartsOnSunday: true
  }
): Date | null => {
  const normalized = normalizeInput(input)

  if (normalized === "now") {
    return new Date(baseDate)
  }

  const foundPattern = defaultPatterns
    .map((pattern) => tryPattern(normalized, pattern, baseDate))
    .find((foundPattern) => foundPattern !== null)
  if (foundPattern) return foundPattern

  if (!options.strictMode) {
    const date = new Date(input)
    if (isValidDate(date)) {
      return date
    }
  }

  return null
}

console.log(strtotime("1 week ago"))
