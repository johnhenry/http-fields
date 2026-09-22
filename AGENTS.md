# Agent playbook

`@johnhenry/http-fields` — a JavaScript implementation of RFC 8941/9651
Structured Field Values for HTTP, with bidirectional translation between
structured header strings and JSON. Single package, Node >= 26, `node --test`
for tests, ships source (no build step). Zero runtime dependencies — keep
it that way; `dependencies` should stay empty.

`CLAUDE.md` in this directory is a symlink to this file.

## The verification loop (before every push)

1. `npm test` — runs every `test/*.mjs` file, including the full official
   [httpwg/structured-field-tests](https://github.com/httpwg/structured-field-tests)
   vector suite (2189 tests, canonical round-trip checks enforced).
   `npm run test:official` / `test:serialization` / `test:base32` isolate a
   subset while iterating; `node --test test/test.mjs -n "<pattern>"` runs
   one test by name.
2. `npm run examples` — six of the seven `examples/` scripts run as a smoke
   test (the seventh, `07-typescript-usage.ts`, is read-only; see
   `examples/README.md`).
3. A genuinely fresh clone:
   `git clone . /tmp/http-fields-verifyN && cd $_ && npm ci && npm test`.
   This is the only way to catch a `files` entry in `package.json` that
   doesn't actually ship what `exports` promises.
4. Commit, push, close the issue with a comment naming the commit SHA.

CI (`.github/workflows/test.yml`) runs the full `npm test`; match it locally
before pushing.

## Repo-specific gotchas

- **Parsing is all-or-nothing per RFC 8941's error-handling model.** A
  single malformed token fails the entire field, with no partial result —
  don't add lenient/best-effort parsing paths; that would violate the spec
  this library exists to implement correctly. See the README's
  [Honest limitations](README.md#honest-limitations) section.
- **The core module (`index.mjs`) uses a revealing-module pattern**: parser
  functions consume a character array by shifting elements as they process,
  and every data type has one paired parser + one serializer, both pure
  with no global state. Keep that pairing when adding a new type — RFC 9651
  added `date()`/`displaystring()` wrapper objects this way, alongside
  `token()`/`binary()`.
- **`headers.mjs` (the `/headers` subpath) is semantic, `index.mjs` is
  generic.** Header-specific helpers (`parsePriority`, `parseCacheStatus`,
  `parseAcceptCH`, `parseSecCHUA`, `parseNoVarySearch`) map the generic
  grammar onto named, typed fields for real headers — new header support
  belongs in `headers.mjs`/`headers.d.ts`, not in the core parser.
- **Dictionary/parameter keys are not case-folded.** `parse("A=1", ...)` is
  invalid per the grammar, not silently lowercased — a change that adds
  leniency here would be a spec deviation, not a bug fix.

## Definition of done

A change is done when all of the following hold, not just when tests pass:
- A regression test exists for any bug fixed, checked against the official
  httpwg vectors if the fix is grammar-related.
- Anything the implementation does **not** do is stated in the README's
  [Honest limitations](README.md#honest-limitations) section, not only in
  an issue comment.
- `CHANGELOG.md` has an entry.
- If the change adds a new header helper, `examples/02-http-headers.mjs`
  and the `## Header Helpers` README section are updated together.

## Releases

Bump `version` in `package.json` in a PR, add the `CHANGELOG.md` entry, merge,
then `gh release create v<version>` — the release event triggers
`.github/workflows/publish.yml`, which is idempotent (skips if the version is
already on npm).
