# http-fields

A modern JavaScript library for parsing and serializing HTTP Structured Field Values ([RFC 8941](https://www.rfc-editor.org/rfc/rfc8941.html) & [RFC 9651](https://www.rfc-editor.org/rfc/rfc9651.html)). Provides bidirectional translation between structured header strings and JSON with full TypeScript support.

See also [badgateway/structured-headers](https://github.com/badgateway/structured-headers)

## Overview

Structured Fields is a specification that defines common data structures for HTTP header and trailer fields. Instead of each HTTP field having its own custom parsing logic, this specification provides a set of well-defined data types and parsing algorithms that can be shared across multiple fields.

This library implements the complete RFC 8941 and RFC 9651 specifications with strict parsing and serialization according to the standards, including support for dates and Unicode display strings.

## Features

- ✅ **Complete RFC 8941 & RFC 9651 Implementation** - All data types and algorithms
- ✅ **TypeScript Support** - Comprehensive type definitions and type guards
- ✅ **Strict Parsing** - Follows RFC's error handling requirements
- ✅ **Bidirectional Translation** - Parse to JSON and serialize back to strings
- ✅ **Extended Data Types** - Dates (@) and Display Strings (%) from RFC 9651
- ✅ **Type Safety** - Full TypeScript definitions with runtime validation
- ✅ **Zero Dependencies** - Pure JavaScript implementation
- ✅ **ES Module Support** - Modern JavaScript module format

## Installation

```bash
npm install http-fields
```

Or include directly in your project:

```javascript
import * as HTTPFields from "./index.mjs";
```

## Quick Start

### JavaScript

```javascript
import * as HTTPFields from "http-fields";

// Parse a list
const list = HTTPFields.parse("sugar, tea, rum", "list");
console.log(list);
// Output: [
//   { value: { type: 'token', value: 'sugar' }, parameters: {} },
//   { value: { type: 'token', value: 'tea' }, parameters: {} },
//   { value: { type: 'token', value: 'rum' }, parameters: {} }
// ]

// Serialize back to string
const serialized = HTTPFields.serialize(list, "list");
console.log(serialized); // "sugar, tea, rum"
```

### TypeScript

```typescript
import * as HTTPFields from "http-fields";
import type { List, Dictionary, Item } from "http-fields/types";

// Parse with type safety
const list: List = HTTPFields.parse("sugar, tea, rum", "list");
const dict: Dictionary = HTTPFields.parse("a=1, b=2", "dictionary");
const item: Item = HTTPFields.parse("@1672531200", "item");

// RFC 9651 features
const date = HTTPFields.date(new Date());
const displayStr = HTTPFields.displayString("Hello 世界");
```

## Data Types

### Basic Types

| Type                          | Description                                                  | Example            | JSON Representation                                       |
| ----------------------------- | ------------------------------------------------------------ | ------------------ | --------------------------------------------------------- |
| **Integer**                   | Signed integer (-999,999,999,999,999 to 999,999,999,999,999) | `42`               | `42`                                                      |
| **Decimal**                   | Decimal number (max 12 integer digits, 3 fractional)         | `3.14`             | `3.14`                                                    |
| **String**                    | Quoted ASCII string                                          | `"hello world"`    | `"hello world"`                                           |
| **Token**                     | Unquoted text identifier                                     | `application/json` | `{ type: 'token', value: 'application/json' }`            |
| **Byte Sequence**             | Base64-encoded binary data                                   | `:SGVsbG8=:`       | `{ type: 'binary', value: 'SGVsbG8=', decoded: 'Hello' }` |
| **Boolean**                   | True or false value                                          | `?1` or `?0`       | `true` or `false`                                         |
| **Date** (RFC 9651)           | Unix timestamp with @ prefix                                 | `@1672531200`      | `{ type: 'date', value: Date }`                           |
| **Display String** (RFC 9651) | Unicode string with % prefix                                 | `%"Hello 世界"`    | `{ type: 'displaystring', value: 'Hello 世界' }`          |

### Structured Types

| Type           | Description                         | Example                |
| -------------- | ----------------------------------- | ---------------------- |
| **List**       | Array of items or inner lists       | `a, b, (c d)`          |
| **Dictionary** | Key-value pairs                     | `a=1, b=2, c`          |
| **Inner List** | Parenthesized list of items         | `(a b c)`              |
| **Parameters** | Semicolon-separated key-value pairs | `;charset=utf-8;q=0.9` |

## API Reference

### Core Methods

#### `parse(fieldValue, fieldType)`

Parses a structured field string into a JSON representation.

**Parameters:**

- `fieldValue` (string): The HTTP field value to parse
- `fieldType` (string): One of `'list'`, `'dictionary'`, or `'item'`

**Returns:** Parsed structure as JSON

**Example:**

```javascript
const result = HTTPFields.parse("a=1, b=2;x=y", "dictionary");
```

#### `serialize(data, fieldType)`

Serializes a JSON structure back to a structured field string.

**Parameters:**

- `data` (any): The data structure to serialize
- `fieldType` (string): One of `'list'`, `'dictionary'`, or `'item'`

**Returns:** Serialized field value string

**Example:**

```javascript
const fieldValue = HTTPFields.serialize(data, "dictionary");
```

### Helper Methods

#### `token(value)`

Creates a token object for use in structured data.

**Parameters:**

- `value` (string): The token string

**Returns:** Token object `{ type: 'token', value: string }`

**Example:**

```javascript
const tokenObj = HTTPFields.token("application/json");
```

#### `binary(base64Value)`

Creates a binary object for use in structured data.

**Parameters:**

- `base64Value` (string): Base64-encoded string

**Returns:** Binary object `{ type: 'binary', value: string }`

**Example:**

```javascript
const binaryObj = HTTPFields.binary("SGVsbG8=");
```

#### `date(dateValue)` - RFC 9651

Creates a date object for use in structured data.

**Parameters:**

- `dateValue` (Date): JavaScript Date object

**Returns:** Date object `{ type: 'date', value: Date }`

**Example:**

```javascript
const dateObj = HTTPFields.date(new Date("2024-01-01"));
// Serializes to: @1704067200
```

#### `displayString(unicodeValue)` - RFC 9651

Creates a display string object for Unicode content.

**Parameters:**

- `unicodeValue` (string): Unicode string

**Returns:** Display string object `{ type: 'displaystring', value: string }`

**Example:**

```javascript
const displayObj = HTTPFields.displayString("Hello 世界");
// Serializes to: %"Hello %e4%b8%96%e7%95%8c"
```

## Examples

### Working with Lists

```javascript
// Parse a simple list
const simpleList = HTTPFields.parse("a, b, c", "list");

// Parse a list with parameters
const listWithParams = HTTPFields.parse("a;x=1, b;y=2", "list");

// Parse a list with inner lists
const complexList = HTTPFields.parse("a, (b c), d", "list");

// Create and serialize a list
const listData = [
  { value: HTTPFields.token("sugar"), parameters: {} },
  { value: HTTPFields.token("tea"), parameters: { quality: 0.8 } },
  {
    value: [
      { value: HTTPFields.token("milk"), parameters: {} },
      { value: HTTPFields.token("honey"), parameters: {} },
    ],
    parameters: { organic: true },
  },
];
const serialized = HTTPFields.serialize(listData, "list");
// Result: "sugar, tea;quality=0.8, (milk honey);organic"
```

### Working with Dictionaries

```javascript
// Parse a dictionary
const dict = HTTPFields.parse(
  "cache=max-age, public, max-age=3600",
  "dictionary"
);

// Parse dictionary with various types
const complexDict = HTTPFields.parse(
  'a=1, b="hello", c=?1, d=(x y)',
  "dictionary"
);

// Create and serialize a dictionary
const dictData = {
  method: { value: HTTPFields.token("GET"), parameters: {} },
  timeout: { value: 30, parameters: { unit: HTTPFields.token("seconds") } },
  secure: { value: true, parameters: {} },
  headers: {
    value: [
      { value: HTTPFields.token("authorization"), parameters: {} },
      { value: HTTPFields.token("content-type"), parameters: {} },
    ],
    parameters: {},
  },
};
const serialized = HTTPFields.serialize(dictData, "dictionary");
```

### Working with Items

```javascript
// Parse a simple item
const item = HTTPFields.parse("42", "item");
// Result: { value: 42, parameters: {} }

// Parse an item with parameters
const itemWithParams = HTTPFields.parse(
  '"hello";charset="utf-8";length=5',
  "item"
);
// Result: {
//   value: "hello",
//   parameters: {
//     charset: "utf-8",
//     length: 5
//   }
// }

// Serialize an item
const itemData = {
  value: HTTPFields.token("application/json"),
  parameters: {
    charset: HTTPFields.token("utf-8"),
    boundary: "----WebKitFormBoundary7MA4YWxkTrZu0gW",
  },
};
const serialized = HTTPFields.serialize(itemData, "item");
// Result: 'application/json;charset=utf-8;boundary="----WebKitFormBoundary7MA4YWxkTrZu0gW"'
```

### Working with Binary Data

```javascript
// Parse binary data
const binary = HTTPFields.parse(":SGVsbG8gV29ybGQ=:", "item");
// Result: {
//   value: {
//     type: 'binary',
//     value: 'SGVsbG8gV29ybGQ=',
//     decoded: 'Hello World'
//   },
//   parameters: {}
// }

// Create binary data
const binaryData = {
  value: HTTPFields.binary(btoa("Hello World")),
  parameters: { encoding: HTTPFields.token("base64") },
};
const serialized = HTTPFields.serialize(binaryData, "item");
// Result: ':SGVsbG8gV29ybGQ=:;encoding=base64'
```

### Working with Dates (RFC 9651)

```javascript
// Parse date values
const dateItem = HTTPFields.parse("@1672531200", "item");
// Result: {
//   value: {
//     type: 'date',
//     value: Date(2023-01-01T00:00:00.000Z)
//   },
//   parameters: {}
// }

// Create and serialize dates
const expiryData = {
  value: HTTPFields.date(new Date("2025-12-31T23:59:59Z")),
  parameters: { timezone: HTTPFields.token("UTC") },
};
const serialized = HTTPFields.serialize(expiryData, "item");
// Result: '@1767225599;timezone=UTC'

// Dates in dictionaries
const timingDict = {
  start: { value: HTTPFields.date(new Date("2024-01-01")), parameters: {} },
  end: { value: HTTPFields.date(new Date("2024-12-31")), parameters: {} },
};
const serializedDict = HTTPFields.serialize(timingDict, "dictionary");
// Result: 'start=@1704067200, end=@1735689600'
```

### Working with Display Strings (RFC 9651)

```javascript
// Parse Unicode display strings
const displayItem = HTTPFields.parse('%"Hello 世界"', "item");
// Result: {
//   value: {
//     type: 'displaystring',
//     value: 'Hello 世界'
//   },
//   parameters: {}
// }

// Create and serialize display strings
const messageData = {
  value: HTTPFields.displayString("Welcome to Tokyo 東京へようこそ"),
  parameters: { lang: HTTPFields.token("ja") },
};
const serialized = HTTPFields.serialize(messageData, "item");
// Result: '%"Welcome to Tokyo %e6%9d%b1%e4%ba%ac%e3%81%b8%e3%82%88%e3%81%86%e3%81%93%e3%81%9d";lang=ja'

// Mixed content with dates and display strings
const eventList = [
  { value: HTTPFields.displayString("Conference 会議"), parameters: {} },
  { value: HTTPFields.date(new Date("2024-06-15T09:00:00Z")), parameters: {} },
  { value: HTTPFields.token("tokyo-convention-center"), parameters: {} },
];
const serializedList = HTTPFields.serialize(eventList, "list");
// Result: '%"Conference %e4%bc%9a%e8%ad%b0", @1718442000, tokyo-convention-center'
```

## Working with Standard Headers Object

The library integrates seamlessly with the standard Web API `Headers` object used in `fetch()`, service workers, and other web APIs:

### Reading Headers from HTTP Requests/Responses

```javascript
// Working with fetch Response headers
async function handleResponse(response) {
  const headers = response.headers;

  // Parse Cache-Control header (dictionary)
  const cacheControlValue = headers.get("cache-control");
  if (cacheControlValue) {
    try {
      const cacheControl = HTTPFields.parse(cacheControlValue, "dictionary");
      console.log("Max age:", cacheControl["max-age"]?.value);
      console.log("Is private:", cacheControl.private?.value === true);
    } catch (error) {
      console.warn("Invalid Cache-Control header");
    }
  }

  // Parse Accept-Language header (list)
  const acceptLangValue = headers.get("accept-language");
  if (acceptLangValue) {
    try {
      const acceptLang = HTTPFields.parse(acceptLangValue, "list");
      const languages = acceptLang.map((item) => ({
        language: item.value.value || item.value,
        quality: item.parameters.q || 1.0,
      }));
      console.log("Preferred languages:", languages);
    } catch (error) {
      console.warn("Invalid Accept-Language header");
    }
  }

  // Parse custom structured header (item)
  const apiVersionValue = headers.get("x-api-version");
  if (apiVersionValue) {
    try {
      const apiVersion = HTTPFields.parse(apiVersionValue, "item");
      console.log("API Version:", apiVersion.value);
      console.log("Deprecated:", apiVersion.parameters.deprecated);
    } catch (error) {
      console.warn("Invalid X-API-Version header");
    }
  }
}

// Usage with fetch
fetch("/api/data").then(handleResponse).catch(console.error);
```

### Setting Headers for HTTP Requests

```javascript
// Create structured headers for outgoing requests
function createApiRequest(url, options = {}) {
  const headers = new Headers(options.headers);

  // Set Accept header (list with quality values)
  const acceptData = [
    {
      value: HTTPFields.token("application/json"),
      parameters: { q: 0.9 },
    },
    {
      value: HTTPFields.token("application/xml"),
      parameters: { q: 0.8 },
    },
    {
      value: HTTPFields.token("*/*"),
      parameters: { q: 0.1 },
    },
  ];
  headers.set("accept", HTTPFields.serialize(acceptData, "list"));

  // Set custom API preferences (dictionary)
  const preferencesData = {
    version: { value: 2, parameters: {} },
    format: { value: HTTPFields.token("compact"), parameters: {} },
    "include-metadata": { value: true, parameters: {} },
  };
  headers.set(
    "x-api-preferences",
    HTTPFields.serialize(preferencesData, "dictionary")
  );

  // Set client info (item with parameters)
  const clientInfoData = {
    value: HTTPFields.token("MyApp"),
    parameters: {
      version: "1.2.3",
      platform: HTTPFields.token("web"),
    },
  };
  headers.set("x-client-info", HTTPFields.serialize(clientInfoData, "item"));

  return fetch(url, {
    ...options,
    headers,
  });
}

// Usage
createApiRequest("/api/users", {
  method: "GET",
  headers: {
    authorization: "Bearer token123",
  },
});
```

### Express.js Server Integration

```javascript
import express from "express";
import * as HTTPFields from "http-fields";

const app = express();

// Middleware to parse structured headers
app.use((req, res, next) => {
  // Parse client capabilities (list)
  const capabilities = req.headers["x-client-capabilities"];
  if (capabilities) {
    try {
      req.clientCapabilities = HTTPFields.parse(capabilities, "list").map(
        (item) => item.value.value || item.value
      );
    } catch (error) {
      req.clientCapabilities = [];
    }
  }

  // Parse feature flags (dictionary)
  const featureFlags = req.headers["x-feature-flags"];
  if (featureFlags) {
    try {
      req.featureFlags = HTTPFields.parse(featureFlags, "dictionary");
    } catch (error) {
      req.featureFlags = {};
    }
  }

  next();
});

// Route handler using parsed structured headers
app.get("/api/data", (req, res) => {
  // Use parsed capabilities
  const supportsCompression = req.clientCapabilities.includes("gzip");
  const experimentalFeatures =
    req.featureFlags["experimental-ui"]?.value === true;

  // Set structured response headers
  const cacheData = {
    "max-age": { value: 3600, parameters: {} },
    public: { value: true, parameters: {} },
  };
  res.set("cache-control", HTTPFields.serialize(cacheData, "dictionary"));

  // Set API metadata (item)
  const metadataData = {
    value: HTTPFields.token("v2"),
    parameters: {
      "rate-limit": 1000,
      experimental: experimentalFeatures,
    },
  };
  res.set("x-api-metadata", HTTPFields.serialize(metadataData, "item"));

  res.json({ data: "response" });
});
```

### Service Worker Example

```javascript
// In service worker
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const headers = request.headers;

  // Parse client preferences
  const preferencesValue = headers.get("x-preferences");
  let preferences = {};

  if (preferencesValue) {
    try {
      preferences = HTTPFields.parse(preferencesValue, "dictionary");
    } catch (error) {
      console.warn("Invalid preferences header");
    }
  }

  // Modify response based on preferences
  if (preferences.theme?.value === "dark") {
    // Serve dark theme assets
    event.respondWith(fetch("/assets/dark-theme.css"));
  } else {
    event.respondWith(fetch(request));
  }
});

// Setting headers in service worker
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    // Add structured headers to API requests
    const modifiedRequest = new Request(event.request, {
      headers: new Headers([
        ...event.request.headers.entries(),
        [
          "x-service-worker",
          HTTPFields.serialize(
            {
              value: HTTPFields.token("active"),
              parameters: {
                version: "1.0",
                "cache-strategy": HTTPFields.token("stale-while-revalidate"),
              },
            },
            "item"
          ),
        ],
      ]),
    });

    event.respondWith(fetch(modifiedRequest));
  }
});
```

### Headers Utility Class

```javascript
// Utility class for working with structured headers
class StructuredHeaders {
  constructor(headers = new Headers()) {
    this.headers = headers instanceof Headers ? headers : new Headers(headers);
  }

  // Get and parse a structured header
  getStructured(name, type) {
    const value = this.headers.get(name);
    if (!value) return null;

    try {
      return HTTPFields.parse(value, type);
    } catch (error) {
      console.warn(`Invalid structured header ${name}:`, error.message);
      return null;
    }
  }

  // Set a structured header
  setStructured(name, data, type) {
    try {
      const value = HTTPFields.serialize(data, type);
      this.headers.set(name, value);
    } catch (error) {
      console.error(`Failed to serialize header ${name}:`, error.message);
    }
  }

  // Get the underlying Headers object
  toHeaders() {
    return this.headers;
  }
}

// Usage example
const headers = new StructuredHeaders();

// Set cache control
headers.setStructured(
  "cache-control",
  {
    "max-age": { value: 3600, parameters: {} },
    public: { value: true, parameters: {} },
  },
  "dictionary"
);

// Set accept header
headers.setStructured(
  "accept",
  [
    { value: HTTPFields.token("application/json"), parameters: { q: 0.9 } },
    { value: HTTPFields.token("text/html"), parameters: { q: 0.8 } },
  ],
  "list"
);

// Use with fetch
fetch("/api/endpoint", {
  headers: headers.toHeaders(),
});

// Parse response headers
fetch("/api/endpoint").then((response) => {
  const responseHeaders = new StructuredHeaders(response.headers);
  const cacheControl = responseHeaders.getStructured(
    "cache-control",
    "dictionary"
  );
  const rateLimit = responseHeaders.getStructured("x-rate-limit", "item");

  console.log("Cache max-age:", cacheControl?.["max-age"]?.value);
  console.log("Rate limit:", rateLimit?.value);
});
```

## Error Handling

The library follows RFC 8941's strict error handling requirements. Any parsing error causes the entire operation to fail with a descriptive error message:

```javascript
try {
  const result = HTTPFields.parse("invalid[syntax", "list");
} catch (error) {
  console.error("Parsing failed:", error.message);
  // Handle the error - treat as if field was not present
}
```

Common error scenarios:

- Invalid characters in tokens
- Malformed strings (unterminated quotes)
- Numbers out of range
- Invalid base64 encoding
- Malformed inner lists or parameters

## JSON Structure Format

### List Structure

```javascript
[
    {
        value: <item_value> | <inner_list>,
        parameters: { key: value, ... }
    },
    ...
]
```

### Dictionary Structure

```javascript
{
    "key1": {
        value: <item_value> | <inner_list>,
        parameters: { key: value, ... }
    },
    "key2": { ... },
    ...
}
```

### Item Structure

```javascript
{
    value: <item_value>,
    parameters: { key: value, ... }
}
```

### Inner List Structure

```javascript
[
    {
        value: <item_value>,
        parameters: { key: value, ... }
    },
    ...
]
```

## Real-World Use Cases

### Cache-Control Headers

```javascript
// Parse Cache-Control as a dictionary
const cacheControl = HTTPFields.parse(
  "max-age=3600, private, must-revalidate",
  "dictionary"
);

// Create Cache-Control
const cacheData = {
  "max-age": { value: 3600, parameters: {} },
  private: { value: true, parameters: {} },
  "must-revalidate": { value: true, parameters: {} },
};
const header = HTTPFields.serialize(cacheData, "dictionary");
```

### Accept Headers

```javascript
// Parse Accept header as a list
const accept = HTTPFields.parse(
  "text/html;q=0.9, application/json;q=0.8",
  "list"
);

// Create Accept header
const acceptData = [
  {
    value: HTTPFields.token("text/html"),
    parameters: { q: 0.9 },
  },
  {
    value: HTTPFields.token("application/json"),
    parameters: { q: 0.8 },
  },
];
const header = HTTPFields.serialize(acceptData, "list");
```

### Custom Application Headers

```javascript
// API versioning header
const version = HTTPFields.parse("v=2;deprecated=?0", "item");

// Feature flags
const features = HTTPFields.parse("feature-a, feature-b;enabled=?1", "list");

// Service metadata
const metadata = HTTPFields.parse(
  'service="api", version=2, region="us-west"',
  "dictionary"
);
```

## Compliance and Testing

This implementation follows RFC 8941 strictly and passes the community test suite available at [httpwg/structured-field-tests](https://github.com/httpwg/structured-field-tests).

### Limitations

- Follows RFC 8941 size limits (15-digit integers, 3 decimal places, etc.)
- ASCII-only strings (use Byte Sequences for Unicode)
- Strict parsing - any malformed input fails completely
- Parameter keys must be lowercase

## Browser Compatibility

This library uses modern JavaScript features:

- ES6 modules
- Array methods (splice, shift, etc.)
- String methods
- Object methods

Supports all modern browsers and Node.js environments.

## Testing

Run the comprehensive test suite:

```bash
# Run custom tests (47 tests covering all features)
npm test

# Run official HTTP Working Group tests (168 tests - ALL PASSING! ✅)
npm run test:official

# Run all tests
npm run test:all

# Run tests with coverage
npm run test:coverage
```

**Test Results:**

- ✅ **Custom tests**: 47/47 passing  
- ✅ **Official HTTP WG tests**: 1711/1711 passing
- ✅ **Total**: 1758 tests passing

Our implementation now passes the same official test suite used by badgateway/structured-headers while maintaining our developer-friendly API.

## Contributing

Contributions welcome! Please ensure:

- All tests pass
- Code follows existing style
- RFC 8941 compliance maintained
- Documentation updated

## License

MIT License - see LICENSE file for details.

## References

- [RFC 8941: Structured Field Values for HTTP](https://www.rfc-editor.org/rfc/rfc8941.html)
- [Community Test Suite](https://github.com/httpwg/structured-field-tests)
- [HTTP Working Group](https://httpwg.org/)
