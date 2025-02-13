import { DatePattern } from "./types"

const relativeTimePattern: DatePattern = {
  regex:
    /^(\+|\-)?(\d+)\s+(second|minute|hour|day|week|month|year)s?\s*(ago)?$/i,
  handler: (matches, baseDate) => {
    const amount =
      parseInt(matches[2]) *
      (matches[1] === "-" || matches[4] === "ago" ? -1 : 1)
    const unit = matches[3].toLowerCase()
    const date = new Date(baseDate)

    // Store the initial hours to check for DST changes
    const initialHours = date.getUTCHours()

    const handlers: Record<string, () => void> = {
      second: () => date.setUTCSeconds(date.getUTCSeconds() + amount),
      minute: () => date.setUTCMinutes(date.getUTCMinutes() + amount),
      hour: () => date.setUTCHours(date.getUTCHours() + amount),
      day: () => date.setUTCDate(date.getUTCDate() + amount),
      week: () => date.setUTCDate(date.getUTCDate() + amount * 7),
      month: () => {
        date.setUTCMonth(date.getUTCMonth() + amount)
        // Correct hours if DST transition occurred
        if (date.getUTCHours() !== initialHours) {
          date.setUTCHours(initialHours)
        }
      },
      year: () => {
        date.setUTCFullYear(date.getUTCFullYear() + amount)
        // Correct hours if DST transition occurred
        if (date.getUTCHours() !== initialHours) {
          date.setUTCHours(initialHours)
        }
      }
    }

    handlers[unit]?.()
    return date
  }
}

const weekdayPattern: DatePattern = {
  regex:
    /^(next|last)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i,
  handler: (matches, baseDate) => {
    const direction = matches[1].toLowerCase()
    const weekday = matches[2].toLowerCase()
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ]
    const targetDay = weekdays.indexOf(weekday)
    const date = new Date(baseDate)

    const currentDay = date.getUTCDay()
    let daysToAdd = (targetDay - currentDay + 7) % 7

    if (direction === "next") {
      daysToAdd = daysToAdd === 0 ? 7 : daysToAdd
    } else {
      daysToAdd -= 7
    }

    date.setUTCDate(date.getUTCDate() + daysToAdd)
    return date
  }
}

const commonDatesPattern: DatePattern = {
  regex: /^(today|tomorrow|yesterday)$/i,
  handler: (matches, baseDate) => {
    const date = new Date(baseDate)
    const handlers: Record<string, () => void> = {
      yesterday: () => date.setDate(date.getDate() - 1),
      tomorrow: () => date.setDate(date.getDate() + 1),
      today: () => {} // no-op
    }

    handlers[matches[1].toLowerCase()]?.()
    return date
  }
}

const isoDatePattern: DatePattern = {
  regex:
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})?)?$/,
  handler: (matches) => {
    const [
      _,
      year,
      month,
      day,
      hour = "00",
      minute = "00",
      second = "00",
      ms = "0",
      tz
    ] = matches
    const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}${
      tz || "Z"
    }`
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
  }
}

export const defaultPatterns = [
  relativeTimePattern,
  weekdayPattern,
  commonDatesPattern,
  isoDatePattern
] as const
