/**
 * Semantic helpers for specific HTTP headers built on Structured Field Values.
 *
 * The core module (`http-fields`) parses the generic RFC 8941/9651 grammar;
 * this module maps the generic result into named, typed fields for real
 * headers — and back. Import via the `http-fields/headers` subpath.
 *
 * All parsers throw on syntactically invalid Structured Field Values (same
 * strict behavior as the core `parse()`). Where a header's spec defines
 * semantic fallbacks (e.g. Priority urgency outside 0–7), the invalid member
 * is ignored per that spec. Callers implementing a spec's "ignore malformed
 * header entirely" guidance should wrap calls in try/catch.
 */

"use strict";

import { parse, serialize } from "./index.mjs";

// Unwrap typed value objects ({type: "token"|"decimal"|..., value}) to their
// bare JavaScript value; plain values pass through.
const bare = (v) =>
  v && typeof v === "object" && typeof v.type === "string" ? v.value : v;

const TOKEN_RE = /^[a-zA-Z*][a-zA-Z0-9:/!#$%&'*+\-.^_`|~]*$/;

// ---------------------------------------------------------------------------
// Priority — RFC 9218
// ---------------------------------------------------------------------------

/**
 * Parse a `Priority` header (RFC 9218) into `{urgency, incremental}`.
 * Defaults: urgency 3, incremental false. Members with out-of-spec values
 * (non-integer urgency, urgency outside 0–7, non-boolean incremental) are
 * ignored per RFC 9218 §4.
 * @param {string} fieldValue
 * @returns {{urgency: number, incremental: boolean}}
 */
export const parsePriority = (fieldValue) => {
  const result = { urgency: 3, incremental: false };
  const dict = parse(fieldValue, "dictionary");
  const u = dict.u ? dict.u.value : undefined;
  if (Number.isInteger(u) && u >= 0 && u <= 7) {
    result.urgency = u;
  }
  const i = dict.i ? dict.i.value : undefined;
  if (typeof i === "boolean") {
    result.incremental = i;
  }
  return result;
};

/**
 * Serialize `{urgency, incremental}` to a `Priority` header value.
 * Default values (urgency 3, incremental false) are omitted per RFC 9218's
 * recommendation to minimize the field; both defaults yield "".
 * @param {{urgency?: number, incremental?: boolean}} priority
 * @returns {string}
 */
export const serializePriority = ({ urgency = 3, incremental = false } = {}) => {
  if (!Number.isInteger(urgency) || urgency < 0 || urgency > 7) {
    throw new Error("Priority urgency must be an integer from 0 to 7");
  }
  if (typeof incremental !== "boolean") {
    throw new Error("Priority incremental must be a boolean");
  }
  const dict = {};
  if (urgency !== 3) {
    dict.u = { value: urgency, parameters: {} };
  }
  if (incremental) {
    dict.i = { value: true, parameters: {} };
  }
  return serialize(dict, "dictionary");
};

// ---------------------------------------------------------------------------
// Cache-Status — RFC 9211
// ---------------------------------------------------------------------------

/**
 * Parse a `Cache-Status` header (RFC 9211) into an array of cache entries,
 * ordered closest-to-origin first (as on the wire).
 * @param {string} fieldValue
 * @returns {Array<{cache: string, hit: boolean, fwd?: string,
 *   fwdStatus?: number, ttl?: number, stored: boolean, collapsed: boolean,
 *   key?: string, detail?: string}>}
 */
export const parseCacheStatus = (fieldValue) => {
  return parse(fieldValue, "list").map((member) => {
    if (Array.isArray(member.value)) {
      throw new Error("Cache-Status members must be items, not inner lists");
    }
    const name = bare(member.value);
    if (typeof name !== "string") {
      throw new Error("Cache-Status member must be a string or token");
    }
    const p = member.parameters;
    const entry = {
      cache: name,
      hit: p.hit === true,
      stored: p.stored === true,
      collapsed: p.collapsed === true,
    };
    if (p.fwd !== undefined) entry.fwd = bare(p.fwd);
    if (Number.isInteger(p["fwd-status"])) entry.fwdStatus = p["fwd-status"];
    if (Number.isInteger(p.ttl)) entry.ttl = p.ttl;
    if (typeof p.key === "string") entry.key = p.key;
    if (p.detail !== undefined) entry.detail = bare(p.detail);
    return entry;
  });
};

/**
 * Serialize cache entries to a `Cache-Status` header value. Cache names that
 * are valid tokens serialize as tokens, otherwise as strings.
 * @param {Array<{cache: string, hit?: boolean, fwd?: string,
 *   fwdStatus?: number, ttl?: number, stored?: boolean, collapsed?: boolean,
 *   key?: string, detail?: string}>} entries
 * @returns {string}
 */
export const serializeCacheStatus = (entries) => {
  const list = entries.map((entry) => {
    if (typeof entry.cache !== "string" || entry.cache.length === 0) {
      throw new Error("Cache-Status entry requires a non-empty cache name");
    }
    const value = TOKEN_RE.test(entry.cache)
      ? { type: "token", value: entry.cache }
      : entry.cache;
    const parameters = {};
    if (entry.hit === true) parameters.hit = true;
    if (entry.fwd !== undefined) {
      parameters.fwd = { type: "token", value: entry.fwd };
    }
    if (entry.fwdStatus !== undefined) parameters["fwd-status"] = entry.fwdStatus;
    if (entry.ttl !== undefined) parameters.ttl = entry.ttl;
    if (entry.stored === true) parameters.stored = true;
    if (entry.collapsed === true) parameters.collapsed = true;
    if (entry.key !== undefined) parameters.key = entry.key;
    if (entry.detail !== undefined) {
      parameters.detail = TOKEN_RE.test(entry.detail)
        ? { type: "token", value: entry.detail }
        : entry.detail;
    }
    return { value, parameters };
  });
  return serialize(list, "list");
};

// ---------------------------------------------------------------------------
// Client Hints — RFC 8942 (Accept-CH) and UA Client Hints (Sec-CH-UA)
// ---------------------------------------------------------------------------

/**
 * Parse an `Accept-CH` header (RFC 8942): a list of client-hint names.
 * @param {string} fieldValue
 * @returns {string[]} hint names, e.g. ["Sec-CH-UA-Platform", "Device-Memory"]
 */
export const parseAcceptCH = (fieldValue) => {
  return parse(fieldValue, "list").map((member) => {
    const v = member.value;
    if (!v || v.type !== "token") {
      throw new Error("Accept-CH members must be tokens");
    }
    return v.value;
  });
};

/**
 * Parse a `Sec-CH-UA` / `Sec-CH-UA-Full-Version-List` header (UA Client
 * Hints): a list of brand strings with a `v` (version) parameter.
 * @param {string} fieldValue
 * @returns {Array<{brand: string, version?: string}>}
 */
export const parseSecCHUA = (fieldValue) => {
  return parse(fieldValue, "list").map((member) => {
    if (typeof member.value !== "string") {
      throw new Error("Sec-CH-UA members must be strings");
    }
    const entry = { brand: member.value };
    if (typeof member.parameters.v === "string") {
      entry.version = member.parameters.v;
    }
    return entry;
  });
};

// ---------------------------------------------------------------------------
// No-Vary-Search — HTML spec (URL search variance for caching/prefetch)
// ---------------------------------------------------------------------------

/**
 * Parse a `No-Vary-Search` header into `{keyOrder, params, except}`.
 * - keyOrder: true when query-parameter order doesn't affect the response
 * - params: true (no params matter), false (all matter), or a list of
 *   parameter names that don't matter
 * - except: parameter names that DO matter (only meaningful with params=true)
 * @param {string} fieldValue
 * @returns {{keyOrder: boolean, params: boolean | string[], except: string[]}}
 */
export const parseNoVarySearch = (fieldValue) => {
  const dict = parse(fieldValue, "dictionary");
  const result = { keyOrder: false, params: false, except: [] };

  const innerStrings = (memberValue, name) => {
    if (!Array.isArray(memberValue)) {
      throw new Error(`No-Vary-Search ${name} must be an inner list`);
    }
    return memberValue.map((item) => {
      if (typeof item.value !== "string") {
        throw new Error(`No-Vary-Search ${name} entries must be strings`);
      }
      return item.value;
    });
  };

  if (dict["key-order"] !== undefined) {
    result.keyOrder = dict["key-order"].value === true;
  }
  if (dict.params !== undefined) {
    const v = dict.params.value;
    result.params = typeof v === "boolean" ? v : innerStrings(v, "params");
  }
  if (dict.except !== undefined) {
    result.except = innerStrings(dict.except.value, "except");
  }
  return result;
};
