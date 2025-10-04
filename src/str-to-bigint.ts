import { BigIntCoercion } from "./bigint-coercion"

/**
 * Converts a string into a deterministic BigInt representation using UTF-8 encoding.
 *
 * This function performs a UTF-8-based string-to-BigInt conversion by encoding
 * the input string as UTF-8 bytes and interpreting them as a big-endian BigInt value.
 * The conversion is deterministic and consistent - the same input string will always
 * produce the same BigInt output.
 *
 * **Supported Input Types:**
 * - ASCII strings (e.g., "hello", "123")
 * - Unicode characters (e.g., "é", "你好")
 * - Emojis and multi-byte characters (e.g., "🚀", "👨‍👩‍👧‍👦")
 * - Empty strings (returns 0n)
 * - Special characters and symbols (e.g., "!@#$%", "™®©")
 *
 * **Algorithm Details:**
 * 1. Validates that the input is a string type
 * 2. Encodes the string into UTF-8 bytes using TextEncoder
 * 3. Converts each byte to a hexadecimal representation
 * 4. Concatenates the hex values into a single hex string (big-endian)
 * 5. Parses the hex string as a BigInt
 *
 * **Use Cases:**
 * - Generating deterministic numeric identifiers from strings
 * - Creating hash-like values for strings that need to be compared numerically
 * - Converting string seeds to numeric values for algorithms
 * - Building consistent numeric representations across different platforms
 *
 * @param {string} seed - The input string to convert. Must be a valid string type.
 *                        Can be any valid JavaScript string including Unicode characters.
 * @param {TextEncoder} [encoder] - Optional TextEncoder instance to use for UTF-8 encoding.
 *                                  If not provided, a new TextEncoder will be created.
 *                                  Providing your own encoder can improve performance when
 *                                  calling this function frequently by reusing the same instance.
 * @returns {BigIntCoercion} A BigIntCoercion instance wrapping the resulting BigInt value.
 *                           Use `.toBigInt()` to extract the raw BigInt, or other methods
 *                           to convert to different numeric types (e.g., `.toInt32()`, `.toUint8()`).
 * @throws {TypeError} If the input is not a string type. The error message will include
 *                     the actual type received and the value for debugging purposes.
 *
 * @example
 * // Basic ASCII string conversion
 * stringToBigInt("hello").toBigInt();
 * // Returns: 448378203247n
 *
 * @example
 * // Empty string handling
 * stringToBigInt("").toBigInt();
 * // Returns: 0n
 *
 * @example
 * // Emoji and multi-byte character support
 * stringToBigInt("🚀").toBigInt();
 * // Returns: 4036991616n (UTF-8 encoding: 0xF0 0x9F 0x9A 0x80)
 *
 * @example
 * // Converting to different numeric types
 * const coercion = stringToBigInt("A");
 * coercion.toBigInt();   // 65n (raw BigInt)
 * coercion.toInt32();    // 65 (32-bit integer)
 * coercion.toUint8();    // 65 (8-bit unsigned integer)
 *
 * @example
 * // Deterministic behavior - same input always produces same output
 * const value1 = stringToBigInt("test").toBigInt();
 * const value2 = stringToBigInt("test").toBigInt();
 * console.log(value1 === value2); // true
 *
 * @example
 * // Using a custom encoder for better performance in loops
 * const encoder = new TextEncoder();
 * for (const str of largeArray) {
 *   const value = stringToBigInt(str, encoder);
 *   // Process value...
 * }
 */
export function stringToBigInt(
  seed: string,
  encoder?: TextEncoder,
): BigIntCoercion {
  // Step 1: Validate input type
  // Ensure the input is a string to prevent unexpected behavior with other types.
  // This guard prevents runtime errors when calling string-specific methods.
  if (typeof seed !== "string") {
    throw new TypeError(
      `Expected a string, but received ${typeof seed}. Value: ${String(seed)}`,
    )
  }

  // Step 2: Handle empty string as a special case
  // An empty string has no bytes to encode, so we return 0n immediately
  // rather than processing an empty byte array. This is both more efficient
  // and semantically correct (empty input → zero value).
  if (seed.length === 0) {
    return new BigIntCoercion(0n)
  }

  // Step 3: Encode the string to UTF-8 bytes
  // TextEncoder converts the JavaScript string (UTF-16) into a UTF-8 byte sequence.
  // This properly handles:
  // - ASCII characters (1 byte each)
  // - Extended Latin and most common scripts (2-3 bytes)
  // - Emojis and rare characters (4 bytes)
  // - Surrogate pairs and combining characters
  // Use the provided encoder or create a new one if not provided
  const textEncoder = encoder ?? new TextEncoder()
  const encoded = textEncoder.encode(seed)

  // Step 4: Convert byte array to hexadecimal string
  // Each byte (0-255) is converted to a 2-digit hex string (00-ff).
  // The padStart ensures single-digit hex values (e.g., 0x0a) are properly
  // formatted with a leading zero, maintaining big-endian byte order.
  // Example: [0x68, 0x65, 0x6c, 0x6c, 0x6f] → "68656c6c6f"
  const hex = Array.from(encoded)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

  // Step 5: Parse the hexadecimal string as a BigInt
  // The '0x' prefix tells the BigInt constructor to interpret the string as
  // a hexadecimal number. This creates a big-endian integer representation
  // where the leftmost bytes are the most significant.
  // Example: "0x68656c6c6f" → 448378203247n
  return new BigIntCoercion(BigInt("0x" + hex))
}
