// Type definitions for http-fields/headers
// Project: https://github.com/johnhenry/http-fields

/** Parsed `Priority` header (RFC 9218). */
export interface Priority {
  /** 0 (highest) to 7 (lowest); default 3. */
  urgency: number;
  /** Whether the response can be processed incrementally; default false. */
  incremental: boolean;
}

/** Parsed `Cache-Status` entry (RFC 9211). */
export interface CacheStatusEntry {
  /** Cache identifier (host, alias, or product name). */
  cache: string;
  hit: boolean;
  stored: boolean;
  collapsed: boolean;
  /** Why the request went forward: bypass, method, uri-miss, vary-miss, miss, request, stale, partial. */
  fwd?: string;
  fwdStatus?: number;
  /** Remaining freshness lifetime in seconds (may be negative). */
  ttl?: number;
  key?: string;
  detail?: string;
}

/** Input shape for serializeCacheStatus — flags default to false/omitted. */
export interface CacheStatusEntryInput {
  cache: string;
  hit?: boolean;
  stored?: boolean;
  collapsed?: boolean;
  fwd?: string;
  fwdStatus?: number;
  ttl?: number;
  key?: string;
  detail?: string;
}

/** Parsed `Sec-CH-UA` brand entry (UA Client Hints). */
export interface UABrand {
  brand: string;
  version?: string;
}

/** Parsed `No-Vary-Search` header (HTML spec). */
export interface NoVarySearch {
  keyOrder: boolean;
  /** true = no params matter, false = all matter, string[] = these don't matter. */
  params: boolean | string[];
  /** Params that DO matter (only meaningful when params is true). */
  except: string[];
}

export declare function parsePriority(fieldValue: string): Priority;
export declare function serializePriority(priority?: Partial<Priority>): string;
export declare function parseCacheStatus(fieldValue: string): CacheStatusEntry[];
export declare function serializeCacheStatus(
  entries: CacheStatusEntryInput[]
): string;
export declare function parseAcceptCH(fieldValue: string): string[];
export declare function parseSecCHUA(fieldValue: string): UABrand[];
export declare function parseNoVarySearch(fieldValue: string): NoVarySearch;
