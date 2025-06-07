import HTTPFields from "../index.mjs";

console.log("# Using RFC 8941 Structured Fields with Cookies\n");

// Example 1: User Preferences Cookie
console.log("## Example 1: User Preferences Cookie\n");

const userPreferences = {
  theme: { value: HTTPFields.token("dark"), parameters: {} },
  language: { value: HTTPFields.token("en-US"), parameters: {} },
  timezone: { value: HTTPFields.token("America/New_York"), parameters: {} },
  notifications: {
    value: true,
    parameters: {
      email: true,
      push: false,
      frequency: HTTPFields.token("daily"),
    },
  },
};

const preferencesValue = HTTPFields.serialize(userPreferences, "dictionary");
console.log("**Structured Cookie Value:**");
console.log("```http");
console.log(
  "Set-Cookie: preferences=" + preferencesValue + "; Path=/; Max-Age=2592000"
);
console.log("```\n");

// Parsing the cookie back
console.log("**JavaScript Cookie Parsing:**");
console.log("```javascript");
console.log("// Extract cookie value from document.cookie or request headers");
console.log('const cookieValue = "' + preferencesValue + '";');
console.log('const preferences = HTTPFields.parse(cookieValue, "dictionary");');
console.log("```\n");

const parsedPrefs = HTTPFields.parse(preferencesValue, "dictionary");
console.log("**Parsed Preferences:**");
console.log("```json");
console.log(JSON.stringify(parsedPrefs, null, 2));
console.log("```\n");

// Example 2: Shopping Cart Cookie
console.log("## Example 2: Shopping Cart Cookie\n");

const cartItems = [
  {
    value: HTTPFields.token("item-123"),
    parameters: {
      quantity: 2,
      price: 29.99,
      variant: HTTPFields.token("red-large"),
    },
  },
  {
    value: HTTPFields.token("item-456"),
    parameters: {
      quantity: 1,
      price: 15.5,
      variant: HTTPFields.token("blue-medium"),
    },
  },
  {
    value: HTTPFields.token("item-789"),
    parameters: {
      quantity: 3,
      price: 8.99,
    },
  },
];

const cartValue = HTTPFields.serialize(cartItems, "list");
console.log("**Shopping Cart Cookie:**");
console.log("```http");
console.log("Set-Cookie: cart=" + cartValue + "; Path=/; Max-Age=86400");
console.log("```\n");

console.log("**Cart Analysis:**");
const parsedCart = HTTPFields.parse(cartValue, "list");
let totalPrice = 0;
let totalItems = 0;

parsedCart.forEach((item) => {
  const quantity = item.parameters.quantity || 1;
  const price = item.parameters.price || 0;
  totalItems += quantity;
  totalPrice += quantity * price;
});

console.log("- **Total items:** `" + totalItems + "`");
console.log("- **Total price:** `$" + totalPrice.toFixed(2) + "`\n");

// Example 3: Session State Cookie
console.log("## Example 3: Complex Session State\n");

const sessionState = {
  "user-id": { value: HTTPFields.token("user_12345"), parameters: {} },
  "session-start": { value: 1640995200, parameters: {} },
  "last-activity": { value: 1640998800, parameters: {} },
  permissions: {
    value: [
      { value: HTTPFields.token("read"), parameters: {} },
      {
        value: HTTPFields.token("write"),
        parameters: { scope: HTTPFields.token("own") },
      },
      { value: HTTPFields.token("admin"), parameters: { expires: 1641081600 } },
    ],
    parameters: {},
  },
  features: {
    value: HTTPFields.token("premium"),
    parameters: {
      "trial-end": 1643673600,
      "auto-renew": true,
    },
  },
};

const sessionValue = HTTPFields.serialize(sessionState, "dictionary");
console.log("**Session Cookie:**");
console.log("```http");
console.log(
  "Set-Cookie: session=" +
    sessionValue +
    "; Path=/; Secure; HttpOnly; SameSite=Strict"
);
console.log("```\n");

// Example 4: A/B Testing Cookie
console.log("## Example 4: A/B Testing Configuration\n");

const abTests = [
  {
    value: HTTPFields.token("homepage-v2"),
    parameters: {
      variant: HTTPFields.token("treatment"),
      confidence: 0.95,
      started: 1640995200,
    },
  },
  {
    value: HTTPFields.token("checkout-flow"),
    parameters: {
      variant: HTTPFields.token("control"),
      confidence: 0.87,
    },
  },
  {
    value: HTTPFields.token("pricing-display"),
    parameters: {
      variant: HTTPFields.token("variant-b"),
      confidence: 0.92,
      segment: HTTPFields.token("premium-users"),
    },
  },
];

const abTestValue = HTTPFields.serialize(abTests, "list");
console.log("**A/B Testing Cookie:**");
console.log("```http");
console.log("Set-Cookie: ab_tests=" + abTestValue + "; Path=/; Max-Age=604800");
console.log("```\n");

// Example 5: Analytics Tracking Cookie
console.log("## Example 5: Privacy-Compliant Analytics\n");

const analytics = {
  "session-id": {
    value: HTTPFields.binary(btoa("sess_" + Date.now())),
    parameters: {},
  },
  consent: {
    value: HTTPFields.token("essential-only"),
    parameters: {
      version: 2,
      timestamp: 1640995200,
    },
  },
  tracking: { value: false, parameters: {} },
  preferences: {
    value: [
      {
        value: HTTPFields.token("performance"),
        parameters: { enabled: false },
      },
      { value: HTTPFields.token("functional"), parameters: { enabled: true } },
      { value: HTTPFields.token("targeting"), parameters: { enabled: false } },
    ],
    parameters: {},
  },
};

const analyticsValue = HTTPFields.serialize(analytics, "dictionary");
console.log("**Analytics Cookie:**");
console.log("```http");
console.log(
  "Set-Cookie: analytics=" +
    analyticsValue +
    "; Path=/; Max-Age=31536000; SameSite=Lax"
);
console.log("```\n");

// Example 6: Cookie Utility Functions
console.log("## Example 6: Cookie Utility Functions\n");

console.log("**JavaScript Utility Functions:**");
console.log("```javascript");
console.log("class StructuredCookies {");
console.log("    // Set a structured cookie");
console.log("    static set(name, data, type, options = {}) {");
console.log("        try {");
console.log("            const value = HTTPFields.serialize(data, type);");
console.log("            const cookieOptions = Object.entries(options)");
console.log("                .map(([key, val]) => `${key}=${val}`)");
console.log('                .join("; ");');
console.log(
  "            document.cookie = `${name}=${value}; ${cookieOptions}`;"
);
console.log("        } catch (error) {");
console.log(
  '            console.error("Failed to set structured cookie:", error);'
);
console.log("        }");
console.log("    }");
console.log("");
console.log("    // Get and parse a structured cookie");
console.log("    static get(name, type) {");
console.log('        const cookies = document.cookie.split("; ");');
console.log(
  "        const cookie = cookies.find(c => c.startsWith(`${name}=`));"
);
console.log("        if (!cookie) return null;");
console.log("");
console.log("        const value = cookie.substring(name.length + 1);");
console.log("        try {");
console.log("            return HTTPFields.parse(value, type);");
console.log("        } catch (error) {");
console.log(
  '            console.error("Failed to parse structured cookie:", error);'
);
console.log("            return null;");
console.log("        }");
console.log("    }");
console.log("");
console.log("    // Update part of a dictionary cookie");
console.log("    static update(name, key, value, options = {}) {");
console.log('        const current = this.get(name, "dictionary") || {};');
console.log("        current[key] = { value, parameters: {} };");
console.log('        this.set(name, current, "dictionary", options);');
console.log("    }");
console.log("}");
console.log("```\n");

// Example 7: Server-Side Cookie Handling
console.log("## Example 7: Server-Side Cookie Handling\n");

console.log("**Express.js Middleware:**");
console.log("```javascript");
console.log('import HTTPFields from "http-fields";');
console.log("");
console.log("// Middleware to parse structured cookies");
console.log("function parseStructuredCookies(req, res, next) {");
console.log("    req.structuredCookies = {};");
console.log("    ");
console.log("    // Define which cookies use structured fields");
console.log("    const structuredCookieMap = {");
console.log('        "preferences": "dictionary",');
console.log('        "cart": "list",');
console.log('        "session": "dictionary",');
console.log('        "ab_tests": "list"');
console.log("    };");
console.log("    ");
console.log(
  "    Object.entries(structuredCookieMap).forEach(([name, type]) => {"
);
console.log("        if (req.cookies[name]) {");
console.log("            try {");
console.log("                req.structuredCookies[name] = ");
console.log("                    HTTPFields.parse(req.cookies[name], type);");
console.log("            } catch (error) {");
console.log(
  "                console.warn(`Invalid structured cookie ${name}:`, error);"
);
console.log("            }");
console.log("        }");
console.log("    });");
console.log("    ");
console.log("    next();");
console.log("}");
console.log("```\n");

// Example 8: Cookie Migration Strategy
console.log("## Example 8: Migration from Traditional Cookies\n");

console.log("**Migration Approach:**");
console.log(
  "1. **Dual Format Support** - Read both old and new cookie formats"
);
console.log(
  "2. **Gradual Rollout** - Set both formats initially, then phase out old format"
);
console.log(
  "3. **Fallback Parsing** - Try structured parsing first, fall back to legacy parsing\n"
);

console.log("**Migration Code Example:**");
console.log("```javascript");
console.log("function getPreferences(req) {");
console.log("    // Try new structured format first");
console.log("    if (req.cookies.preferences_v2) {");
console.log("        try {");
console.log(
  '            return HTTPFields.parse(req.cookies.preferences_v2, "dictionary");'
);
console.log("        } catch (error) {");
console.log(
  '            console.warn("Failed to parse structured preferences:", error);'
);
console.log("        }");
console.log("    }");
console.log("    ");
console.log("    // Fall back to legacy format");
console.log("    if (req.cookies.preferences) {");
console.log("        return parseLegacyPreferences(req.cookies.preferences);");
console.log("    }");
console.log("    ");
console.log("    return null;");
console.log("}");
console.log("```\n");

console.log("---\n");
console.log("✅ **Cookie examples completed!** 🍪");
