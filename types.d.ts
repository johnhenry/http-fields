// Type definitions for http-fields
// Project: https://github.com/yourusername/http-fields
// Definitions by: [Your Name] <[your-email]>

export type FieldType = "list" | "dictionary" | "item";

// Basic item types
export type BareItemValue =
  | number
  | string
  | boolean
  | TokenValue
  | BinaryValue
  | DateValue
  | DisplayStringValue;

// Structured item types
export interface TokenValue {
  type: "token";
  value: string;
}

export interface BinaryValue {
  type: "binary";
  value: string; // Base64 encoded
  decoded?: string; // Optional decoded content
}

export interface DateValue {
  type: "date";
  value: Date;
}

export interface DisplayStringValue {
  type: "displaystring";
  value: string; // Unicode string
}

// Parameters type
export type Parameters = Record<string, BareItemValue>;

// Item with parameters
export interface Item {
  value: BareItemValue | InnerList;
  parameters: Parameters;
}

// Inner list type
export type InnerList = Item[];

// List type (array of items)
export type List = Item[];

// Dictionary type
export type Dictionary = Record<string, Item>;

// Parse result types
export type ParseResult<T extends FieldType> = T extends "list"
  ? List
  : T extends "dictionary"
  ? Dictionary
  : T extends "item"
  ? Item
  : never;

// Main HTTPFields interface
export interface HTTPFieldsAPI {
  /**
   * Parse a structured field string into JSON
   * @param fieldValue The HTTP field value to parse
   * @param fieldType The type of structured field
   * @returns Parsed structure
   * @throws Error if parsing fails
   */
  parse<T extends FieldType>(fieldValue: string, fieldType: T): ParseResult<T>;

  /**
   * Serialize a JSON structure to a structured field string
   * @param data The data structure to serialize
   * @param fieldType The type of structured field
   * @returns Serialized field value string
   * @throws Error if serialization fails
   */
  serialize(data: List, fieldType: "list"): string;
  serialize(data: Dictionary, fieldType: "dictionary"): string;
  serialize(data: Item, fieldType: "item"): string;

  /**
   * Create a token value
   * @param value Token string
   * @returns Token object
   */
  token(value: string): TokenValue;

  /**
   * Create a binary value
   * @param base64Value Base64 encoded string
   * @returns Binary object
   */
  binary(base64Value: string): BinaryValue;

  /**
   * Create a date value (RFC 9651)
   * @param dateValue JavaScript Date object
   * @returns Date object
   */
  date(dateValue: Date): DateValue;

  /**
   * Create a display string value (RFC 9651)
   * @param unicodeValue Unicode string
   * @returns Display string object
   */
  displayString(unicodeValue: string): DisplayStringValue;
}

// Named exports for the main API functions
export declare const parse: HTTPFieldsAPI['parse'];
export declare const serialize: HTTPFieldsAPI['serialize']; 
export declare const token: HTTPFieldsAPI['token'];
export declare const binary: HTTPFieldsAPI['binary'];
export declare const date: HTTPFieldsAPI['date'];
export declare const displayString: HTTPFieldsAPI['displayString'];

// Utility types for more advanced usage

/**
 * Extract the value type from an Item
 */
export type ItemValue<T extends Item> = T["value"];

/**
 * Extract parameters from an Item
 */
export type ItemParameters<T extends Item> = T["parameters"];

/**
 * Create an Item type with specific value and parameter types
 */
export type TypedItem<
  V extends BareItemValue | InnerList,
  P extends Parameters = Parameters
> = {
  value: V;
  parameters: P;
};

/**
 * Create a Dictionary with specific key-value types
 */
export type TypedDictionary<
  T extends Record<string, Item> = Record<string, Item>
> = T;

/**
 * Helper type for creating strongly-typed structured fields
 */
export namespace TypedHTTPFields {
  // Simple item types
  export type IntegerItem = TypedItem<number>;
  export type StringItem = TypedItem<string>;
  export type BooleanItem = TypedItem<boolean>;
  export type TokenItem = TypedItem<TokenValue>;
  export type BinaryItem = TypedItem<BinaryValue>;
  export type DateItem = TypedItem<DateValue>;
  export type DisplayStringItem = TypedItem<DisplayStringValue>;

  // Common parameter patterns
  export interface QualityParameters {
    q?: number;
  }

  export interface CharsetParameters {
    charset?: string;
  }

  export interface VersionParameters {
    version?: number | string;
  }

  // Typed items with common parameters
  export type AcceptItem = TypedItem<TokenValue, QualityParameters>;
  export type ContentTypeItem = TypedItem<TokenValue, CharsetParameters>;
  export type ApiVersionItem = TypedItem<
    TokenValue | number,
    VersionParameters
  >;

  // Common dictionary patterns
  export interface CacheControlDictionary extends TypedDictionary {
    "max-age"?: IntegerItem;
    private?: BooleanItem;
    public?: BooleanItem;
    "must-revalidate"?: BooleanItem;
    "no-cache"?: BooleanItem;
    "no-store"?: BooleanItem;
  }

  export interface SecurityPolicyDictionary extends TypedDictionary {
    "default-src"?: TypedItem<InnerList>;
    "script-src"?: TypedItem<InnerList>;
    "style-src"?: TypedItem<InnerList>;
    "img-src"?: TypedItem<InnerList>;
  }
}

// Error types
export class StructuredFieldParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StructuredFieldParseError";
  }
}

export class HTTPFieldsSerializeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HTTPFieldsSerializeError";
  }
}

// Constants
export const RFC_VERSION = "9651" as const;
export const SUPPORTED_TYPES = ["list", "dictionary", "item"] as const;

// Validation helpers (type guards)
export function isTokenValue(value: any): value is TokenValue {
  return (
    typeof value === "object" &&
    value !== null &&
    value.type === "token" &&
    typeof value.value === "string"
  );
}

export function isBinaryValue(value: any): value is BinaryValue {
  return (
    typeof value === "object" &&
    value !== null &&
    value.type === "binary" &&
    typeof value.value === "string"
  );
}

export function isDateValue(value: any): value is DateValue {
  return (
    typeof value === "object" &&
    value !== null &&
    value.type === "date" &&
    value.value instanceof Date
  );
}

export function isDisplayStringValue(value: any): value is DisplayStringValue {
  return (
    typeof value === "object" &&
    value !== null &&
    value.type === "displaystring" &&
    typeof value.value === "string"
  );
}

export function isItem(value: any): value is Item {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    "parameters" in value
  );
}

export function isList(value: any): value is List {
  return Array.isArray(value) && value.every(isItem);
}

export function isDictionary(value: any): value is Dictionary {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(isItem)
  );
}

// Utility functions for working with structured fields
export namespace StructuredFieldUtils {
  /**
   * Create a simple item without parameters
   */
  export function createItem<T extends BareItemValue | InnerList>(
    value: T
  ): TypedItem<T> {
    return { value, parameters: {} };
  }

  /**
   * Create an item with parameters
   */
  export function createItemWithParams<
    T extends BareItemValue | InnerList,
    P extends Parameters
  >(value: T, parameters: P): TypedItem<T, P> {
    return { value, parameters };
  }

  /**
   * Extract a parameter value with type safety
   */
  export function getParameter<T extends BareItemValue>(
    item: Item,
    key: string
  ): T | undefined {
    return item.parameters[key] as T | undefined;
  }

  /**
   * Check if a dictionary has a specific key
   */
  export function hasDictionaryKey(dict: Dictionary, key: string): boolean {
    return key in dict;
  }

  /**
   * Get a dictionary value with type safety
   */
  export function getDictionaryValue<T extends Item>(
    dict: Dictionary,
    key: string
  ): T | undefined {
    return dict[key] as T | undefined;
  }

  /**
   * Create a cache-control dictionary
   */
  export function createCacheControl(options: {
    maxAge?: number;
    private?: boolean;
    public?: boolean;
    mustRevalidate?: boolean;
    noCache?: boolean;
    noStore?: boolean;
  }): TypedHTTPFields.CacheControlDictionary {
    const result: TypedHTTPFields.CacheControlDictionary = {};

    if (options.maxAge !== undefined) {
      result["max-age"] = createItem(options.maxAge);
    }
    if (options.private) {
      result["private"] = createItem(true);
    }
    if (options.public) {
      result["public"] = createItem(true);
    }
    if (options.mustRevalidate) {
      result["must-revalidate"] = createItem(true);
    }
    if (options.noCache) {
      result["no-cache"] = createItem(true);
    }
    if (options.noStore) {
      result["no-store"] = createItem(true);
    }

    return result;
  }
}
