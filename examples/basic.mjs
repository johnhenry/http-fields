import HTTPFields from "../index.mjs";

// Note: This library now includes TypeScript support!
// See typescript-usage.ts for TypeScript-specific examples

console.log("# RFC 8941 Structured Fields - Basic Examples\n");

// Example 1: Basic List Parsing
console.log("## Example 1: Basic List Parsing\n");
const listExample = "sugar, tea, rum";
const parsedList = HTTPFields.parse(listExample, "list");
console.log("**Input:**");
console.log("```");
console.log(listExample);
console.log("```\n");
console.log("**Parsed JSON:**");
console.log("```json");
console.log(JSON.stringify(parsedList, null, 2));
console.log("```\n");
console.log("**Serialized back:**");
console.log("```");
console.log(HTTPFields.serialize(parsedList, "list"));
console.log("```\n");

// Example 2: Dictionary with Parameters
console.log("## Example 2: Dictionary with Parameters\n");
const dictExample = "a=1, b=2;x=y, c=(foo bar)";
const parsedDict = HTTPFields.parse(dictExample, "dictionary");
console.log("**Input:**");
console.log("```");
console.log(dictExample);
console.log("```\n");
console.log("**Parsed JSON:**");
console.log("```json");
console.log(JSON.stringify(parsedDict, null, 2));
console.log("```\n");
console.log("**Serialized back:**");
console.log("```");
console.log(HTTPFields.serialize(parsedDict, "dictionary"));
console.log("```\n");

// Example 3: Item with Parameters
console.log("## Example 3: Item with Parameters\n");
const itemExample = '"hello world";charset="utf-8";length=5';
const parsedItem = HTTPFields.parse(itemExample, "item");
console.log("**Input:**");
console.log("```");
console.log(itemExample);
console.log("```\n");
console.log("**Parsed JSON:**");
console.log("```json");
console.log(JSON.stringify(parsedItem, null, 2));
console.log("```\n");
console.log("**Serialized back:**");
console.log("```");
console.log(HTTPFields.serialize(parsedItem, "item"));
console.log("```\n");

// Example 4: Creating Structured Data
console.log("## Example 4: Creating Structured Data\n");
const listData = [
  { value: HTTPFields.token("application/json"), parameters: { q: 0.9 } },
  { value: HTTPFields.token("text/html"), parameters: { q: 0.8 } },
  { value: HTTPFields.token("*/*"), parameters: { q: 0.1 } },
];
const serializedAccept = HTTPFields.serialize(listData, "list");
console.log("**JavaScript Code:**");
console.log("```javascript");
console.log("const listData = [");
console.log(
  "    { value: HTTPFields.token('application/json'), parameters: { q: 0.9 } },"
);
console.log(
  "    { value: HTTPFields.token('text/html'), parameters: { q: 0.8 } },"
);
console.log("    { value: HTTPFields.token('*/*'), parameters: { q: 0.1 } }");
console.log("];");
console.log("const serialized = HTTPFields.serialize(listData, 'list');");
console.log("```\n");
console.log("**Result (Accept header):**");
console.log("```");
console.log(serializedAccept);
console.log("```\n");

// Example 5: Binary Data
console.log("## Example 5: Binary Data\n");
const binaryExample = ":SGVsbG8gV29ybGQ=:";
const parsedBinary = HTTPFields.parse(binaryExample, "item");
console.log("**Input:**");
console.log("```");
console.log(binaryExample);
console.log("```\n");
console.log("**Parsed JSON:**");
console.log("```json");
console.log(JSON.stringify(parsedBinary, null, 2));
console.log("```\n");
console.log("**Decoded content:** `" + parsedBinary.value.decoded + "`\n");

// Example 6: Cache-Control Header
console.log("## Example 6: Cache-Control Header\n");
const cacheControlData = {
  "max-age": { value: 3600, parameters: {} },
  private: { value: true, parameters: {} },
  "must-revalidate": { value: true, parameters: {} },
};
const cacheControlHeader = HTTPFields.serialize(cacheControlData, "dictionary");
console.log("**Created Cache-Control header:**");
console.log("```");
console.log(cacheControlHeader);
console.log("```\n");

// Parse it back
const parsedCacheControl = HTTPFields.parse(cacheControlHeader, "dictionary");
console.log("**Parsed values:**");
console.log("- Max age: `" + parsedCacheControl["max-age"].value + "`");
console.log("- Is private: `" + parsedCacheControl.private.value + "`\n");

// Example 7: Complex Inner Lists
console.log("## Example 7: Complex Inner Lists\n");
const complexList =
  "method=(get post), format=json;version=2, flags=(a b c);test=?1";
const parsedComplex = HTTPFields.parse(complexList, "dictionary");
console.log("**Input:**");
console.log("```");
console.log(complexList);
console.log("```\n");
console.log("**Parsed JSON:**");
console.log("```json");
console.log(JSON.stringify(parsedComplex, null, 2));
console.log("```\n");

console.log("---\n");
console.log("✅ **Examples completed!** 🎉");
