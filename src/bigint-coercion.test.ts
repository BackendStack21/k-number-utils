import { describe, expect, test } from "bun:test"
import { BigIntCoercion } from "./bigint-coercion.js"

describe("BigIntCoercion", () => {
  describe("constructor", () => {
    test("should create instance with valid BigInt", () => {
      const bn = new BigIntCoercion(42n)
      expect(bn.toBigInt()).toBe(42n)
    })

    test("should throw TypeError for non-BigInt values", () => {
      // @ts-expect-error - Testing runtime error
      expect(() => new BigIntCoercion(42)).toThrow(TypeError)
      // @ts-expect-error - Testing runtime error
      expect(() => new BigIntCoercion("42")).toThrow(TypeError)
      // @ts-expect-error - Testing runtime error
      expect(() => new BigIntCoercion(null)).toThrow(TypeError)
      // @ts-expect-error - Testing runtime error
      expect(() => new BigIntCoercion(undefined)).toThrow(TypeError)
    })

    test("should handle zero", () => {
      const bn = new BigIntCoercion(0n)
      expect(bn.toBigInt()).toBe(0n)
    })

    test("should handle negative values", () => {
      const bn = new BigIntCoercion(-42n)
      expect(bn.toBigInt()).toBe(-42n)
    })

    test("should handle very large values", () => {
      const large = 123456789012345678901234567890n
      const bn = new BigIntCoercion(large)
      expect(bn.toBigInt()).toBe(large)
    })
  })

  describe("toInt8", () => {
    test("should convert values in range", () => {
      expect(new BigIntCoercion(0n).toInt8()).toBe(0)
      expect(new BigIntCoercion(127n).toInt8()).toBe(127)
      expect(new BigIntCoercion(-128n).toInt8()).toBe(-128)
    })

    test("should wrap positive overflow", () => {
      expect(new BigIntCoercion(128n).toInt8()).toBe(-128)
      expect(new BigIntCoercion(129n).toInt8()).toBe(-127)
      expect(new BigIntCoercion(255n).toInt8()).toBe(-1)
      expect(new BigIntCoercion(256n).toInt8()).toBe(0)
    })

    test("should wrap negative overflow", () => {
      expect(new BigIntCoercion(-129n).toInt8()).toBe(127)
      expect(new BigIntCoercion(-130n).toInt8()).toBe(126)
    })
  })

  describe("toUint8", () => {
    test("should convert values in range", () => {
      expect(new BigIntCoercion(0n).toUint8()).toBe(0)
      expect(new BigIntCoercion(255n).toUint8()).toBe(255)
    })

    test("should wrap overflow", () => {
      expect(new BigIntCoercion(256n).toUint8()).toBe(0)
      expect(new BigIntCoercion(257n).toUint8()).toBe(1)
      expect(new BigIntCoercion(512n).toUint8()).toBe(0)
    })

    test("should wrap negative values", () => {
      expect(new BigIntCoercion(-1n).toUint8()).toBe(255)
      expect(new BigIntCoercion(-2n).toUint8()).toBe(254)
      expect(new BigIntCoercion(-256n).toUint8()).toBe(0)
    })
  })

  describe("toInt16", () => {
    test("should convert values in range", () => {
      expect(new BigIntCoercion(0n).toInt16()).toBe(0)
      expect(new BigIntCoercion(32767n).toInt16()).toBe(32767)
      expect(new BigIntCoercion(-32768n).toInt16()).toBe(-32768)
    })

    test("should wrap positive overflow", () => {
      expect(new BigIntCoercion(32768n).toInt16()).toBe(-32768)
      expect(new BigIntCoercion(32769n).toInt16()).toBe(-32767)
    })

    test("should wrap negative overflow", () => {
      expect(new BigIntCoercion(-32769n).toInt16()).toBe(32767)
    })
  })

  describe("toUint16", () => {
    test("should convert values in range", () => {
      expect(new BigIntCoercion(0n).toUint16()).toBe(0)
      expect(new BigIntCoercion(65535n).toUint16()).toBe(65535)
    })

    test("should wrap overflow", () => {
      expect(new BigIntCoercion(65536n).toUint16()).toBe(0)
      expect(new BigIntCoercion(65537n).toUint16()).toBe(1)
    })

    test("should wrap negative values", () => {
      expect(new BigIntCoercion(-1n).toUint16()).toBe(65535)
      expect(new BigIntCoercion(-2n).toUint16()).toBe(65534)
    })
  })

  describe("toInt32", () => {
    test("should convert values in range", () => {
      expect(new BigIntCoercion(0n).toInt32()).toBe(0)
      expect(new BigIntCoercion(2147483647n).toInt32()).toBe(2147483647)
      expect(new BigIntCoercion(-2147483648n).toInt32()).toBe(-2147483648)
    })

    test("should wrap positive overflow", () => {
      expect(new BigIntCoercion(2147483648n).toInt32()).toBe(-2147483648)
      expect(new BigIntCoercion(2147483649n).toInt32()).toBe(-2147483647)
    })

    test("should wrap negative overflow", () => {
      expect(new BigIntCoercion(-2147483649n).toInt32()).toBe(2147483647)
    })

    test("should handle large values", () => {
      expect(new BigIntCoercion(123456789n).toInt32()).toBe(123456789)
      expect(new BigIntCoercion(9999999999n).toInt32()).toBe(1410065407)
    })
  })

  describe("toUint32", () => {
    test("should convert values in range", () => {
      expect(new BigIntCoercion(0n).toUint32()).toBe(0)
      expect(new BigIntCoercion(4294967295n).toUint32()).toBe(4294967295)
    })

    test("should wrap overflow", () => {
      expect(new BigIntCoercion(4294967296n).toUint32()).toBe(0)
      expect(new BigIntCoercion(4294967297n).toUint32()).toBe(1)
    })

    test("should wrap negative values", () => {
      expect(new BigIntCoercion(-1n).toUint32()).toBe(4294967295)
      expect(new BigIntCoercion(-2n).toUint32()).toBe(4294967294)
    })
  })

  describe("toAbsInt32", () => {
    test("should keep positive values in range", () => {
      expect(new BigIntCoercion(0n).toAbsInt32()).toBe(0)
      expect(new BigIntCoercion(123n).toAbsInt32()).toBe(123)
      expect(new BigIntCoercion(2147483647n).toAbsInt32()).toBe(2147483647)
    })

    test("should convert negative values to absolute", () => {
      expect(new BigIntCoercion(-1n).toAbsInt32()).toBe(1)
      expect(new BigIntCoercion(-123n).toAbsInt32()).toBe(123)
      expect(new BigIntCoercion(-2147483647n).toAbsInt32()).toBe(2147483647)
    })

    test("should wrap at 31-bit boundary (2147483647 max)", () => {
      expect(new BigIntCoercion(2147483648n).toAbsInt32()).toBe(0)
      expect(new BigIntCoercion(2147483649n).toAbsInt32()).toBe(1)
      expect(new BigIntCoercion(2147483650n).toAbsInt32()).toBe(2)
      expect(new BigIntCoercion(4294967295n).toAbsInt32()).toBe(2147483647)
    })

    test("should handle negative values with wrapping", () => {
      expect(new BigIntCoercion(-2147483648n).toAbsInt32()).toBe(0)
      expect(new BigIntCoercion(-2147483649n).toAbsInt32()).toBe(1)
      expect(new BigIntCoercion(-4294967295n).toAbsInt32()).toBe(2147483647)
    })

    test("should handle very large values", () => {
      expect(new BigIntCoercion(9999999999n).toAbsInt32()).toBe(1410065407)
      expect(new BigIntCoercion(-9999999999n).toAbsInt32()).toBe(1410065407)
    })
  })

  describe("toInt64 and toUint64", () => {
    test("should convert safe integer values exactly", () => {
      expect(new BigIntCoercion(9007199254740991n).toInt64()).toBe(
        9007199254740991,
      )
      expect(new BigIntCoercion(-9007199254740991n).toInt64()).toBe(
        -9007199254740991,
      )
    })

    test("should handle values near max safe integer", () => {
      const value = 9007199254740992n
      const result = new BigIntCoercion(value).toInt64()
      expect(typeof result).toBe("number")
    })

    test("should handle unsigned 64-bit values", () => {
      expect(new BigIntCoercion(0n).toUint64()).toBe(0)
      const large = 9007199254740991n
      expect(new BigIntCoercion(large).toUint64()).toBe(Number(large))
    })
  })

  describe("toBigInt64 and toBigUint64", () => {
    test("should preserve precision for 64-bit BigInts", () => {
      const max = 9223372036854775807n
      expect(new BigIntCoercion(max).toBigInt64()).toBe(max)
    })

    test("should wrap at 64-bit boundary", () => {
      const overflow = 9223372036854775808n
      expect(new BigIntCoercion(overflow).toBigInt64()).toBe(
        -9223372036854775808n,
      )
    })

    test("should handle unsigned 64-bit", () => {
      const max = 18446744073709551615n
      expect(new BigIntCoercion(max).toBigUint64()).toBe(max)
      expect(new BigIntCoercion(max + 1n).toBigUint64()).toBe(0n)
    })

    test("should wrap negative to positive for unsigned", () => {
      expect(new BigIntCoercion(-1n).toBigUint64()).toBe(18446744073709551615n)
    })
  })

  describe("toChar", () => {
    test("should convert to ASCII characters", () => {
      expect(new BigIntCoercion(65n).toChar()).toBe("A")
      expect(new BigIntCoercion(97n).toChar()).toBe("a")
      expect(new BigIntCoercion(48n).toChar()).toBe("0")
    })

    test("should convert to Unicode characters", () => {
      expect(new BigIntCoercion(8364n).toChar()).toBe("€") // Euro sign
      expect(new BigIntCoercion(9731n).toChar()).toBe("☃") // Snowman
    })

    test("should wrap at 16-bit boundary", () => {
      expect(new BigIntCoercion(65536n).toChar()).toBe("\u0000")
      expect(new BigIntCoercion(65537n).toChar()).toBe("\u0001")
    })

    test("should handle zero", () => {
      expect(new BigIntCoercion(0n).toChar()).toBe("\u0000")
    })
  })

  describe("toCodePoint", () => {
    test("should convert to ASCII characters", () => {
      expect(new BigIntCoercion(65n).toCodePoint()).toBe("A")
      expect(new BigIntCoercion(97n).toCodePoint()).toBe("a")
    })

    test("should handle emoji and high Unicode", () => {
      expect(new BigIntCoercion(128512n).toCodePoint()).toBe("😀")
      expect(new BigIntCoercion(127775n).toCodePoint()).toBe("🌟")
      expect(new BigIntCoercion(129409n).toCodePoint()).toBe("🦁")
    })

    test("should handle full Unicode range", () => {
      expect(new BigIntCoercion(0x1f600n).toCodePoint()).toBe("😀")
      expect(new BigIntCoercion(0x1f4a9n).toCodePoint()).toBe("💩")
    })
  })

  describe("toNumber", () => {
    test("should convert to Number", () => {
      expect(new BigIntCoercion(42n).toNumber()).toBe(42)
      expect(new BigIntCoercion(-42n).toNumber()).toBe(-42)
      expect(new BigIntCoercion(0n).toNumber()).toBe(0)
    })

    test("should handle safe integers exactly", () => {
      expect(new BigIntCoercion(9007199254740991n).toNumber()).toBe(
        9007199254740991,
      )
      expect(new BigIntCoercion(-9007199254740991n).toNumber()).toBe(
        -9007199254740991,
      )
    })

    test("should convert large values (may lose precision)", () => {
      const large = 9007199254740992n
      const result = new BigIntCoercion(large).toNumber()
      expect(typeof result).toBe("number")
    })
  })

  describe("toHex", () => {
    test("should convert to hex with prefix", () => {
      expect(new BigIntCoercion(255n).toHex()).toBe("0xff")
      expect(new BigIntCoercion(4096n).toHex()).toBe("0x1000")
      expect(new BigIntCoercion(0n).toHex()).toBe("0x0")
    })

    test("should convert to hex without prefix", () => {
      expect(new BigIntCoercion(255n).toHex(false)).toBe("ff")
      expect(new BigIntCoercion(4096n).toHex(false)).toBe("1000")
    })

    test("should handle negative values", () => {
      expect(new BigIntCoercion(-1n).toHex()).toContain("-")
      expect(new BigIntCoercion(-255n).toHex()).toContain("-")
    })
  })

  describe("toBinary", () => {
    test("should convert to binary with prefix", () => {
      expect(new BigIntCoercion(5n).toBinary()).toBe("0b101")
      expect(new BigIntCoercion(255n).toBinary()).toBe("0b11111111")
      expect(new BigIntCoercion(0n).toBinary()).toBe("0b0")
    })

    test("should convert to binary without prefix", () => {
      expect(new BigIntCoercion(5n).toBinary(false)).toBe("101")
      expect(new BigIntCoercion(255n).toBinary(false)).toBe("11111111")
    })

    test("should handle powers of 2", () => {
      expect(new BigIntCoercion(1n).toBinary()).toBe("0b1")
      expect(new BigIntCoercion(2n).toBinary()).toBe("0b10")
      expect(new BigIntCoercion(4n).toBinary()).toBe("0b100")
      expect(new BigIntCoercion(8n).toBinary()).toBe("0b1000")
    })
  })

  describe("toOctal", () => {
    test("should convert to octal with prefix", () => {
      expect(new BigIntCoercion(8n).toOctal()).toBe("0o10")
      expect(new BigIntCoercion(511n).toOctal()).toBe("0o777")
      expect(new BigIntCoercion(0n).toOctal()).toBe("0o0")
    })

    test("should convert to octal without prefix", () => {
      expect(new BigIntCoercion(8n).toOctal(false)).toBe("10")
      expect(new BigIntCoercion(511n).toOctal(false)).toBe("777")
    })

    test("should handle various values", () => {
      expect(new BigIntCoercion(64n).toOctal()).toBe("0o100")
      expect(new BigIntCoercion(512n).toOctal()).toBe("0o1000")
    })
  })

  describe("toString", () => {
    test("should convert to string in base 10", () => {
      expect(new BigIntCoercion(42n).toString()).toBe("42")
      expect(new BigIntCoercion(-42n).toString()).toBe("-42")
      expect(new BigIntCoercion(0n).toString()).toBe("0")
    })

    test("should convert to string in different bases", () => {
      expect(new BigIntCoercion(42n).toString(16)).toBe("2a")
      expect(new BigIntCoercion(42n).toString(2)).toBe("101010")
      expect(new BigIntCoercion(42n).toString(8)).toBe("52")
      expect(new BigIntCoercion(42n).toString(36)).toBe("16")
    })

    test("should handle large numbers", () => {
      const large = 123456789012345678901234567890n
      expect(new BigIntCoercion(large).toString()).toBe(large.toString())
    })
  })

  describe("isZero", () => {
    test("should return true for zero", () => {
      expect(new BigIntCoercion(0n).isZero()).toBe(true)
    })

    test("should return false for non-zero", () => {
      expect(new BigIntCoercion(1n).isZero()).toBe(false)
      expect(new BigIntCoercion(-1n).isZero()).toBe(false)
      expect(new BigIntCoercion(999n).isZero()).toBe(false)
    })
  })

  describe("isPositive", () => {
    test("should return true for positive values", () => {
      expect(new BigIntCoercion(1n).isPositive()).toBe(true)
      expect(new BigIntCoercion(999n).isPositive()).toBe(true)
    })

    test("should return false for zero and negative", () => {
      expect(new BigIntCoercion(0n).isPositive()).toBe(false)
      expect(new BigIntCoercion(-1n).isPositive()).toBe(false)
    })
  })

  describe("equals", () => {
    test("should return true for equal BigInts", () => {
      expect(new BigIntCoercion(42n).equals(new BigIntCoercion(42n))).toBe(true)
      expect(new BigIntCoercion(-42n).equals(new BigIntCoercion(-42n))).toBe(
        true,
      )
      expect(new BigIntCoercion(0n).equals(new BigIntCoercion(0n))).toBe(true)
    })

    test("should return false for different BigInts", () => {
      expect(new BigIntCoercion(42n).equals(new BigIntCoercion(43n))).toBe(
        false,
      )
      expect(new BigIntCoercion(-42n).equals(new BigIntCoercion(42n))).toBe(
        false,
      )
      expect(new BigIntCoercion(0n).equals(new BigIntCoercion(1n))).toBe(false)
    })
  })

  describe("isNegative", () => {
    test("should return true for negative values", () => {
      expect(new BigIntCoercion(-1n).isNegative()).toBe(true)
      expect(new BigIntCoercion(-999n).isNegative()).toBe(true)
    })

    test("should return false for zero and positive", () => {
      expect(new BigIntCoercion(0n).isNegative()).toBe(false)
      expect(new BigIntCoercion(1n).isNegative()).toBe(false)
    })
  })

  describe("isEven", () => {
    test("should return true for even values", () => {
      expect(new BigIntCoercion(0n).isEven()).toBe(true)
      expect(new BigIntCoercion(2n).isEven()).toBe(true)
      expect(new BigIntCoercion(-2n).isEven()).toBe(true)
      expect(new BigIntCoercion(1000n).isEven()).toBe(true)
    })

    test("should return false for odd values", () => {
      expect(new BigIntCoercion(1n).isEven()).toBe(false)
      expect(new BigIntCoercion(3n).isEven()).toBe(false)
      expect(new BigIntCoercion(-1n).isEven()).toBe(false)
    })
  })

  describe("isOdd", () => {
    test("should return true for odd values", () => {
      expect(new BigIntCoercion(1n).isOdd()).toBe(true)
      expect(new BigIntCoercion(3n).isOdd()).toBe(true)
      expect(new BigIntCoercion(-1n).isOdd()).toBe(true)
      expect(new BigIntCoercion(999n).isOdd()).toBe(true)
    })

    test("should return false for even values", () => {
      expect(new BigIntCoercion(0n).isOdd()).toBe(false)
      expect(new BigIntCoercion(2n).isOdd()).toBe(false)
      expect(new BigIntCoercion(-2n).isOdd()).toBe(false)
    })
  })

  describe("collision scenarios", () => {
    test("different BigInts can produce same int32", () => {
      const a = new BigIntCoercion(5n)
      const b = new BigIntCoercion(4294967301n) // 5 + 2^32
      expect(a.toInt32()).toBe(b.toInt32())
    })

    test("different BigInts can produce same uint8", () => {
      const a = new BigIntCoercion(10n)
      const b = new BigIntCoercion(266n) // 10 + 256
      expect(a.toUint8()).toBe(b.toUint8())
    })

    test("negative and positive can map to same uint", () => {
      const negative = new BigIntCoercion(-1n)
      const positive = new BigIntCoercion(255n)
      expect(negative.toUint8()).toBe(positive.toUint8())
    })
  })

  describe("edge cases", () => {
    test("should handle maximum safe integer", () => {
      const max = 9007199254740991n
      const bn = new BigIntCoercion(max)
      expect(bn.toNumber()).toBe(Number(max))
      expect(bn.toString()).toBe(max.toString())
    })

    test("should handle minimum safe integer", () => {
      const min = -9007199254740991n
      const bn = new BigIntCoercion(min)
      expect(bn.toNumber()).toBe(Number(min))
      expect(bn.toString()).toBe(min.toString())
    })

    test("should handle very large BigInts", () => {
      const huge = 123456789012345678901234567890n
      const bn = new BigIntCoercion(huge)
      expect(bn.toBigInt()).toBe(huge)
      expect(bn.toString()).toBe(huge.toString())
    })
  })
})
