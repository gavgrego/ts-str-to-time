import { describe, it, expect } from "vitest"
import { strtotime } from "../src"

describe("strtotime", () => {
  // Helper to create a fixed base date for consistent testing
  const baseDate = new Date("2024-03-14T12:00:00Z")

  describe("relative time patterns", () => {
    it("handles future relative times", () => {
      expect(strtotime("2 days", baseDate)).toEqual(
        new Date("2024-03-16T12:00:00Z")
      )
      expect(strtotime("+1 week", baseDate)).toEqual(
        new Date("2024-03-21T12:00:00Z")
      )
      expect(strtotime("3 months", baseDate)).toEqual(
        new Date("2024-06-14T12:00:00Z")
      )
    })

    it("handles past relative times", () => {
      expect(strtotime("2 days ago", baseDate)).toEqual(
        new Date("2024-03-12T12:00:00Z")
      )
      expect(strtotime("-1 week", baseDate)).toEqual(
        new Date("2024-03-07T12:00:00Z")
      )
      expect(strtotime("-3 months", baseDate)).toEqual(
        new Date("2023-12-14T12:00:00Z")
      )
    })
  })

  describe("weekday patterns", () => {
    it("handles next weekday", () => {
      expect(strtotime("next monday", baseDate)).toEqual(
        new Date("2024-03-18T12:00:00Z")
      )
      expect(strtotime("next friday", baseDate)).toEqual(
        new Date("2024-03-15T12:00:00Z")
      )
    })

    it("handles last weekday", () => {
      expect(strtotime("last monday", baseDate)).toEqual(
        new Date("2024-03-11T12:00:00Z")
      )
      expect(strtotime("last friday", baseDate)).toEqual(
        new Date("2024-03-08T12:00:00Z")
      )
    })
  })

  describe("common dates pattern", () => {
    it("handles today/tomorrow/yesterday", () => {
      expect(strtotime("today", baseDate)).toEqual(
        new Date("2024-03-14T12:00:00Z")
      )
      expect(strtotime("tomorrow", baseDate)).toEqual(
        new Date("2024-03-15T12:00:00Z")
      )
      expect(strtotime("yesterday", baseDate)).toEqual(
        new Date("2024-03-13T12:00:00Z")
      )
    })
  })

  describe("ISO date pattern", () => {
    it("handles full ISO dates", () => {
      expect(strtotime("2024-03-14T15:30:00Z")).toEqual(
        new Date("2024-03-14T15:30:00Z")
      )
    })

    it("handles dates without time", () => {
      // Note: when no time is specified, it defaults to midnight UTC
      expect(strtotime("2024-03-14")).toEqual(new Date("2024-03-14T00:00:00Z"))
    })

    it("handles invalid dates", () => {
      expect(strtotime("2024-13-45")).toBeNull()
    })
  })

  describe("error cases", () => {
    it("handles invalid input", () => {
      expect(strtotime("")).toBeNull()
      expect(strtotime("invalid date")).toBeNull()
      expect(strtotime("next invalidday")).toBeNull()
    })

    it("handles strict mode", () => {
      expect(
        strtotime("invalid date", undefined, { strictMode: true })
      ).toBeNull()
      // This might work in non-strict mode depending on the browser
      expect(
        strtotime("03/14/2024", undefined, { strictMode: true })
      ).toBeNull()
    })
  })
})
