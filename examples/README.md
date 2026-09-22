# http-fields examples

Runnable examples exercising the library's parse/serialize API against real
RFC 8941/9651 shapes and real-world headers. All but `07-typescript-usage.ts`
run as plain ES modules with no build step.

| Example | Demonstrates |
| --- | --- |
| [`01-basic.mjs`](./01-basic.mjs) | `parse()`/`serialize()` round-tripping every core shape — lists, dictionaries, items with parameters, binary data, and nested inner lists — against `Cache-Control`-style real values. |
| [`02-http-headers.mjs`](./02-http-headers.mjs) | Reading and writing structured headers through the standard `Headers` object (`getStructured`/`setStructured` helper class), including request-side `Accept`/preferences and response-side content negotiation. |
| [`03-cookies.mjs`](./03-cookies.mjs) | Structured Field Values applied to cookie payloads — preferences, shopping carts, session state, A/B test assignment, analytics, and a cookie-format migration strategy. |
| [`04-rfc9651.mjs`](./04-rfc9651.mjs) | The RFC 9651 extension types specifically: `date()` parsing/serializing to `@`-prefixed timestamps, and `displayString()` round-tripping Unicode content through `%`-prefixed encoding. |
| [`05-advanced.mjs`](./05-advanced.mjs) | Structured Field Values used as a general request/response negotiation format in six non-HTTP-header scenarios (PWA feature negotiation, AI model serving params, IoT mesh metadata, CDN optimization, Web3 transaction metadata, ML pipeline orchestration) — proving the data model generalizes past HTTP headers. |
| [`06-comparison.mjs`](./06-comparison.mjs) | Side-by-side API comparison against [badgateway/structured-headers](https://github.com/badgateway/structured-headers) — parsing, result shapes, data creation, type handling, error handling, and integration patterns. See also [`COMPARISON.md`](../COMPARISON.md) for the narrative version. |
| [`07-typescript-usage.ts`](./07-typescript-usage.ts) | Typed usage against `types.d.ts` — `List`/`Dictionary`/`Item` type imports and type-guarded access. **Not** part of `npm run examples`: it's TypeScript source with no `ts-node`/`tsx` devDependency wired up to run it directly; read it, or compile it with your own toolchain. |

## Running

```sh
npm run examples       # run 01-06 in sequence (the same loop CI runs)
npm run example:01     # run one
node examples/01-basic.mjs
```

`npm run example` (no colon) remains as an alias that runs `examples/index.mjs`,
which imports 01-06 for side effects — kept for backward compatibility with
existing scripts/docs that reference it.

## Runtime requirements

Plain Node >= 26, zero dependencies — the library itself has none, and none
of these examples need a server, network access, or a browser. `05-advanced.mjs`'s
scenarios (AI serving, IoT, blockchain) are illustrative payload shapes, not
live integrations — nothing here makes a real network call.
