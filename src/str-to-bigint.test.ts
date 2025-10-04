import { describe, expect, it } from "bun:test"
import { stringToBigInt } from "./str-to-bigint"

describe("stringToBigInt", () => {
  describe("Basic functionality", () => {
    it("should convert a simple ASCII string to BigInt", () => {
      const result = stringToBigInt("hello").toBigInt()
      expect(typeof result).toBe("bigint")
      expect(result).toBe(448378203247n)
    })

    it("should convert single character to BigInt", () => {
      const result = stringToBigInt("A")
      expect(result.toBigInt()).toBe(65n) // ASCII code for 'A'
    })

    it("should handle empty string", () => {
      const result = stringToBigInt("")
      expect(result.toBigInt()).toBe(0n)
    })
  })

  describe("Unicode and special characters", () => {
    it("should handle Unicode characters", () => {
      const result = stringToBigInt("é").toBigInt()
      expect(typeof result).toBe("bigint")
      expect(result).toBeGreaterThan(0n)
    })

    it("should handle Chinese characters", () => {
      const result = stringToBigInt("你好").toBigInt()
      expect(typeof result).toBe("bigint")
      expect(result).toBeGreaterThan(0n)
    })

    it("should handle mixed Unicode characters", () => {
      const result = stringToBigInt("Hello 世界 🌍").toBigInt()
      expect(typeof result).toBe("bigint")
      expect(result).toBeGreaterThan(0n)
    })
  })

  describe("Consistency and determinism", () => {
    it("should return the same BigInt for the same input", () => {
      const input = "test string"
      const result1 = stringToBigInt(input).toBigInt()
      const result2 = stringToBigInt(input).toBigInt()
      expect(result1).toBe(result2)
    })

    it("should return different BigInts for different inputs", () => {
      const result1 = stringToBigInt("test1").toBigInt()
      const result2 = stringToBigInt("test2").toBigInt()
      expect(result1).not.toBe(result2)
    })

    it("should be case sensitive", () => {
      const result1 = stringToBigInt("Hello").toBigInt()
      const result2 = stringToBigInt("hello").toBigInt()
      expect(result1).not.toBe(result2)
    })
  })

  describe("Edge cases", () => {
    it("should handle whitespace", () => {
      const result = stringToBigInt("   ")
      expect(result.toBigInt()).toBeGreaterThan(0n)
    })

    it("should handle newlines and tabs", () => {
      const result = stringToBigInt("\n\t").toBigInt()
      expect(typeof result).toBe("bigint")
    })

    it("should handle special symbols", () => {
      const result = stringToBigInt("!@#$%^&*()").toBigInt()
      expect(typeof result).toBe("bigint")
      expect(result).toBeGreaterThan(0n)
    })

    it("should handle very long strings", () => {
      const longString = "a".repeat(1000)
      const result = stringToBigInt(longString).toBigInt()
      expect(typeof result).toBe("bigint")
      expect(result).toBeGreaterThan(0n)
    })
  })

  describe("Input validation", () => {
    it("should throw TypeError for null input", () => {
      expect(() => stringToBigInt(null as any)).toThrow(TypeError)
      expect(() => stringToBigInt(null as any)).toThrow(
        "Expected a string, but received object",
      )
    })

    it("should throw TypeError for undefined input", () => {
      expect(() => stringToBigInt(undefined as any)).toThrow(TypeError)
      expect(() => stringToBigInt(undefined as any)).toThrow(
        "Expected a string, but received undefined",
      )
    })

    it("should throw TypeError for number input", () => {
      expect(() => stringToBigInt(123 as any)).toThrow(TypeError)
      expect(() => stringToBigInt(123 as any)).toThrow(
        "Expected a string, but received number",
      )
    })

    it("should throw TypeError for object input", () => {
      expect(() => stringToBigInt({} as any)).toThrow(TypeError)
    })

    it("should throw TypeError for array input", () => {
      expect(() => stringToBigInt([] as any)).toThrow(TypeError)
    })
  })

  describe("Big-endian encoding verification", () => {
    it("should produce big-endian representation", () => {
      // For "AB", UTF-8 bytes are [65, 66] which is 0x4142
      const result = stringToBigInt("AB")
      expect(result.toBigInt()).toBe(0x4142n)
    })

    it("should maintain byte order for multi-byte sequences", () => {
      // ASCII 'a' is 0x61 (97 in decimal)
      const resultA = stringToBigInt("a")
      expect(resultA.toBigInt()).toBe(97n)

      // ASCII 'aa' should be 0x6161
      const resultAA = stringToBigInt("aa")
      expect(resultAA.toBigInt()).toBe(0x6161n)
    })
  })

  describe("Custom TextEncoder", () => {
    it("should work with provided TextEncoder instance", () => {
      const encoder = new TextEncoder()
      const result = stringToBigInt("hello", encoder)
      expect(result.toBigInt()).toBe(448378203247n)
    })

    it("should produce same result with custom encoder as default", () => {
      const encoder = new TextEncoder()
      const result1 = stringToBigInt("test", encoder)
      const result2 = stringToBigInt("test")
      expect(result1.toBigInt()).toBe(result2.toBigInt())
    })

    it("should handle empty string with custom encoder", () => {
      const encoder = new TextEncoder()
      const result = stringToBigInt("", encoder)
      expect(result.toBigInt()).toBe(0n)
    })

    it("should handle Unicode with custom encoder", () => {
      const encoder = new TextEncoder()
      const result = stringToBigInt("🚀", encoder)
      expect(result.toBigInt()).toBe(4036991616n)
    })

    it("should allow encoder reuse for multiple calls", () => {
      const encoder = new TextEncoder()
      const results = ["test1", "test2", "test3"].map((str) =>
        stringToBigInt(str, encoder).toBigInt(),
      )

      // Verify all results are different BigInts
      expect(results[0]).not.toBe(results[1])
      expect(results[1]).not.toBe(results[2])
      expect(results[0]).not.toBe(results[2])

      // Verify they match non-custom encoder results
      expect(results[0]).toBe(stringToBigInt("test1").toBigInt())
      expect(results[1]).toBe(stringToBigInt("test2").toBigInt())
      expect(results[2]).toBe(stringToBigInt("test3").toBigInt())
    })
  })
})
