# Comparison: http-fields vs badgateway/structured-headers

[`structured-headers`](https://github.com/badgateway/structured-headers)
(badgateway, v2.0.3 at the time of writing) is the most established
JavaScript implementation of RFC 8941/9651 Structured Field Values. Both
libraries parse and serialize the same grammar with zero dependencies; they
differ in data model, conformance posture, and packaging.

## At a glance

| | http-fields | structured-headers |
| --- | --- | --- |
| **RFCs** | 8941 + 9651 | 8941 + 9651 |
| **Dependencies** | Zero | Zero |
| **Data model** | Plain JSON objects: `{value, parameters}` | RFC-shaped tuples: `[value, Map]`, with `Token`/`DisplayString` classes and `ArrayBuffer` binaries |
| **API surface** | One `parse(value, type)` / `serialize(data, type)` pair + typed helpers | Per-type functions: `parseItem`, `parseList`, `parseDictionary`, ... |
| **Conformance** | Full official httpwg suite **including canonical round-trip serialization** — 2214 tests, no skips | 2805 unit tests, mostly the official suite, **with the `1.0`-serialization tests skipped** (see below) [^counts] |
| **Whole-number decimals** | `1.0` round-trips as `1.0` (via a `decimal` wrapper) | Serializes as `1` — their README: "No fix is planned" |
| **Decimal rounding** | Round-half-to-even per RFC (`0.0025` → `0.002`) | Rounds `0.0025` → `0.003` — their README: fix intended |
| **Module formats** | ESM only | ESM + CommonJS |
| **TypeScript** | Declarations shipped (`types.d.ts`) | TypeScript-first source |
| **Semantic header helpers** | `@johnhenry/http-fields/headers` subpath: Priority, Cache-Status, Accept-CH, Sec-CH-UA, No-Vary-Search | Not included |
| **Ecosystem** | Basis of [`http-fields-signatures`](https://github.com/johnhenry/http-fields-signatures) (RFC 9421) | Basis of [`http-message-signatures`](https://github.com/dhensby/node-http-message-signatures) |

## The conformance difference, concretely

RFC 8941 requires serializers to keep a decimal's decimal point and to round
half-to-even at three fractional digits. Both are awkward in JavaScript
because `1.0 === 1` and `Math.round` rounds half away from zero — and the two
libraries made opposite calls:

- **structured-headers** documents both as known deviations: the official
  tests requiring `1.0` output are skipped ("there's no reasonable way to fix
  this without wrapping every number in a custom class"), and `0.0025`
  serializes as `0.003`.
- **http-fields** wraps *only* whole-valued decimals — `parse("1.0", "item")`
  returns `{value: {type: "decimal", value: 1}}` while `parse("3.14", ...)`
  stays a plain number — and implements string-based round-half-to-even. The
  full official suite, canonical checks included, passes with no skips.

Which trade-off you prefer is a judgment call: structured-headers keeps every
number a plain `number` at the cost of two spec deviations; http-fields is
byte-exact against the spec at the cost of one wrapper type in the
whole-valued-decimal corner case.

## Same task, both libraries

### Parsing an item with parameters

**http-fields** — one function, plain objects:

```javascript
import { parse } from "@johnhenry/http-fields";

parse('"Hello world"; a="5"', "item");
// { value: "Hello world", parameters: { a: "5" } }
```

**structured-headers** — per-type functions, RFC-shaped tuples:

```typescript
import { parseItem } from "structured-headers";

parseItem('"Hello world"; a="5"');
// ["Hello world", Map(1) { "a" => "5" }]
```

### Typed values

**http-fields** — helper constructors, `{type, value}` wrappers:

```javascript
import { token, binary, date, decimal, displayString } from "@johnhenry/http-fields";

token("application/json");   // { type: "token", value: "application/json" }
binary("SGVsbG8=");          // { type: "binary", value: "SGVsbG8=" }
date(new Date());            // { type: "date", value: Date, seconds: ... }
decimal(10);                 // { type: "decimal", value: 10 } → "10.0"
displayString("Fryslân");
```

**structured-headers** — dedicated classes and native types:

```typescript
import { Token, DisplayString } from "structured-headers";

new Token("application/json");
new ArrayBuffer(8);          // binary values are ArrayBuffers
new Date(1686634251000);     // dates are native Dates
new DisplayString("Fryslân");
// no decimal wrapper — 1.0 is unrepresentable distinctly from 1
```

### Serializing a dictionary

**http-fields:**

```javascript
import { serialize, token } from "@johnhenry/http-fields";

serialize(
  {
    a: { value: 1, parameters: {} },
    b: { value: token("bar"), parameters: { q: 0.9 } },
  },
  "dictionary"
);
// 'a=1, b=bar;q=0.9'
```

**structured-headers:**

```typescript
import { serializeDictionary, Token } from "structured-headers";

serializeDictionary(
  new Map([
    ["a", [1, new Map()]],
    ["b", [new Token("bar"), new Map([["q", 0.9]])]],
  ])
);
// 'a=1, b=bar;q=0.9'
```

## Which to pick

Choose **structured-headers** when you need **CommonJS** builds, prefer
**RFC-literal data structures** (tuples, `Map`s, `ArrayBuffer`s) that mirror
the spec's own model, want plain `number`s everywhere, or want the library
with the longer production track record.

Choose **http-fields** when you want **full canonical conformance with no
skipped tests** (whole-number decimals, banker's rounding, canonical base64),
**plain JSON data structures** that serialize/log/deep-equal naturally, a
**single parse/serialize entry point**, or the **semantic header helpers**
(`@johnhenry/http-fields/headers`) for Priority, Cache-Status, Client Hints, and
No-Vary-Search on top of the generic parser.

Both are solid, zero-dependency implementations — this comparison reflects
`structured-headers@2.0.3` and `http-fields@0.1.0` and may drift as either
evolves.

[^counts]: The raw totals count different things, so 2805 vs 2214 is not a
    coverage gap. structured-headers registers each official vector as up to
    *two* tests (a parse test and a serialize test); http-fields runs each
    vector as *one* test that parses, compares the expected value, and
    asserts canonical re-serialization in the same test body — plus its own
    custom and header-helper tests. Both run the same official vector set.
    Within structured-headers' serialize tests, a named skip list plus a
    blanket skip of every test ending in "0 decimal" excludes the
    whole-number-decimal and round-half-to-even vectors (registered, but
    `skip()`ed); every http-fields test asserts.
