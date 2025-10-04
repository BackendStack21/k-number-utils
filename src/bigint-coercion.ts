/**
 * A class for coercing BigInt values to multiple numeric formats.
 *
 * This class wraps a BigInt value and provides methods to convert it to various
 * numeric types with different bit widths. Note that collision risk is expected
 * when converting large BigInt values to smaller numeric types due to truncation
 * and wrapping behavior.
 *
 * @example
 * const bn = new BigIntCoercion(123456789n);
 * bn.toInt32();     // 123456789
 * bn.toUint8();     // 21 (truncated to 8 bits)
 * bn.toChar();      // '촕' (Unicode character from lower 16 bits)
 *
 * @example
 * // Collision example - large values wrap around
 * const large = new BigIntCoercion(9999999999n);
 * large.toInt32();  // 1410065407 (wrapped due to 32-bit limit)
 */
export class BigIntCoercion {
  private readonly value: bigint

  /**
   * Creates a new BigIntCoercion instance.
   *
   * @param {bigint} value - The BigInt value to be coerced to various numeric formats.
   * @throws {TypeError} If the value is not a BigInt.
   *
   * @example
   * const bn = new BigIntCoercion(42n);
   *
   * @example
   * const bn = new BigIntCoercion(BigInt("999999999999999999"));
   */
  constructor(value: bigint) {
    if (typeof value !== "bigint") {
      throw new TypeError(
        `Expected a bigint, but received ${typeof value}. Value: ${String(value)}`,
      )
    }
    this.value = value
  }

  /**
   * Compares this BigIntCoercion instance with another for equality.
   * Two instances are equal if their underlying BigInt values are identical.
   *
   * @param other - Another BigIntCoercion instance to compare with.
   * @returns {boolean} True if the values are equal, false otherwise.
   */
  equals(other: BigIntCoercion): boolean {
    return this.value === other.value
  }

  /**
   * Gets the original BigInt value.
   *
   * @returns {bigint} The original BigInt value.
   *
   * @example
   * const bn = new BigIntCoercion(123n);
   * bn.toBigInt(); // 123n
   */
  toBigInt(): bigint {
    return this.value
  }

  /**
   * Converts the BigInt to a signed 8-bit integer (-128 to 127).
   * Values outside this range will wrap around.
   *
   * @returns {number} The value as a signed 8-bit integer.
   *
   * @example
   * new BigIntCoercion(127n).toInt8();   // 127
   * new BigIntCoercion(128n).toInt8();   // -128 (wrapped)
   * new BigIntCoercion(-129n).toInt8();  // 127 (wrapped)
   */
  toInt8(): number {
    return Number(BigInt.asIntN(8, this.value))
  }

  /**
   * Converts the BigInt to an unsigned 8-bit integer (0 to 255).
   * Values outside this range will wrap around.
   *
   * @returns {number} The value as an unsigned 8-bit integer.
   *
   * @example
   * new BigIntCoercion(255n).toUint8();   // 255
   * new BigIntCoercion(256n).toUint8();   // 0 (wrapped)
   * new BigIntCoercion(-1n).toUint8();    // 255 (wrapped)
   */
  toUint8(): number {
    return Number(BigInt.asUintN(8, this.value))
  }

  /**
   * Converts the BigInt to a signed 16-bit integer (-32768 to 32767).
   * Values outside this range will wrap around.
   *
   * @returns {number} The value as a signed 16-bit integer.
   *
   * @example
   * new BigIntCoercion(32767n).toInt16();   // 32767
   * new BigIntCoercion(32768n).toInt16();   // -32768 (wrapped)
   * new BigIntCoercion(-32769n).toInt16();  // 32767 (wrapped)
   */
  toInt16(): number {
    return Number(BigInt.asIntN(16, this.value))
  }

  /**
   * Converts the BigInt to an unsigned 16-bit integer (0 to 65535).
   * Values outside this range will wrap around.
   *
   * @returns {number} The value as an unsigned 16-bit integer.
   *
   * @example
   * new BigIntCoercion(65535n).toUint16();  // 65535
   * new BigIntCoercion(65536n).toUint16();  // 0 (wrapped)
   * new BigIntCoercion(-1n).toUint16();     // 65535 (wrapped)
   */
  toUint16(): number {
    return Number(BigInt.asUintN(16, this.value))
  }

  /**
   * Converts the BigInt to a signed 32-bit integer (-2147483648 to 2147483647).
   * Values outside this range will wrap around.
   *
   * @returns {number} The value as a signed 32-bit integer.
   *
   * @example
   * new BigIntCoercion(2147483647n).toInt32();   // 2147483647
   * new BigIntCoercion(2147483648n).toInt32();   // -2147483648 (wrapped)
   * new BigIntCoercion(-2147483649n).toInt32();  // 2147483647 (wrapped)
   */
  toInt32(): number {
    return Number(BigInt.asIntN(32, this.value))
  }

  /**
   * Converts the BigInt to an unsigned 32-bit integer (0 to 4294967295).
   * Values outside this range will wrap around.
   *
   * @returns {number} The value as an unsigned 32-bit integer.
   *
   * @example
   * new BigIntCoercion(4294967295n).toUint32();  // 4294967295
   * new BigIntCoercion(4294967296n).toUint32();  // 0 (wrapped)
   * new BigIntCoercion(-1n).toUint32();          // 4294967295 (wrapped)
   */
  toUint32(): number {
    return Number(BigInt.asUintN(32, this.value))
  }

  /**
   * Converts the BigInt to its absolute value clamped to positive signed 32-bit range (0 to 2147483647).
   * Takes the absolute value first, then applies 31-bit unsigned truncation.
   * Values larger than 2147483647 will wrap around within the 31-bit range.
   *
   * @returns {number} The absolute value as a positive integer in range [0, 2147483647].
   *
   * @example
   * new BigIntCoercion(123n).toAbsInt32();           // 123
   * new BigIntCoercion(-123n).toAbsInt32();          // 123
   * new BigIntCoercion(2147483647n).toAbsInt32();    // 2147483647 (max value)
   * new BigIntCoercion(2147483648n).toAbsInt32();    // 0 (wrapped)
   * new BigIntCoercion(-2147483648n).toAbsInt32();   // 0 (abs then wrapped)
   * new BigIntCoercion(2147483649n).toAbsInt32();    // 1 (wrapped)
   */
  toAbsInt32(): number {
    const abs = this.value < 0n ? -this.value : this.value
    return Number(BigInt.asUintN(31, abs))
  }

  /**
   * Converts the BigInt to a signed 64-bit integer.
   * Note: JavaScript numbers lose precision beyond ±2^53, so this may not
   * be exact for very large values. Use toBigInt64() for precise 64-bit values.
   *
   * @returns {number} The value as a signed 64-bit integer (may lose precision).
   *
   * @example
   * new BigIntCoercion(9007199254740991n).toInt64();  // 9007199254740991 (exact)
   * new BigIntCoercion(9007199254740992n).toInt64();  // 9007199254740992 (may lose precision)
   */
  toInt64(): number {
    return Number(BigInt.asIntN(64, this.value))
  }

  /**
   * Converts the BigInt to an unsigned 64-bit integer.
   * Note: JavaScript numbers lose precision beyond 2^53, so this may not
   * be exact for very large values. Use toBigUint64() for precise 64-bit values.
   *
   * @returns {number} The value as an unsigned 64-bit integer (may lose precision).
   *
   * @example
   * new BigIntCoercion(9007199254740991n).toUint64();  // 9007199254740991 (exact)
   * new BigIntCoercion(9007199254740992n).toUint64();  // 9007199254740992 (may lose precision)
   */
  toUint64(): number {
    return Number(BigInt.asUintN(64, this.value))
  }

  /**
   * Converts the BigInt to a precise signed 64-bit BigInt.
   * This is the preferred method for 64-bit values when precision is important.
   *
   * @returns {bigint} The value as a signed 64-bit BigInt.
   *
   * @example
   * new BigIntCoercion(9223372036854775807n).toBigInt64();  // 9223372036854775807n
   * new BigIntCoercion(9223372036854775808n).toBigInt64();  // -9223372036854775808n (wrapped)
   */
  toBigInt64(): bigint {
    return BigInt.asIntN(64, this.value)
  }

  /**
   * Converts the BigInt to a precise unsigned 64-bit BigInt.
   * This is the preferred method for 64-bit values when precision is important.
   *
   * @returns {bigint} The value as an unsigned 64-bit BigInt.
   *
   * @example
   * new BigIntCoercion(18446744073709551615n).toBigUint64();  // 18446744073709551615n
   * new BigIntCoercion(18446744073709551616n).toBigUint64();  // 0n (wrapped)
   */
  toBigUint64(): bigint {
    return BigInt.asUintN(64, this.value)
  }

  /**
   * Converts the BigInt to a Unicode character based on the lower 16 bits.
   * This uses the unsigned 16-bit value as a Unicode code point.
   *
   * @returns {string} A single Unicode character.
   *
   * @example
   * new BigIntCoercion(65n).toChar();      // 'A'
   * new BigIntCoercion(8364n).toChar();    // '€' (Euro sign)
   * new BigIntCoercion(128512n).toChar();  // '' (wraps to 16 bits: 62976)
   */
  toChar(): string {
    const codePoint = this.toUint16()
    return String.fromCharCode(codePoint)
  }

  /**
   * Converts the BigInt to a full Unicode character using the lower 21 bits.
   * Supports the full Unicode range (U+0000 to U+10FFFF).
   *
   * @returns {string} A Unicode character (may be 1 or 2 UTF-16 code units for surrogate pairs).
   *
   * @example
   * new BigIntCoercion(65n).toCodePoint();       // 'A'
   * new BigIntCoercion(128512n).toCodePoint();   // '😀' (emoji)
   * new BigIntCoercion(127775n).toCodePoint();   // '🌟' (star emoji)
   */
  toCodePoint(): string {
    // Unicode code points are limited to 0x10FFFF (21 bits)
    const codePoint = Number(BigInt.asUintN(21, this.value))
    // Ensure it's within valid Unicode range
    if (codePoint > 0x10ffff) {
      return String.fromCodePoint(codePoint & 0x10ffff)
    }
    return String.fromCodePoint(codePoint)
  }

  /**
   * Converts the BigInt to a JavaScript Number.
   * Warning: May lose precision for values outside the safe integer range
   * (±2^53 - 1 = ±9007199254740991).
   *
   * @returns {number} The value as a JavaScript Number.
   *
   * @example
   * new BigIntCoercion(42n).toNumber();                    // 42
   * new BigIntCoercion(9007199254740991n).toNumber();      // 9007199254740991 (exact)
   * new BigIntCoercion(9007199254740992n).toNumber();      // 9007199254740992 (may lose precision)
   */
  toNumber(): number {
    return Number(this.value)
  }

  /**
   * Converts the BigInt to a hexadecimal string representation.
   *
   * @param {boolean} [prefix=true] - Whether to include the '0x' prefix.
   * @returns {string} The hexadecimal representation.
   *
   * @example
   * new BigIntCoercion(255n).toHex();        // '0xff'
   * new BigIntCoercion(255n).toHex(false);   // 'ff'
   * new BigIntCoercion(4096n).toHex();       // '0x1000'
   */
  toHex(prefix = true): string {
    const hex = this.value.toString(16)
    return prefix ? `0x${hex}` : hex
  }

  /**
   * Converts the BigInt to a binary string representation.
   *
   * @param {boolean} [prefix=true] - Whether to include the '0b' prefix.
   * @returns {string} The binary representation.
   *
   * @example
   * new BigIntCoercion(5n).toBinary();        // '0b101'
   * new BigIntCoercion(5n).toBinary(false);   // '101'
   * new BigIntCoercion(255n).toBinary();      // '0b11111111'
   */
  toBinary(prefix = true): string {
    const binary = this.value.toString(2)
    return prefix ? `0b${binary}` : binary
  }

  /**
   * Converts the BigInt to an octal string representation.
   *
   * @param {boolean} [prefix=true] - Whether to include the '0o' prefix.
   * @returns {string} The octal representation.
   *
   * @example
   * new BigIntCoercion(8n).toOctal();        // '0o10'
   * new BigIntCoercion(8n).toOctal(false);   // '10'
   * new BigIntCoercion(511n).toOctal();      // '0o777'
   */
  toOctal(prefix = true): string {
    const octal = this.value.toString(8)
    return prefix ? `0o${octal}` : octal
  }

  /**
   * Converts the BigInt to a string representation.
   *
   * @param {number} [radix=10] - The base to use (2-36).
   * @returns {string} The string representation.
   *
   * @example
   * new BigIntCoercion(42n).toString();      // '42'
   * new BigIntCoercion(42n).toString(16);    // '2a'
   * new BigIntCoercion(42n).toString(2);     // '101010'
   */
  toString(radix = 10): string {
    return this.value.toString(radix)
  }

  /**
   * Returns a boolean indicating whether the value is zero.
   *
   * @returns {boolean} True if the value is 0n, false otherwise.
   *
   * @example
   * new BigIntCoercion(0n).isZero();    // true
   * new BigIntCoercion(1n).isZero();    // false
   * new BigIntCoercion(-1n).isZero();   // false
   */
  isZero(): boolean {
    return this.value === 0n
  }

  /**
   * Returns a boolean indicating whether the value is positive.
   *
   * @returns {boolean} True if the value is greater than 0n, false otherwise.
   *
   * @example
   * new BigIntCoercion(1n).isPositive();    // true
   * new BigIntCoercion(0n).isPositive();    // false
   * new BigIntCoercion(-1n).isPositive();   // false
   */
  isPositive(): boolean {
    return this.value > 0n
  }

  /**
   * Returns a boolean indicating whether the value is negative.
   *
   * @returns {boolean} True if the value is less than 0n, false otherwise.
   *
   * @example
   * new BigIntCoercion(-1n).isNegative();   // true
   * new BigIntCoercion(0n).isNegative();    // false
   * new BigIntCoercion(1n).isNegative();    // false
   */
  isNegative(): boolean {
    return this.value < 0n
  }

  /**
   * Returns a boolean indicating whether the value is even.
   *
   * @returns {boolean} True if the value is even, false otherwise.
   *
   * @example
   * new BigIntCoercion(2n).isEven();    // true
   * new BigIntCoercion(3n).isEven();    // false
   * new BigIntCoercion(0n).isEven();    // true
   */
  isEven(): boolean {
    return this.value % 2n === 0n
  }

  /**
   * Returns a boolean indicating whether the value is odd.
   *
   * @returns {boolean} True if the value is odd, false otherwise.
   *
   * @example
   * new BigIntCoercion(3n).isOdd();     // true
   * new BigIntCoercion(2n).isOdd();     // false
   * new BigIntCoercion(0n).isOdd();     // false
   */
  isOdd(): boolean {
    return this.value % 2n !== 0n
  }
}
