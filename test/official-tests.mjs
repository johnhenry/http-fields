import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import StructuredFields from '../index.mjs';
import { base64ToBase32 } from './base32.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helper function to convert expected format to our format
function convertExpected(expected, headerType) {
    if (!expected) return expected;
    
    if (headerType === 'item') {
        const [value, params] = expected;
        return { value: convertValue(value), parameters: convertParams(params) };
    } else if (headerType === 'list') {
        return expected.map(item => {
            if (Array.isArray(item) && item.length === 2) {
                const [value, params] = item;
                return { value: convertValue(value), parameters: convertParams(params) };
            } else if (Array.isArray(item) && Array.isArray(item[0])) {
                // Inner list
                const [innerList, params] = item;
                return {
                    value: innerList.map(innerItem => {
                        const [innerValue, innerParams] = innerItem;
                        return { value: convertValue(innerValue), parameters: convertParams(innerParams) };
                    }),
                    parameters: convertParams(params)
                };
            }
            return item;
        });
    } else if (headerType === 'dictionary') {
        const result = {};
        // Dictionary format in official tests is array of [key, [value, params]] tuples
        for (const [key, valueWithParams] of expected) {
            if (Array.isArray(valueWithParams) && valueWithParams.length === 2) {
                const [itemValue, params] = valueWithParams;
                result[key] = { value: convertValue(itemValue), parameters: convertParams(params) };
            } else {
                result[key] = { value: convertValue(valueWithParams), parameters: {} };
            }
        }
        return result;
    }
    
    return expected;
}

function convertValue(value) {
    if (value && typeof value === 'object' && value.__type) {
        switch (value.__type) {
            case 'token':
                return { type: 'token', value: value.value };
            case 'binary':
                return { type: 'binary', value: value.value };
            case 'date':
                return { type: 'date', value: new Date(value.value * 1000) };
            case 'displaystring':
                return { type: 'displaystring', value: value.value };
            default:
                return value.value;
        }
    }
    return value;
}

function convertParams(params) {
    if (!Array.isArray(params)) return {};
    
    const result = {};
    for (const [key, value] of params) {
        result[key] = convertValue(value);
    }
    return result;
}

// Normalize our result format to match official test expectations
function normalizeForComparison(result, headerType) {
    if (headerType === 'item') {
        return normalizeValue(result);
    } else if (headerType === 'list') {
        return result.map(normalizeValue);
    } else if (headerType === 'dictionary') {
        const normalized = {};
        for (const [key, item] of Object.entries(result)) {
            normalized[key] = normalizeValue(item);
        }
        return normalized;
    }
    return result;
}

function normalizeValue(item) {
    if (!item || typeof item !== 'object') return item;
    
    let normalizedValue = item.value;
    
    // Convert binary values to base32 format expected by official tests
    if (normalizedValue && typeof normalizedValue === 'object' && normalizedValue.type === 'binary') {
        normalizedValue = {
            type: 'binary',
            value: base64ToBase32(normalizedValue.value)
        };
    }
    
    // Handle inner lists - convert to official test format [value, params] tuples
    if (Array.isArray(normalizedValue)) {
        normalizedValue = normalizedValue.map(innerItem => {
            if (innerItem && typeof innerItem === 'object' && 'value' in innerItem) {
                // Convert inner list item to [value, params] tuple format
                let normalizedInnerValue = innerItem.value;
                if (normalizedInnerValue && typeof normalizedInnerValue === 'object') {
                    if (normalizedInnerValue.type === 'binary') {
                        normalizedInnerValue = { type: 'binary', value: base64ToBase32(normalizedInnerValue.value) };
                    } else if (normalizedInnerValue.type === 'token') {
                        normalizedInnerValue = { __type: 'token', value: normalizedInnerValue.value };
                    } else if (normalizedInnerValue.type === 'date') {
                        normalizedInnerValue = { __type: 'date', value: Math.floor(normalizedInnerValue.value.getTime() / 1000) };
                    } else if (normalizedInnerValue.type === 'displaystring') {
                        normalizedInnerValue = { __type: 'displaystring', value: normalizedInnerValue.value };
                    }
                }
                    
                const params = Object.entries(innerItem.parameters || {}).map(([key, value]) => {
                    // Convert parameter values to official test format
                    const convertedValue = value && typeof value === 'object' && value.type === 'binary' 
                        ? { type: 'binary', value: base64ToBase32(value.value) }
                        : value;
                    return [key, convertedValue];
                });
                return [normalizedInnerValue, params];
            }
            return innerItem;
        });
    }
    
    return {
        value: normalizedValue,
        parameters: item.parameters || {}
    };
}

// Load and run official tests
function loadOfficialTests(filename) {
    const testPath = join(__dirname, 'official/test/official', filename);
    try {
        const content = readFileSync(testPath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.warn(`Could not load test file ${filename}:`, error.message);
        return [];
    }
}

function runOfficialTestSuite(filename, suiteName) {
    const tests = loadOfficialTests(filename);
    
    if (tests.length === 0) {
        console.warn(`No tests found in ${filename}`);
        return;
    }

    describe(`Official Tests: ${suiteName}`, () => {
        for (const testCase of tests) {
            const testName = `${testCase.name}`;
            
            test(testName, () => {
                // Handle multi-line headers by joining with comma and space
                const raw = testCase.raw.join(', ');
                const headerType = testCase.header_type;
                const mustFail = testCase.must_fail || false;
                const expected = testCase.expected;

                if (mustFail) {
                    // Test should fail
                    assert.throws(() => {
                        StructuredFields.parse(raw, headerType);
                    }, `Expected "${raw}" to fail parsing but it didn't`);
                } else {
                    // Test should succeed
                    try {
                        const result = StructuredFields.parse(raw, headerType);
                        const convertedExpected = convertExpected(expected, headerType);
                        
                        // Convert our result to match official test format for comparison
                        const normalizedResult = normalizeForComparison(result, headerType);
                        
                        // For debugging failed tests
                        if (JSON.stringify(normalizedResult) !== JSON.stringify(convertedExpected)) {
                            console.log('\nTest:', testName);
                            console.log('Raw:', raw);
                            console.log('Expected:', JSON.stringify(convertedExpected, null, 2));
                            console.log('Actual:', JSON.stringify(normalizedResult, null, 2));
                        }
                        
                        assert.deepStrictEqual(normalizedResult, convertedExpected);
                    } catch (error) {
                        throw new Error(`Failed to parse "${raw}": ${error.message}`);
                    }
                }
            });
        }
    });
}

// Run all official test suites
runOfficialTestSuite('item.json', 'Items');
runOfficialTestSuite('list.json', 'Lists');
runOfficialTestSuite('dictionary.json', 'Dictionaries');
runOfficialTestSuite('binary.json', 'Binary Data');
runOfficialTestSuite('boolean.json', 'Booleans');
runOfficialTestSuite('number.json', 'Numbers');
runOfficialTestSuite('string.json', 'Strings');
runOfficialTestSuite('token.json', 'Tokens');
runOfficialTestSuite('date.json', 'Dates (RFC 9651)');
runOfficialTestSuite('display-string.json', 'Display Strings (RFC 9651)');
runOfficialTestSuite('examples.json', 'Examples');