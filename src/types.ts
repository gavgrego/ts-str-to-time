export type DatePattern = {
  regex: RegExp
  handler: (matches: RegExpMatchArray, baseDate: Date) => Date | null
}

export interface TimeUnit {
  regex: RegExp
  handler: (matches: RegExpMatchArray, baseDate: Date) => Date | null
}

export type StrToTimeOptions = {
  weekStartsOnSunday?: boolean
  strictMode?: boolean
}
