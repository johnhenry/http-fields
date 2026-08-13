import { test, describe } from "node:test";
import assert from "node:assert";
import {
  parsePriority,
  serializePriority,
  parseCacheStatus,
  serializeCacheStatus,
  parseAcceptCH,
  parseSecCHUA,
  parseNoVarySearch,
} from "../headers.mjs";

describe("Header helpers (http-fields/headers)", () => {
  describe("Priority (RFC 9218)", () => {
    test("parses urgency and incremental", () => {
      assert.deepStrictEqual(parsePriority("u=2, i"), {
        urgency: 2,
        incremental: true,
      });
      assert.deepStrictEqual(parsePriority("u=0"), {
        urgency: 0,
        incremental: false,
      });
      assert.deepStrictEqual(parsePriority("i=?0"), {
        urgency: 3,
        incremental: false,
      });
    });

    test("empty value yields defaults", () => {
      assert.deepStrictEqual(parsePriority(""), {
        urgency: 3,
        incremental: false,
      });
    });

    test("ignores out-of-spec members per RFC 9218 §4", () => {
      // urgency outside 0–7, non-integer urgency, non-boolean incremental
      assert.deepStrictEqual(parsePriority("u=9"), {
        urgency: 3,
        incremental: false,
      });
      assert.deepStrictEqual(parsePriority("u=2.5, i=5"), {
        urgency: 3,
        incremental: false,
      });
    });

    test("ignores unknown members", () => {
      assert.deepStrictEqual(parsePriority("u=1, future=token"), {
        urgency: 1,
        incremental: false,
      });
    });

    test("throws on invalid structured field syntax", () => {
      assert.throws(() => parsePriority("u=„"));
    });

    test("serializes, omitting defaults", () => {
      assert.strictEqual(serializePriority({ urgency: 2, incremental: true }), "u=2, i");
      assert.strictEqual(serializePriority({ urgency: 0 }), "u=0");
      assert.strictEqual(serializePriority({ incremental: true }), "i");
      assert.strictEqual(serializePriority({}), "");
      assert.strictEqual(serializePriority(), "");
    });

    test("serialize validates inputs", () => {
      assert.throws(() => serializePriority({ urgency: 8 }));
      assert.throws(() => serializePriority({ urgency: 1.5 }));
      assert.throws(() => serializePriority({ incremental: 1 }));
    });

    test("round-trips", () => {
      const p = { urgency: 6, incremental: true };
      assert.deepStrictEqual(parsePriority(serializePriority(p)), p);
    });
  });

  describe("Cache-Status (RFC 9211)", () => {
    test("parses a single hit entry", () => {
      assert.deepStrictEqual(parseCacheStatus("ExampleCache; hit"), [
        { cache: "ExampleCache", hit: true, stored: false, collapsed: false },
      ]);
    });

    test("parses string cache names and ttl", () => {
      assert.deepStrictEqual(
        parseCacheStatus('"CDN Company Here"; hit; ttl=545'),
        [
          {
            cache: "CDN Company Here",
            hit: true,
            stored: false,
            collapsed: false,
            ttl: 545,
          },
        ]
      );
    });

    test("parses forward entries with status and detail", () => {
      assert.deepStrictEqual(
        parseCacheStatus(
          "OriginCache; fwd=stale; fwd-status=304, ReverseProxyCache; hit"
        ),
        [
          {
            cache: "OriginCache",
            hit: false,
            stored: false,
            collapsed: false,
            fwd: "stale",
            fwdStatus: 304,
          },
          {
            cache: "ReverseProxyCache",
            hit: true,
            stored: false,
            collapsed: false,
          },
        ]
      );
    });

    test("parses stored, collapsed, key, and negative ttl", () => {
      assert.deepStrictEqual(
        parseCacheStatus(
          'Edge; fwd=uri-miss; stored; collapsed; key="/a?x=1"; ttl=-30; detail=MEMORY'
        ),
        [
          {
            cache: "Edge",
            hit: false,
            stored: true,
            collapsed: true,
            fwd: "uri-miss",
            ttl: -30,
            key: "/a?x=1",
            detail: "MEMORY",
          },
        ]
      );
    });

    test("rejects inner-list members", () => {
      assert.throws(() => parseCacheStatus("(a b); hit"));
    });

    test("serializes entries, choosing token vs string names", () => {
      assert.strictEqual(
        serializeCacheStatus([
          { cache: "ExampleCache", hit: true, ttl: 376 },
          { cache: "CDN Company Here", fwd: "uri-miss", collapsed: true },
        ]),
        'ExampleCache;hit;ttl=376, "CDN Company Here";fwd=uri-miss;collapsed'
      );
    });

    test("round-trips", () => {
      const wire = "Nginx;hit, Edge;fwd=miss;stored";
      assert.strictEqual(
        serializeCacheStatus(parseCacheStatus(wire)),
        wire
      );
    });
  });

  describe("Accept-CH (RFC 8942)", () => {
    test("parses hint names", () => {
      assert.deepStrictEqual(
        parseAcceptCH("Sec-CH-UA-Platform, Sec-CH-UA-Arch, Device-Memory"),
        ["Sec-CH-UA-Platform", "Sec-CH-UA-Arch", "Device-Memory"]
      );
    });

    test("rejects non-token members", () => {
      assert.throws(() => parseAcceptCH('"Device-Memory"'));
      assert.throws(() => parseAcceptCH("42"));
    });
  });

  describe("Sec-CH-UA (UA Client Hints)", () => {
    test("parses brands with versions", () => {
      assert.deepStrictEqual(
        parseSecCHUA('"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"'),
        [
          { brand: "Chromium", version: "112" },
          { brand: "Google Chrome", version: "112" },
          { brand: "Not:A-Brand", version: "99" },
        ]
      );
    });

    test("version is optional", () => {
      assert.deepStrictEqual(parseSecCHUA('"Chromium"'), [
        { brand: "Chromium" },
      ]);
    });

    test("rejects token members", () => {
      assert.throws(() => parseSecCHUA("Chromium;v=\"112\""));
    });
  });

  describe("No-Vary-Search (HTML spec)", () => {
    test("parses key-order", () => {
      assert.deepStrictEqual(parseNoVarySearch("key-order"), {
        keyOrder: true,
        params: false,
        except: [],
      });
    });

    test("parses boolean params", () => {
      assert.deepStrictEqual(parseNoVarySearch("params"), {
        keyOrder: false,
        params: true,
        except: [],
      });
    });

    test("parses params as an inner list of names", () => {
      assert.deepStrictEqual(
        parseNoVarySearch('params=("utm_source" "utm_medium")'),
        { keyOrder: false, params: ["utm_source", "utm_medium"], except: [] }
      );
    });

    test("parses except with params", () => {
      assert.deepStrictEqual(parseNoVarySearch('params, except=("q")'), {
        keyOrder: false,
        params: true,
        except: ["q"],
      });
    });

    test("rejects non-string inner list entries", () => {
      assert.throws(() => parseNoVarySearch("params=(utm_source)"));
      assert.throws(() => parseNoVarySearch("except=(1 2)"));
    });
  });
});
