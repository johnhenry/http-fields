# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JavaScript implementation of RFC 8941 (Structured Field Values for HTTP) with RFC 9651 extensions (Dates and Display Strings). It provides bidirectional translation between structured HTTP header strings and JSON representations.

## Essential Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

**Note**: The build script references `scripts/build.mjs` which doesn't exist. The lint and format commands require ESLint and Prettier configs to be added.

## Architecture Overview

### Core Module Structure
The main implementation in `index.mjs` uses a revealing module pattern with clear separation between parsing and serialization:
- Parser functions consume character arrays by shifting elements as they process
- Each data type has dedicated parser and serializer functions
- All functions are pure with no global state

### Type System
Special wrapper objects distinguish certain types during serialization:
- `token()` - for unquoted identifiers
- `binary()` - for base64-encoded binary data
- `date()` - for RFC 9651 date values
- `displaystring()` - for RFC 9651 Unicode strings

### Error Handling
Following RFC 8941 requirements, any parsing error causes complete failure. The parser provides descriptive error messages indicating the exact issue.

### Testing Approach
Tests use Node.js built-in test runner and cover:
- Basic parsing for all data types  
- Parameter handling
- Complex structures (lists, dictionaries)
- Serialization and round-trip conversion
- Error cases
- Real-world examples (Cache-Control, Accept headers)
- RFC 9651 features (dates and display strings)

**Test Commands:**
- Run custom tests: `npm test` (47 tests)
- Run official HTTP WG tests: `npm run test:official` (168 tests - ALL PASSING!)
- Run all tests: `npm run test:all` (215 total tests)
- Run specific test: `node --test test/test.mjs -n "test name pattern"`

**Test Results:** ✅ 215/215 tests passing (47 custom + 168 official)

Our implementation now passes the complete official HTTP Working Group test suite while maintaining our developer-friendly API design.