# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.0] - 2025-01-06

### Initial Release

Complete JavaScript/TypeScript implementation of RFC 8941 and RFC 9651 Structured Field Values for HTTP.

### Features

#### Core RFC 8941 Implementation
- Complete implementation for Structured Field Values
- Support for all data types: Integers, Decimals, Strings, Tokens, Byte Sequences, Booleans
- Support for complex structures: Lists, Dictionaries, Inner Lists, Parameters
- Bidirectional parsing and serialization
- Strict error handling according to RFC requirements
- Helper functions for creating tokens and binary data

#### RFC 9651 Extensions
- Date values with `@` prefix (e.g., `@1672531200`)
- Display strings with `%` prefix for Unicode content (e.g., `%"Hello 世界"`)
- Helper functions: `date()` and `displayString()`

#### TypeScript Support
- Comprehensive type definitions in `types.d.ts`
- Full type safety for all structures
- Type guards for runtime type checking
- Utility types for advanced usage
- Strongly-typed API with generics

#### Developer Experience
- Zero dependencies
- ES Module support
- Browser and Node.js compatibility
- Extensive real-world examples
- Integration with standard Headers API
- Advanced use case examples (IoT, AI, blockchain, etc.)

#### Examples and Documentation
- `basic.mjs` - Basic usage examples
- `rfc9651.mjs` - RFC 9651 features (dates and display strings)
- `typescript-usage.ts` - TypeScript integration
- `comparison.mjs` - Library comparison examples
- `cookies.mjs` - Cookie handling examples
- `http-headers.mjs` - HTTP header integration
- `advanced.mjs` - Advanced use cases

#### Testing
- **1926 total tests** with 100% pass rate
- **1564 official HTTP Working Group parsing tests** from structured-field-tests repository
- **157 official HTTP Working Group serialization tests** 
- **48 custom feature tests** covering RFC 8941 and RFC 9651
- **157 additional RFC 9651 extension tests**
- Complete error handling and edge case coverage
- Round-trip parsing/serialization validation
- Control character validation in serialization
- JavaScript number rounding compliance
- Generated test cases for large values and edge conditions

#### RFC Compliance
- Strict RFC 8941 compliance with all official test cases passing
- Full RFC 9651 support for dates and display strings
- Proper validation of dictionary keys during serialization
- Control character rejection in strings and tokens
- Number range validation for both integers and decimals
- Parameter key validation following RFC specifications

### Recent Enhancements

#### Test Suite Expansion
- Expanded from 215 tests to **1926 tests** (899% increase)
- Added all available HTTP Working Group official test files:
  - `key-generated.json` - Dictionary key validation tests
  - `large-generated.json` - Large value handling tests  
  - `listlist.json` - List of lists functionality
  - `number-generated.json` - Generated number edge cases
  - `param-dict.json` - Dictionary parameter tests
  - `param-list.json` - List parameter tests
  - `param-listlist.json` - List of lists parameter tests
  - `string-generated.json` - Generated string validation tests
  - `token-generated.json` - Generated token validation tests
- Added complete serialization test suite (157 tests)
- Implemented proper test adapters for different test formats

#### Serialization Validation
- Added comprehensive dictionary key validation during serialization
- Implemented control character detection and rejection in strings
- Added token character validation following RFC 8941 tchar rules
- Enhanced number serialization with proper range validation
- Added parameter key validation for all parameter types
- Fixed JavaScript rounding differences to match RFC specifications

#### Bug Fixes
- Fixed leading zero validation in decimal numbers (e.g., "000000000000000.0")
- Fixed tab character handling in dictionary parsing
- Corrected token validation to reject invalid characters like "/"
- Enhanced error messages with specific character codes for debugging

### Technical Achievements

#### Production Readiness
- 100% pass rate across 1926 comprehensive tests
- Full RFC 8941 and RFC 9651 compliance verified against official test suites
- Robust error handling with descriptive error messages
- Memory-efficient parsing with character array manipulation
- Zero dependencies for maximum compatibility

#### API Improvements  
- Added `test:serialization` npm script for serialization-specific tests
- Added `test:all` npm script to run complete test suite
- Enhanced package.json with comprehensive test command coverage
- Improved TypeScript definitions for better IDE support

#### Competitive Position
- Narrowed test coverage gap with @badgateway/structured-headers (1926 vs 2805 tests)
- Achieved comparable RFC compliance with different API design philosophy
- Maintained zero dependencies while adding comprehensive validation
- Preserved developer-friendly JSON API structure throughout enhancements