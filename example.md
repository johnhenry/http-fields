
> structured-headers-rfc8941@0.0.0 example
> node examples/index.mjs

# RFC 8941 Structured Fields - Advanced Use Cases

## Example 1: Progressive Web App Feature Negotiation

**Client Capabilities Header:**
```http
x-client-capabilities: webgl2;confidence=0.95;fallback=webgl1, webassembly;confidence=1, service-workers;confidence=0.8, push-notifications;confidence=0.6;permission=prompt
```

**Server Bundle Response:**
```http
x-bundle-config: script=modern;size=45000, assets=webp;compression=brotli, features=(webgl-renderer wasm-compute)
```

## Example 2: AI Model Serving with Dynamic Parameters

**AI Model Request:**
```http
x-ai-inference: model=gpt-4;max-tokens=1000;temperature=0.7;top-p=0.9;fallback=gpt-3.5-turbo, format=streaming;chunk-size=512;buffer-timeout=100, safety=strict;content-filter;bias-check
```

**AI Model Response:**
```http
x-ai-response: gpt-4-turbo;compute-units=45;response-time=1.2;model-version="2024-03-15";safety-score=0.98
```

## Example 3: IoT Device Mesh Networking

**IoT Device Announcement:**
```http
x-device-capabilities: device-type=smart-thermostat, battery-level=0.73;low-power-mode=?0, mesh-role=router;max-connections=8;signal-strength=-45;bandwidth=2400000, sensors=(temperature;accuracy=0.1;update-freq=30 humidity;accuracy=2;update-freq=60 motion;detection-range=5), protocols=(zigbee;version="3.0" matter;commissioning)
```

## Example 4: CDN Content Delivery Optimization

**Client Profile:**
```http
x-client-profile: connection=4g;bandwidth=15000000;latency=45;data-cost=metered, device=mobile;screen-width=390;screen-height=844;pixel-ratio=3;memory=4096, preferences=adaptive;quality-over-speed=?0;preload-next;offline-capable
```

**CDN Delivery Strategy:**
```http
x-delivery-strategy: image-format=webp;quality=0.8;progressive, video-codec=av1;max-bitrate=2000000;adaptive-streaming, edge-node=us-west-2a;distance=15.2;cache-hit-ratio=0.94
```

## Example 5: Blockchain/Web3 Transaction Intent

**Transaction Intent:**
```http
x-transaction-intent: gas-strategy=dynamic;max-fee=50000000000;priority-fee=2000000000;speed=fast, slippage=0.005;auto-adjust, mev-protection;flashloan-guard;sandwich-protection=strict, wallet=metamask;version="10.22.0";hardware-wallet=?0
```

**DeFi Execution Plan:**
```http
x-execution-plan: swap-usdc-eth;expected-output=1.235;price-impact=0.002;route=uniswap-v3, stake-eth;validator=lido;apy=0.045;lock-period=0
```

## Example 6: ML Pipeline Orchestration

**ML Pipeline Configuration:**
```http
x-ml-pipeline: data-source=s3-bucket;partition-strategy=temporal;compression=parquet;estimated-size=15000000000, preprocessing=(normalize;method=z-score feature-selection;top-k=100);parallel-workers=8, model=transformer;layers=12;attention-heads=8;context-length=2048;checkpoint=latest, resources=gpu-cluster;min-gpus=4;max-cost-per-hour=12.5;spot-instances
```

## Example 7: AR Spatial Computing Session

**AR Session Requirements:**
```http
x-ar-session: tracking=world-scale;relocalization;occlusion=mesh-based;lighting=environmental, anchors=(:YW5jaG9yLXV1aWQtMQ==:;x=1.5;y=0;z=-2.3;confidence=0.97;persistence=cloud :YW5jaG9yLXV1aWQtMg==:;x=-0.8;y=1.2;z=0.5;confidence=0.89;persistence=local), rendering=pbr;shadow-quality=medium;reflection-probes=4;target-fps=60
```

## Example 8: Microservices Health Monitoring

**Service Health Status:**
```http
x-service-health: service-id=user-auth-service, health-score=0.94;trend=improving;sla-compliance=0.999, dependencies=(postgres-primary;latency=2.3;connection-pool=0.67;error-rate=0.001 redis-cluster;latency=0.8;hit-ratio=0.94;memory-usage=0.78), circuit-breakers=healthy;payment-service=half-open;notification-service=closed
```

## Example 9: Personalized Content Recommendations

**User Context for Recommendations:**
```http
x-user-context: session-intent=browse;time-budget=25;exploration-factor=0.3, privacy-preferences=selective;behavioral-tracking=?0;interest-categories;demographic-inference=age-range-only, content-signals=(tech;weight=0.8;recency=0.9 productivity;weight=0.6;recency=0.7 design;weight=0.4;recency=0.3);confidence=0.85, engagement-patterns=deep-reader;avg-time-on-page=180;scroll-depth=0.87;social-sharing=0.15
```

## Example 10: Complex Header Analysis

**Input Header:**
```http
x-ai-config: model=gpt-4;temp=0.7;tokens=1000, format=stream;chunks=512, safety=(content-filter bias-check);level=strict
```

**Parsed Analysis:**
```json
{
  "model": {
    "value": {
      "type": "token",
      "value": "gpt-4"
    },
    "parameters": {
      "temp": 0.7,
      "tokens": 1000
    }
  },
  "format": {
    "value": {
      "type": "token",
      "value": "stream"
    },
    "parameters": {
      "chunks": 512
    }
  },
  "safety": {
    "value": [
      {
        "value": {
          "type": "token",
          "value": "content-filter"
        },
        "parameters": {}
      },
      {
        "value": {
          "type": "token",
          "value": "bias-check"
        },
        "parameters": {}
      }
    ],
    "parameters": {
      "level": {
        "type": "token",
        "value": "strict"
      }
    }
  }
}
```

**Extracted Information:**
- **Model:** `gpt-4`
- **Temperature:** `0.7`
- **Max tokens:** `1000`
- **Format:** `stream`
- **Chunk size:** `512`
- **Safety level:** `strict`
- **Safety features:** `content-filter, bias-check`

---

✅ **Advanced Use Cases completed!** 🚀
# RFC 8941 Structured Fields - Basic Examples

## Example 1: Basic List Parsing

**Input:**
```
sugar, tea, rum
```

**Parsed JSON:**
```json
[
  {
    "value": {
      "type": "token",
      "value": "sugar"
    },
    "parameters": {}
  },
  {
    "value": {
      "type": "token",
      "value": "tea"
    },
    "parameters": {}
  },
  {
    "value": {
      "type": "token",
      "value": "rum"
    },
    "parameters": {}
  }
]
```

**Serialized back:**
```
sugar, tea, rum
```

## Example 2: Dictionary with Parameters

**Input:**
```
a=1, b=2;x=y, c=(foo bar)
```

**Parsed JSON:**
```json
{
  "a": {
    "value": 1,
    "parameters": {}
  },
  "b": {
    "value": 2,
    "parameters": {
      "x": {
        "type": "token",
        "value": "y"
      }
    }
  },
  "c": {
    "value": [
      {
        "value": {
          "type": "token",
          "value": "foo"
        },
        "parameters": {}
      },
      {
        "value": {
          "type": "token",
          "value": "bar"
        },
        "parameters": {}
      }
    ],
    "parameters": {}
  }
}
```

**Serialized back:**
```
a=1, b=2;x=y, c=(foo bar)
```

## Example 3: Item with Parameters

**Input:**
```
"hello world";charset="utf-8";length=5
```

**Parsed JSON:**
```json
{
  "value": "hello world",
  "parameters": {
    "charset": "utf-8",
    "length": 5
  }
}
```

**Serialized back:**
```
"hello world";charset="utf-8";length=5
```

## Example 4: Creating Structured Data

**JavaScript Code:**
```javascript
const listData = [
    { value: StructuredFields.token('application/json'), parameters: { q: 0.9 } },
    { value: StructuredFields.token('text/html'), parameters: { q: 0.8 } },
    { value: StructuredFields.token('*/*'), parameters: { q: 0.1 } }
];
const serialized = StructuredFields.serialize(listData, 'list');
```

**Result (Accept header):**
```
application/json;q=0.9, text/html;q=0.8, */*;q=0.1
```

## Example 5: Binary Data

**Input:**
```
:SGVsbG8gV29ybGQ=:
```

**Parsed JSON:**
```json
{
  "value": {
    "type": "binary",
    "value": "SGVsbG8gV29ybGQ=",
    "decoded": "Hello World"
  },
  "parameters": {}
}
```

**Decoded content:** `Hello World`

## Example 6: Cache-Control Header

**Created Cache-Control header:**
```
max-age=3600, private, must-revalidate
```

**Parsed values:**
- Max age: `3600`
- Is private: `true`

## Example 7: Complex Inner Lists

**Input:**
```
method=(get post), format=json;version=2, flags=(a b c);test=?1
```

**Parsed JSON:**
```json
{
  "method": {
    "value": [
      {
        "value": {
          "type": "token",
          "value": "get"
        },
        "parameters": {}
      },
      {
        "value": {
          "type": "token",
          "value": "post"
        },
        "parameters": {}
      }
    ],
    "parameters": {}
  },
  "format": {
    "value": {
      "type": "token",
      "value": "json"
    },
    "parameters": {
      "version": 2
    }
  },
  "flags": {
    "value": [
      {
        "value": {
          "type": "token",
          "value": "a"
        },
        "parameters": {}
      },
      {
        "value": {
          "type": "token",
          "value": "b"
        },
        "parameters": {}
      },
      {
        "value": {
          "type": "token",
          "value": "c"
        },
        "parameters": {}
      }
    ],
    "parameters": {
      "test": true
    }
  }
}
```

---

✅ **Examples completed!** 🎉
# Side-by-Side Comparison: Our Implementation vs @badgateway/structured-headers

## Example 1: Basic Parsing Comparison

**Input:** `a=1, b="hello";q=0.9, c=?1`

**Our Implementation:**
```javascript
import StructuredFields from "structured-fields-rfc8941";
const result = StructuredFields.parse('a=1, b="hello";q=0.9, c=?1', 'dictionary');
```

**Our Result:**
```json
{
  "a": {
    "value": 1,
    "parameters": {}
  },
  "b": {
    "value": "hello",
    "parameters": {
      "q": 0.9
    }
  },
  "c": {
    "value": true,
    "parameters": {}
  }
}
```

**@badgateway Implementation:**
```javascript
import { parseDictionary } from "structured-headers";
const result = parseDictionary('a=1, b="hello";q=0.9, c=?1');
// Returns: Map {
//   "a" => [1, Map {}],
//   "b" => ["hello", Map { "q" => 0.9 }],
//   "c" => [true, Map {}]
// }
```

## Example 2: Working with Parsed Results

**Accessing Values - Our Implementation:**
```javascript
const aValue = result.a.value;              // 1
const bValue = result.b.value;              // "hello"
const bQuality = result.b.parameters.q;     // 0.9
const cValue = result.c.value;              // true
```

**Accessing Values - @badgateway:**
```javascript
const [aValue] = result.get("a");           // 1
const [bValue, bParams] = result.get("b");   // ["hello", Map]
const bQuality = bParams.get("q");          // 0.9
const [cValue] = result.get("c");           // true
```

## Example 3: Creating Structured Data

**Our Implementation:**
```javascript
const data = {
  accept: {
    value: StructuredFields.token("application/json"),
    parameters: { q: 0.9 }
  },
  cache: { value: true, parameters: {} }
};
const header = StructuredFields.serialize(data, "dictionary");
// Result: "accept=application/json;q=0.9, cache"
```

**@badgateway Implementation:**
```javascript
const data = new Map([
  ["accept", ["application/json", new Map([["q", 0.9]])]],
  ["cache", [true, new Map()]]
]);
const header = serializeDictionary(data);
// Result: "accept=application/json;q=0.9, cache"
```

## Example 4: Type Handling Comparison

**Data Types - Our Implementation:**
```javascript
// Different types with our library
const examples = {
  number: { value: 42, parameters: {} },
  decimal: { value: 3.14, parameters: {} },
  string: { value: "hello", parameters: {} },
  token: { value: StructuredFields.token("app"), parameters: {} },
  binary: { value: StructuredFields.binary("SGVsbG8="), parameters: {} },
  boolean: { value: true, parameters: {} }
};
```

**Data Types - @badgateway:**
```javascript
// Different types with @badgateway
const examples = new Map([
  ["number", [42, new Map()]],
  ["decimal", [3.14, new Map()]],
  ["string", ["hello", new Map()]],
  ["token", ["app", new Map()]],  // Just a string
  ["binary", [new ArrayBuffer(5), new Map()]],
  ["boolean", [true, new Map()]]
]);
```

## Example 5: Error Handling

**Our Implementation:**
```javascript
try {
  const result = StructuredFields.parse("invalid[", "list");
} catch (error) {
  console.error("Parsing failed:", error.message);
  // Handle gracefully - treat as if header not present
}
```

**@badgateway Implementation:**
```javascript
try {
  const result = parseList("invalid[");
} catch (error) {
  console.error("Parsing failed:", error.message);
  // Handle gracefully - treat as if header not present
}
```

## Example 6: Integration with HTTP Headers

**Our Implementation - Utility Class:**
```javascript
class StructuredHeaders {
  constructor(headers = new Headers()) {
    this.headers = headers;
  }
  
  getStructured(name, type) {
    const value = this.headers.get(name);
    return value ? StructuredFields.parse(value, type) : null;
  }
  
  setStructured(name, data, type) {
    const value = StructuredFields.serialize(data, type);
    this.headers.set(name, value);
  }
}
```

**@badgateway Implementation:**
```javascript
import { parseDictionary, serializeDictionary } from "structured-headers";

class StructuredHeaders {
  constructor(headers = new Headers()) {
    this.headers = headers;
  }
  
  getDictionary(name) {
    const value = this.headers.get(name);
    return value ? parseDictionary(value) : null;
  }
  
  setDictionary(name, data) {
    const value = serializeDictionary(data);
    this.headers.set(name, value);
  }
}
```

## Example 7: Advanced Features

**@badgateway Unique Features:**
```javascript
// Timestamps (RFC 9651)
parseItem("@1640995200");  // Returns Date object

// Display Strings (Unicode)
parseItem('%"Frysl%C3%A2n"');  // Unicode support
```

**Our Implementation Unique Features:**
```javascript
// Structured cookies
const cookieData = {
  theme: { value: StructuredFields.token("dark"), parameters: {} },
  notifications: { value: true, parameters: { email: true } }
};
document.cookie = `prefs=${StructuredFields.serialize(cookieData, "dictionary")}`;

// Advanced use case examples
const iotDevice = {
  "device-type": { value: StructuredFields.token("thermostat"), parameters: {} },
  "battery-level": { value: 0.73, parameters: { "low-power": false } }
};
```

## Example 8: Bundle Size and Performance

**Bundle Size Comparison:**
- **Our Implementation:** ~15KB minified
- **@badgateway:** ~25KB minified (includes TypeScript overhead)

**Memory Usage:**
- **Our Implementation:** Lower (plain JavaScript objects)
- **@badgateway:** Higher (Map objects and tuples)

**Development Experience:**
- **Our Implementation:** Simpler mental model, extensive examples
- **@badgateway:** TypeScript support, maximum RFC compliance

## Example 9: Migration Between Libraries

**Converting @badgateway to Our Format:**
```javascript
function convertFromBadgateway(badgatewayResult) {
  const result = {};
  for (const [key, [value, params]] of badgatewayResult) {
    const parameters = {};
    for (const [paramKey, paramValue] of params) {
      parameters[paramKey] = paramValue;
    }
    result[key] = { value, parameters };
  }
  return result;
}
```

**Converting Our Format to @badgateway:**
```javascript
function convertToBadgateway(ourResult) {
  const result = new Map();
  for (const [key, {value, parameters}] of Object.entries(ourResult)) {
    const params = new Map(Object.entries(parameters));
    result.set(key, [value, params]);
  }
  return result;
}
```

---

## 🎯 Summary

**Choose Our Implementation for:**
- 🚀 **Rapid development** and prototyping
- 📚 **Learning** RFC 8941 concepts
- 🍪 **Cookie applications** with structured data
- 🎨 **Creative use cases** (IoT, AI, blockchain)
- 📖 **Rich documentation** and examples

**Choose @badgateway for:**
- 🏢 **Production systems** requiring maximum compliance
- 📊 **TypeScript projects** with strong typing
- ⏰ **Timestamp support** and advanced features
- 🔧 **HTTP library development**
- ✅ **Enterprise applications** with strict requirements

Both libraries are excellent - the choice depends on your specific needs! 🎉
# Using RFC 8941 Structured Fields with Cookies

## Example 1: User Preferences Cookie

**Structured Cookie Value:**
```http
Set-Cookie: preferences=theme=dark, language=en-US, timezone=America/New_York, notifications;email;push=?0;frequency=daily; Path=/; Max-Age=2592000
```

**JavaScript Cookie Parsing:**
```javascript
// Extract cookie value from document.cookie or request headers
const cookieValue = "theme=dark, language=en-US, timezone=America/New_York, notifications;email;push=?0;frequency=daily";
const preferences = StructuredFields.parse(cookieValue, "dictionary");
```

**Parsed Preferences:**
```json
{
  "theme": {
    "value": {
      "type": "token",
      "value": "dark"
    },
    "parameters": {}
  },
  "language": {
    "value": {
      "type": "token",
      "value": "en-US"
    },
    "parameters": {}
  },
  "timezone": {
    "value": {
      "type": "token",
      "value": "America/New_York"
    },
    "parameters": {}
  },
  "notifications": {
    "value": true,
    "parameters": {
      "email": true,
      "push": false,
      "frequency": {
        "type": "token",
        "value": "daily"
      }
    }
  }
}
```

## Example 2: Shopping Cart Cookie

**Shopping Cart Cookie:**
```http
Set-Cookie: cart=item-123;quantity=2;price=29.99;variant=red-large, item-456;quantity=1;price=15.5;variant=blue-medium, item-789;quantity=3;price=8.99; Path=/; Max-Age=86400
```

**Cart Analysis:**
- **Total items:** `6`
- **Total price:** `$102.45`

## Example 3: Complex Session State

**Session Cookie:**
```http
Set-Cookie: session=user-id=user_12345, session-start=1640995200, last-activity=1640998800, permissions=(read write;scope=own admin;expires=1641081600), features=premium;trial-end=1643673600;auto-renew; Path=/; Secure; HttpOnly; SameSite=Strict
```

## Example 4: A/B Testing Configuration

**A/B Testing Cookie:**
```http
Set-Cookie: ab_tests=homepage-v2;variant=treatment;confidence=0.95;started=1640995200, checkout-flow;variant=control;confidence=0.87, pricing-display;variant=variant-b;confidence=0.92;segment=premium-users; Path=/; Max-Age=604800
```

## Example 5: Privacy-Compliant Analytics

**Analytics Cookie:**
```http
Set-Cookie: analytics=session-id=:c2Vzc18xNzQ5MjY5Nzc4MzU2:, consent=essential-only;version=2;timestamp=1640995200, tracking=?0, preferences=(performance;enabled=?0 functional;enabled targeting;enabled=?0); Path=/; Max-Age=31536000; SameSite=Lax
```

## Example 6: Cookie Utility Functions

**JavaScript Utility Functions:**
```javascript
class StructuredCookies {
    // Set a structured cookie
    static set(name, data, type, options = {}) {
        try {
            const value = StructuredFields.serialize(data, type);
            const cookieOptions = Object.entries(options)
                .map(([key, val]) => `${key}=${val}`)
                .join("; ");
            document.cookie = `${name}=${value}; ${cookieOptions}`;
        } catch (error) {
            console.error("Failed to set structured cookie:", error);
        }
    }

    // Get and parse a structured cookie
    static get(name, type) {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find(c => c.startsWith(`${name}=`));
        if (!cookie) return null;

        const value = cookie.substring(name.length + 1);
        try {
            return StructuredFields.parse(value, type);
        } catch (error) {
            console.error("Failed to parse structured cookie:", error);
            return null;
        }
    }

    // Update part of a dictionary cookie
    static update(name, key, value, options = {}) {
        const current = this.get(name, "dictionary") || {};
        current[key] = { value, parameters: {} };
        this.set(name, current, "dictionary", options);
    }
}
```

## Example 7: Server-Side Cookie Handling

**Express.js Middleware:**
```javascript
import StructuredFields from "structured-fields-rfc8941";

// Middleware to parse structured cookies
function parseStructuredCookies(req, res, next) {
    req.structuredCookies = {};
    
    // Define which cookies use structured fields
    const structuredCookieMap = {
        "preferences": "dictionary",
        "cart": "list",
        "session": "dictionary",
        "ab_tests": "list"
    };
    
    Object.entries(structuredCookieMap).forEach(([name, type]) => {
        if (req.cookies[name]) {
            try {
                req.structuredCookies[name] = 
                    StructuredFields.parse(req.cookies[name], type);
            } catch (error) {
                console.warn(`Invalid structured cookie ${name}:`, error);
            }
        }
    });
    
    next();
}
```

## Example 8: Migration from Traditional Cookies

**Migration Approach:**
1. **Dual Format Support** - Read both old and new cookie formats
2. **Gradual Rollout** - Set both formats initially, then phase out old format
3. **Fallback Parsing** - Try structured parsing first, fall back to legacy parsing

**Migration Code Example:**
```javascript
function getPreferences(req) {
    // Try new structured format first
    if (req.cookies.preferences_v2) {
        try {
            return StructuredFields.parse(req.cookies.preferences_v2, "dictionary");
        } catch (error) {
            console.warn("Failed to parse structured preferences:", error);
        }
    }
    
    // Fall back to legacy format
    if (req.cookies.preferences) {
        return parseLegacyPreferences(req.cookies.preferences);
    }
    
    return null;
}
```

---

✅ **Cookie examples completed!** 🍪
# RFC 8941 Structured Fields - HTTP Headers Examples

## Example 1: Creating Request Headers

**Generated Request Headers:**
```http
accept: application/json;q=0.9, application/xml;q=0.8, */*;q=0.1
x-api-preferences: version=2, format=compact, include-metadata
x-client-info: MyApp;version="1.2.3";platform=web
```

## Example 2: Parsing Response Headers

**Raw Response Headers:**
```http
cache-control: max-age=3600, private, must-revalidate
x-feature-flags: experimental-ui=?1, dark-mode=?0, beta-features
x-rate-limit: 1000;window=3600;remaining=942
```

**Parsed Cache-Control:**
- Max age: `3600`
- Is private: `true`
- Must revalidate: `true`

**Parsed Rate Limit:**
- Limit: `1000`
- Window: `3600` seconds
- Remaining: `942`

**Parsed Feature Flags:**
- Experimental UI: `true`
- Dark mode: `false`
- Beta features: `true`

## Example 3: Content Negotiation

**Client Capabilities:**
```http
x-client-capabilities: webp;quality=0.9, avif;quality=0.95;fallback=webp, gzip, brotli;preference=1
```

**Server Response:**
```http
x-content-optimization: image-format=avif;quality=0.85, compression=brotli;level=6, optimization
```

## Example 4: API Versioning and Metadata

**API Version Header:**
```http
x-api-version: v2.1;deprecated=?0;sunset-date="2025-12-31";migration-guide="https://api.example.com/migrate"
```

**Service Metadata Header:**
```http
x-service-metadata: service-id=user-service, instance=us-west-2a;load-factor=0.67;health-score=0.98, features=(rate-limiting caching;ttl=300 monitoring)
```

## Example 5: Security and Auth Context

**Security Context Header:**
```http
x-security-context: auth-method=oauth2;scope="read write";token-type=bearer, csrf-protection, rate-limiting=user-based;requests-per-hour=1000;burst-limit=50, permissions=(users:read posts:write;scope=own)
```

## Example 6: Performance Hints

**Client Performance Hints:**
```http
x-performance-hints: connection;type=4g;bandwidth=15000000;latency=45, device;type=mobile;cpu-cores=4;memory=4096, preferences;data-saver;quality-over-speed=?0
```

**Server Optimization Response:**
```http
x-optimization: image-quality=0.7, compression=aggressive, preload=?0;reason=data-saver, cdn-node=edge-closest;distance=12.5
```

## Example 7: Real Fetch Integration

**JavaScript Code:**
```javascript
const requestConfig = createApiRequest('/api/users', {
    method: 'GET',
    headers: {
        'authorization': 'Bearer token123'
    }
});
```

**Generated Request Headers:**
```http
accept: application/json;version=2, application/hal+json;q=0.8
authorization: Bearer token123
x-client-metadata: web-app;version="1.0.0";user-agent="StructuredFieldsDemo/1.0"
```

---

✅ **HTTP Headers Examples completed!** 🎉
RFC 9651 - Dates and Display Strings Examples
=============================================

1. Date Values:
Parsed date: {
  value: { type: 'date', value: 2023-01-01T00:00:00.000Z },
  parameters: {}
}
As JavaScript Date: 2023-01-01T00:00:00.000Z
ISO String: 2023-01-01T00:00:00.000Z

Serialized date with parameter: @1767225599;priority=high

Timing dictionary: start=@1704067200, end=@1735689599, duration=365;unit=days

2. Display String Values:
Parsed display string: { value: { type: 'displaystring', value: 'Hello 世界' }, parameters: {} }
Unicode value: Hello 世界

Serialized display string: %"Welcome to Tokyo %e6%9d%b1%e4%ba%ac%e3%81%b8%e3%82%88%e3%81%86%e3%81%93%e3%81%9d";lang=ja

3. Mixed RFC 9651 Features:
Event list: %"Conference %e4%bc%9a%e8%ad%b0";type=event, @1718442000;timezone=JST, tokyo-convention-center

Parsed event list:
  [0] Display String: "Conference 会議"
       Parameters: { type: { type: 'token', value: 'event' } }
  [1] Date: 2024-06-15T09:00:00.000Z
       Parameters: { timezone: { type: 'token', value: 'JST' } }
  [2] Token: tokyo-convention-center

4. Localized Content Example:
Localized content: title-en=%"Product Catalog", title-ja=%"%e8%a3%bd%e5%93%81%e3%82%ab%e3%82%bf%e3%83%ad%e3%82%b0", title-zh=%"%e4%ba%a7%e5%93%81%e7%9b%ae%e5%bd%95", updated=@1749269778

5. Error Handling:
Invalid date (decimal): Date timestamp must be an integer
Invalid hex in display string: Invalid hex digits in percent encoding
Date out of range: Date out of supported range
