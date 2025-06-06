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
- Comprehensive test suite covering all RFC 8941 features
- Full test coverage for RFC 9651 extensions
- Error handling and edge case tests
- Round-trip parsing/serialization tests