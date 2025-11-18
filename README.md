# k-number-utils

A TypeScript utility library for advanced mathematical operations, including BigInt conversions, type-safe numeric coercions, and deterministic string-to-number transformations.

## Features

- 🎯 **`BigIntCoercion`** - Comprehensive BigInt wrapper with 25+ conversion methods
- 🔄 **`stringToBigInt`** - Deterministic string-to-BigInt converter using UTF-8 encoding
- 🛡️ **Type-safe** - Full TypeScript support with proper type annotations
- ⚡ **Performance optimized** - Efficient conversions with minimal overhead
- 🌐 **Unicode support** - Properly handles all Unicode characters including emojis

## Installation

```bash
npm install k-number-utils
```

## Table of Contents

- [BigIntCoercion Class](#bigintcoercion-class)
- [stringToBigInt Function](#stringtobigint-function)
- [Use Cases](#use-cases)
- [Browser Compatibility](#browser-and-nodejs-compatibility)

---

## BigIntCoercion Class

A comprehensive class for coercing BigInt values to multiple numeric formats with predictable overflow/underflow behavior.

### Overview

The `BigIntCoercion` class wraps a BigInt value and provides methods to convert it to various numeric types with different bit widths. It handles overflow and wrapping according to each numeric type's specifications.

**Note**: Collision risk is expected when converting large BigInt values to smaller numeric types due to truncation and wrapping behavior.

### Constructor

```typescript
new BigIntCoercion(value: bigint)
```

**Example:**

```typescript
import { BigIntCoercion } from "k-number-utils"

const bn = new BigIntCoercion(123456789n)
const large = new BigIntCoercion(BigInt("999999999999999999"))
```

### Core Methods

#### `toBigInt(): bigint`

Returns the original BigInt value.

```typescript
new BigIntCoercion(123n).toBigInt() // 123n
```

#### `toNumber(): number`

Converts to a JavaScript Number. **Warning**: May lose precision for values outside ±2^53 - 1.

```typescript
new BigIntCoercion(42n).toNumber() // 42
new BigIntCoercion(9007199254740992n).toNumber() // May lose precision
```

### Integer Conversion Methods

#### 8-bit Conversions

##### `toInt8(): number`

Converts to signed 8-bit integer (-128 to 127).

```typescript
new BigIntCoercion(127n).toInt8() // 127
new BigIntCoercion(128n).toInt8() // -128 (wrapped)
new BigIntCoercion(-129n).toInt8() // 127 (wrapped)
```

##### `toUint8(): number`

Converts to unsigned 8-bit integer (0 to 255).

```typescript
new BigIntCoercion(255n).toUint8() // 255
new BigIntCoercion(256n).toUint8() // 0 (wrapped)
new BigIntCoercion(-1n).toUint8() // 255 (wrapped)
```

#### 16-bit Conversions

##### `toInt16(): number`

Converts to signed 16-bit integer (-32768 to 32767).

```typescript
new BigIntCoercion(32767n).toInt16() // 32767
new BigIntCoercion(32768n).toInt16() // -32768 (wrapped)
```

##### `toUint16(): number`

Converts to unsigned 16-bit integer (0 to 65535).

```typescript
new BigIntCoercion(65535n).toUint16() // 65535
new BigIntCoercion(65536n).toUint16() // 0 (wrapped)
```

#### 32-bit Conversions

##### `toInt32(): number`

Converts to signed 32-bit integer (-2147483648 to 2147483647).

```typescript
new BigIntCoercion(2147483647n).toInt32() // 2147483647
new BigIntCoercion(2147483648n).toInt32() // -2147483648 (wrapped)
```

##### `toUint32(): number`

Converts to unsigned 32-bit integer (0 to 4294967295).

```typescript
new BigIntCoercion(4294967295n).toUint32() // 4294967295
new BigIntCoercion(-1n).toUint32() // 4294967295 (wrapped)
```

##### `toAbsInt32(): number` ⭐ NEW

Converts to absolute value clamped to positive signed 32-bit range (0 to 2147483647).

```typescript
new BigIntCoercion(123n).toAbsInt32() // 123
new BigIntCoercion(-123n).toAbsInt32() // 123 (absolute)
new BigIntCoercion(2147483647n).toAbsInt32() // 2147483647 (max)
new BigIntCoercion(2147483648n).toAbsInt32() // 0 (wrapped)
```

#### 64-bit Conversions

##### `toInt64(): number` / `toUint64(): number`

Converts to 64-bit integers as numbers. **Warning**: Precision loss beyond ±2^53.

```typescript
new BigIntCoercion(9007199254740991n).toInt64() // Exact
new BigIntCoercion(9007199254740992n).toInt64() // May lose precision
```

##### `toBigInt64(): bigint` / `toBigUint64(): bigint`

Converts to precise 64-bit BigInt values (preferred for 64-bit operations).

```typescript
new BigIntCoercion(9223372036854775807n).toBigInt64() // 9223372036854775807n
new BigIntCoercion(9223372036854775808n).toBigInt64() // -9223372036854775808n (wrapped)

new BigIntCoercion(18446744073709551615n).toBigUint64() // 18446744073709551615n
new BigIntCoercion(-1n).toBigUint64() // 18446744073709551615n (wrapped)
```

### Character and String Methods

#### `toChar(): string`

Converts to a Unicode character using the lower 16 bits.

```typescript
new BigIntCoercion(65n).toChar() // 'A'
new BigIntCoercion(8364n).toChar() // '€' (Euro sign)
```

#### `toCodePoint(): string`

Converts to a full Unicode character using the lower 21 bits (supports emojis).

```typescript
new BigIntCoercion(65n).toCodePoint() // 'A'
new BigIntCoercion(128512n).toCodePoint() // '😀' (emoji)
new BigIntCoercion(127775n).toCodePoint() // '🌟' (star emoji)
```

#### `toHex(prefix?: boolean): string`

Converts to hexadecimal string representation.

```typescript
new BigIntCoercion(255n).toHex() // '0xff'
new BigIntCoercion(255n).toHex(false) // 'ff'
new BigIntCoercion(4096n).toHex() // '0x1000'
```

#### `toBinary(prefix?: boolean): string`

Converts to binary string representation.

```typescript
new BigIntCoercion(5n).toBinary() // '0b101'
new BigIntCoercion(5n).toBinary(false) // '101'
new BigIntCoercion(255n).toBinary() // '0b11111111'
```

#### `toOctal(prefix?: boolean): string`

Converts to octal string representation.

```typescript
new BigIntCoercion(8n).toOctal() // '0o10'
new BigIntCoercion(8n).toOctal(false) // '10'
new BigIntCoercion(511n).toOctal() // '0o777'
```

#### `toString(radix?: number): string`

Converts to string in any base (2-36).

```typescript
new BigIntCoercion(42n).toString() // '42'
new BigIntCoercion(42n).toString(16) // '2a'
new BigIntCoercion(42n).toString(2) // '101010'
```

### Utility Methods

#### `isZero(): boolean`

```typescript
new BigIntCoercion(0n).isZero() // true
new BigIntCoercion(1n).isZero() // false
```

#### `isPositive(): boolean`

```typescript
new BigIntCoercion(1n).isPositive() // true
new BigIntCoercion(-1n).isPositive() // false
```

#### `isNegative(): boolean`

```typescript
new BigIntCoercion(-1n).isNegative() // true
new BigIntCoercion(1n).isNegative() // false
```

#### `isEven(): boolean`

```typescript
new BigIntCoercion(2n).isEven() // true
new BigIntCoercion(3n).isEven() // false
```

#### `isOdd(): boolean`

```typescript
new BigIntCoercion(3n).isOdd() // true
new BigIntCoercion(2n).isOdd() // false
```

#### `equals(other: BigIntCoercion): boolean`

```typescript
const a = new BigIntCoercion(42n)
const b = new BigIntCoercion(42n)
a.equals(b) // true
```

---

## stringToBigInt Function

### `stringToBigInt(seed: string, encoder?: TextEncoder): BigIntCoercion`

Converts a string into a deterministic `BigIntCoercion` instance using UTF-8 encoding and big-endian representation.

This function encodes the input string as UTF-8 bytes and converts them into a big-endian BigInt representation wrapped in a `BigIntCoercion` instance. It properly handles all Unicode characters including emojis, special characters, and multi-byte sequences.

**Parameters:**

- `seed` (string): The input string to convert
- `encoder` (TextEncoder, optional): Custom TextEncoder instance for UTF-8 encoding. If not provided, a new TextEncoder will be created. Reusing an encoder instance can improve performance when calling this function frequently.

### Usage

```typescript
import { stringToBigInt } from "k-number-utils"

// Basic ASCII string - returns BigIntCoercion instance
const hello = stringToBigInt("hello")
hello.toBigInt() // 448378203247n
hello.toInt32() // 1701604463
hello.toUint8() // 111 (lower 8 bits)

// Single character
stringToBigInt("A").toBigInt() // 65n
stringToBigInt("A").toUint8() // 65

// Empty string
stringToBigInt("").toBigInt() // 0n

// Unicode emoji
// Emoji and multi-byte character support
stringToBigInt("🚀").toBigInt() // 4036991616n
stringToBigInt("🚀").toInt32() // -257975680

// Chinese characters
stringToBigInt("你好").toBigInt() // 251503099356605n
stringToBigInt("你好").toChar() // 'ꖽ' (lower 16 bits)

// Mixed content
const mixed = stringToBigInt("Hello 🌍")
mixed.toBigInt() // Large BigInt value
mixed.toHex() // Hexadecimal representation
mixed.isPositive() // true
```

### Advanced Usage Examples

#### Converting to Multiple Formats

```typescript
const input = stringToBigInt("test")

// Get different representations
const bigint = input.toBigInt() // Raw BigInt
const hex = input.toHex() // Hexadecimal string
const int32 = input.toInt32() // 32-bit signed integer
const uint8 = input.toUint8() // 8-bit unsigned byte
const char = input.toChar() // Unicode character
const binary = input.toBinary() // Binary string
```

#### Using as Hash Alternative

```typescript
// Generate deterministic numeric IDs from strings
function generateId(name: string): number {
  return stringToBigInt(name).toUint32()
}

generateId("user123") // Always returns the same value
generateId("admin") // Different value
```

#### Performance Optimization with Reusable Encoder

```typescript
// Create a reusable encoder for better performance in loops
const encoder = new TextEncoder()

// Process multiple strings efficiently
const ids = ["user1", "user2", "user3"].map((name) =>
  stringToBigInt(name, encoder).toUint32(),
)

// Or in a hot path
function processLargeDataset(items: string[]) {
  const encoder = new TextEncoder()
  return items.map((item) => stringToBigInt(item, encoder).toBigInt())
}
```

#### Type Coercion Chain

```typescript
// Chain conversions for specific use cases
const value = stringToBigInt("🎯 Target").toBigInt() // Get raw BigInt

const hash = stringToBigInt("password").toAbsInt32() // Get positive 32-bit hash

const byte = stringToBigInt("A").toUint8() // Get single byte (65)
```

### Features

- ✅ **Type-safe**: Returns `BigIntCoercion` instance with 25+ conversion methods
- ✅ **Input validation**: Throws `TypeError` for non-string inputs
- ✅ **Unicode support**: Properly handles all Unicode characters including emojis and multi-byte sequences
- ✅ **Deterministic**: Always returns the same BigInt for the same input string
- ✅ **Big-endian encoding**: Maintains proper byte order for consistent results
- ✅ **Empty string handling**: Returns `BigIntCoercion(0n)` for empty strings
- ✅ **Performance optimized**: Early returns for edge cases

### Error Handling

The function throws a `TypeError` if the input is not a string:

```typescript
stringToBigInt(null) // TypeError: Expected a string, but received object
stringToBigInt(undefined) // TypeError: Expected a string, but received undefined
stringToBigInt(123) // TypeError: Expected a string, but received number
```

### Implementation Details

The function uses the following approach:

1. **Validation**: Ensures the input is a valid string type
2. **UTF-8 Encoding**: Uses `TextEncoder` to convert the string to UTF-8 bytes
3. **Hex Conversion**: Converts each byte to a 2-digit hexadecimal string
4. **BigInt Creation**: Combines the hex string and converts to BigInt
5. **Wrapping**: Returns a `BigIntCoercion` instance for flexible type conversions

This ensures:

- Consistent encoding across all JavaScript environments
- Proper handling of Unicode characters and surrogate pairs
- Big-endian byte order for predictable results
- Maximum compatibility with web and Node.js environments
- Flexible output format through `BigIntCoercion` methods

---

## Use Cases

### Deterministic Hashing (when a full hash function is overkill)

Convert strings to numeric values for consistent identification. Ideally suited for scenarios where a simple, deterministic numeric representation is needed without cryptographic guarantees:

```typescript
const userId = stringToBigInt("user@example.com").toUint32()
const sessionId = stringToBigInt("session-token-xyz").toAbsInt32()
```

### Random Number Seeding

Generate numeric seeds from string inputs:

```typescript
function seededRandom(seed: string): number {
  const value = stringToBigInt(seed).toUint32()
  return value / 0xffffffff // Normalize to [0, 1)
}
```

### Data Encoding

Convert text data into various numeric representations:

```typescript
const bytes = stringToBigInt("Hello").toUint8() // Single byte
const int32 = stringToBigInt("Hello").toInt32() // 32-bit int
const hex = stringToBigInt("Hello").toHex() // Hex string
```

### Collision-Resistant IDs

Generate numeric IDs with controllable collision space:

```typescript
// 8-bit space (256 possible values) - high collision risk
const smallId = stringToBigInt("item-123").toUint8()

// 32-bit space (4.2B values) - low collision risk
const largeId = stringToBigInt("item-123").toUint32()
```

### Performance Considerations

- By default, the function creates a new `TextEncoder` instance for each call
- **Optimization**: Pass a reusable `TextEncoder` instance as the second parameter for better performance in hot paths or loops
- For extremely frequent calls, consider caching results if the same strings are processed repeatedly
- For very long strings (>10MB), consider processing in chunks
- `BigIntCoercion` methods are optimized and have minimal overhead

**Example optimization:**

```typescript
// ❌ Less efficient - creates new encoder each time
for (let i = 0; i < 10000; i++) {
  stringToBigInt(items[i])
}

// ✅ More efficient - reuses encoder
const encoder = new TextEncoder()
for (let i = 0; i < 10000; i++) {
  stringToBigInt(items[i], encoder)
}
```

---

## Browser and Node.js Compatibility

**Minimum Requirements:**

- ✅ Node.js 11.0.0+ (BigInt and TextEncoder support)
- ✅ Chrome 67+
- ✅ Firefox 68+
- ✅ Safari 14+
- ✅ Edge 79+

**Features Used:**

- `BigInt` - Native support for arbitrary precision integers
- `TextEncoder` - UTF-8 encoding API (available in all modern environments)
- `BigInt.asIntN()` / `BigInt.asUintN()` - Bit truncation methods

---

## API Reference Summary

### BigIntCoercion Class

| Method              | Return Type | Range/Description                           |
| ------------------- | ----------- | ------------------------------------------- |
| `toBigInt()`        | `bigint`    | Original BigInt value                       |
| `toNumber()`        | `number`    | JavaScript Number (may lose precision)      |
| `toInt8()`          | `number`    | -128 to 127                                 |
| `toUint8()`         | `number`    | 0 to 255                                    |
| `toInt16()`         | `number`    | -32768 to 32767                             |
| `toUint16()`        | `number`    | 0 to 65535                                  |
| `toInt32()`         | `number`    | -2147483648 to 2147483647                   |
| `toUint32()`        | `number`    | 0 to 4294967295                             |
| `toAbsInt32()`      | `number`    | 0 to 2147483647 (absolute + 31-bit)         |
| `toInt64()`         | `number`    | 64-bit signed (precision loss warning)      |
| `toUint64()`        | `number`    | 64-bit unsigned (precision loss warning)    |
| `toBigInt64()`      | `bigint`    | 64-bit signed BigInt (precise)              |
| `toBigUint64()`     | `bigint`    | 64-bit unsigned BigInt (precise)            |
| `toChar()`          | `string`    | Unicode character (16-bit code point)       |
| `toCodePoint()`     | `string`    | Unicode character (21-bit, supports emojis) |
| `toHex(prefix?)`    | `string`    | Hexadecimal string                          |
| `toBinary(prefix?)` | `string`    | Binary string                               |
| `toOctal(prefix?)`  | `string`    | Octal string                                |
| `toString(radix?)`  | `string`    | String in any base (2-36)                   |
| `isZero()`          | `boolean`   | Check if value is 0n                        |
| `isPositive()`      | `boolean`   | Check if value > 0n                         |
| `isNegative()`      | `boolean`   | Check if value < 0n                         |
| `isEven()`          | `boolean`   | Check if value is even                      |
| `isOdd()`           | `boolean`   | Check if value is odd                       |
| `equals(other)`     | `boolean`   | Compare with another BigIntCoercion         |

### Functions

| Function           | Parameters                            | Returns          | Description                                            |
| ------------------ | ------------------------------------- | ---------------- | ------------------------------------------------------ |
| `stringToBigInt()` | `seed: string, encoder?: TextEncoder` | `BigIntCoercion` | Converts string to BigIntCoercion using UTF-8 encoding |

---

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ by [@21no.de](https://21no.de) for the JavaScript/TypeScript community**
