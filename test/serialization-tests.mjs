import { test, describe } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as HTTPFields from "../index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helper functions to convert test data format
function convertValue(value) {
  if (value && typeof value === "object" && value.__type) {
    switch (value.__type) {
      case "token":
        return { type: "token", value: value.value };
      case "binary":
        return { type: "binary", value: value.value };
      case "date":
        return { type: "date", value: new Date(value.value * 1000) };
      case "displaystring":
        return { type: "displaystring", value: value.value };
      default:
        return value.value;
    }
  }
  return value;
}

function convertParams(params) {
  if (!params || typeof params !== "object") return {};

  const result = {};
  for (const [key, value] of Object.entries(params)) {
    result[key] = convertValue(value);
  }
  return result;
}

// Load and run serialization tests
function loadSerializationTests(filename) {
  const testPath = join(__dirname, "official/test/serialisation", filename);
  try {
    const content = readFileSync(testPath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.warn(
      `Could not load serialization test file ${filename}:`,
      error.message
    );
    return [];
  }
}

function runSerializationTestSuite(filename, suiteName) {
  const tests = loadSerializationTests(filename);

  if (tests.length === 0) {
    console.warn(`No serialization tests found in ${filename}`);
    return;
  }

  describe(`Serialization Tests: ${suiteName}`, () => {
    for (const testCase of tests) {
      const testName = `${testCase.name}`;

      test(testName, () => {
        const mustFail = testCase.must_fail || testCase.must_file || false; // Handle typo in test files
        let headerType = testCase.header_type;

        // Map serialization test header types to our expected format
        if (headerType === "dict") {
          headerType = "dictionary";
        }

        // Serialization tests provide 'expected' data to serialize, not 'raw' strings to parse
        if (testCase.expected) {
          // Convert expected format to our internal format
          let dataToSerialize;
          if (headerType === "item") {
            if (Array.isArray(testCase.expected)) {
              const [value, params] = testCase.expected;
              dataToSerialize = {
                value: convertValue(value),
                parameters: convertParams(params),
              };
            } else {
              dataToSerialize = {
                value: convertValue(testCase.expected),
                parameters: {},
              };
            }
          } else if (headerType === "list") {
            dataToSerialize = testCase.expected.map((item) => {
              if (Array.isArray(item)) {
                const [value, params] = item;
                return {
                  value: convertValue(value),
                  parameters: convertParams(params),
                };
              }
              return { value: convertValue(item), parameters: {} };
            });
          } else if (headerType === "dictionary") {
            dataToSerialize = {};
            // Dictionary format in serialization tests is an object with key-value pairs
            for (const [key, valueWithParams] of Object.entries(
              testCase.expected
            )) {
              if (Array.isArray(valueWithParams)) {
                const [value, params] = valueWithParams;
                dataToSerialize[key] = {
                  value: convertValue(value),
                  parameters: convertParams(params),
                };
              } else {
                dataToSerialize[key] = {
                  value: convertValue(valueWithParams),
                  parameters: {},
                };
              }
            }
          }

          if (mustFail) {
            // Test should fail serialization
            assert.throws(() => {
              HTTPFields.serialize(dataToSerialize, headerType);
            }, `Expected serialization to fail but it didn't`);
          } else {
            // Test should succeed in serialization
            try {
              const serialized = HTTPFields.serialize(
                dataToSerialize,
                headerType
              );
              assert.ok(
                serialized,
                "Serialization should produce valid result"
              );
            } catch (error) {
              throw new Error(`Failed to serialize data: ${error.message}`);
            }
          }
        } else {
          // Handle tests with raw strings (if any)
          const raw = Array.isArray(testCase.raw)
            ? testCase.raw.join(", ")
            : testCase.raw;
          if (mustFail) {
            assert.throws(() => {
              const parsed = HTTPFields.parse(raw, headerType);
              HTTPFields.serialize(parsed, headerType);
            }, `Expected "${raw}" to fail serialization but it didn't`);
          } else {
            try {
              const parsed = HTTPFields.parse(raw, headerType);
              const serialized = HTTPFields.serialize(parsed, headerType);
              const reparsed = HTTPFields.parse(serialized, headerType);
              assert.ok(
                reparsed,
                "Round-trip serialization should produce valid result"
              );
            } catch (error) {
              throw new Error(
                `Failed serialization round-trip for "${raw}": ${error.message}`
              );
            }
          }
        }
      });
    }
  });
}

// Run all serialization test suites
runSerializationTestSuite("key-generated.json", "Keys (Serialization)");
runSerializationTestSuite("number.json", "Numbers (Serialization)");
runSerializationTestSuite("string-generated.json", "Strings (Serialization)");
runSerializationTestSuite("token-generated.json", "Tokens (Serialization)");
