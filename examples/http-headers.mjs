import StructuredFields from '../index.mjs';

console.log('# RFC 8941 Structured Fields - HTTP Headers Examples\n');

// Utility class for working with structured headers
class StructuredHeaders {
    constructor(headers = new Headers()) {
        this.headers = headers instanceof Headers ? headers : new Headers(headers);
    }
    
    // Get and parse a structured header
    getStructured(name, type) {
        const value = this.headers.get(name);
        if (!value) return null;
        
        try {
            return StructuredFields.parse(value, type);
        } catch (error) {
            console.warn(`Invalid structured header ${name}:`, error.message);
            return null;
        }
    }
    
    // Set a structured header
    setStructured(name, data, type) {
        try {
            const value = StructuredFields.serialize(data, type);
            this.headers.set(name, value);
        } catch (error) {
            console.error(`Failed to serialize header ${name}:`, error.message);
        }
    }
    
    // Get the underlying Headers object
    toHeaders() {
        return this.headers;
    }
    
    // Print all headers in markdown format
    printMarkdown() {
        console.log('```http');
        for (const [name, value] of this.headers.entries()) {
            console.log(`${name}: ${value}`);
        }
        console.log('```\n');
    }
}

// Example 1: Creating Request Headers
console.log('## Example 1: Creating Request Headers\n');
const requestHeaders = new StructuredHeaders();

// Set Accept header (list with quality values)
requestHeaders.setStructured('accept', [
    { value: StructuredFields.token('application/json'), parameters: { q: 0.9 } },
    { value: StructuredFields.token('application/xml'), parameters: { q: 0.8 } },
    { value: StructuredFields.token('*/*'), parameters: { q: 0.1 } }
], 'list');

// Set API preferences (dictionary)
requestHeaders.setStructured('x-api-preferences', {
    version: { value: 2, parameters: {} },
    format: { value: StructuredFields.token('compact'), parameters: {} },
    'include-metadata': { value: true, parameters: {} }
}, 'dictionary');

// Set client info (item with parameters)
requestHeaders.setStructured('x-client-info', {
    value: StructuredFields.token('MyApp'),
    parameters: {
        version: '1.2.3',
        platform: StructuredFields.token('web')
    }
}, 'item');

console.log('**Generated Request Headers:**');
requestHeaders.printMarkdown();

// Example 2: Parsing Response Headers
console.log('## Example 2: Parsing Response Headers\n');
const responseHeaders = new StructuredHeaders();

// Simulate response headers
responseHeaders.headers.set('cache-control', 'max-age=3600, private, must-revalidate');
responseHeaders.headers.set('x-rate-limit', '1000;window=3600;remaining=942');
responseHeaders.headers.set('x-feature-flags', 'experimental-ui=?1, dark-mode=?0, beta-features');

console.log('**Raw Response Headers:**');
responseHeaders.printMarkdown();

// Parse structured headers
const cacheControl = responseHeaders.getStructured('cache-control', 'dictionary');
const rateLimit = responseHeaders.getStructured('x-rate-limit', 'item');
const featureFlags = responseHeaders.getStructured('x-feature-flags', 'dictionary');

console.log('**Parsed Cache-Control:**');
console.log('- Max age: `' + cacheControl?.['max-age']?.value + '`');
console.log('- Is private: `' + (cacheControl?.private?.value === true) + '`');
console.log('- Must revalidate: `' + (cacheControl?.['must-revalidate']?.value === true) + '`\n');

console.log('**Parsed Rate Limit:**');
console.log('- Limit: `' + rateLimit?.value + '`');
console.log('- Window: `' + rateLimit?.parameters?.window + '` seconds');
console.log('- Remaining: `' + rateLimit?.parameters?.remaining + '`\n');

console.log('**Parsed Feature Flags:**');
console.log('- Experimental UI: `' + featureFlags?.['experimental-ui']?.value + '`');
console.log('- Dark mode: `' + featureFlags?.['dark-mode']?.value + '`');
console.log('- Beta features: `' + (featureFlags?.['beta-features']?.value === true) + '`\n');

// Example 3: Content Negotiation
console.log('## Example 3: Content Negotiation\n');

// Client sends capabilities
const clientCapabilities = [
    { value: StructuredFields.token('webp'), parameters: { quality: 0.9 } },
    { value: StructuredFields.token('avif'), parameters: { quality: 0.95, fallback: StructuredFields.token('webp') } },
    { value: StructuredFields.token('gzip'), parameters: {} },
    { value: StructuredFields.token('brotli'), parameters: { preference: 1.0 } }
];

const capabilitiesHeader = StructuredFields.serialize(clientCapabilities, 'list');
console.log('**Client Capabilities:**');
console.log('```http');
console.log('x-client-capabilities: ' + capabilitiesHeader);
console.log('```\n');

// Server responds with selected options
const serverResponse = {
    'image-format': { value: StructuredFields.token('avif'), parameters: { quality: 0.85 } },
    'compression': { value: StructuredFields.token('brotli'), parameters: { level: 6 } },
    'optimization': { value: true, parameters: {} }
};

const responseOptions = StructuredFields.serialize(serverResponse, 'dictionary');
console.log('**Server Response:**');
console.log('```http');
console.log('x-content-optimization: ' + responseOptions);
console.log('```\n');

// Example 4: API Versioning and Metadata
console.log('## Example 4: API Versioning and Metadata\n');

// API version with deprecation info
const apiVersionData = {
    value: StructuredFields.token('v2.1'),
    parameters: {
        deprecated: false,
        'sunset-date': '2025-12-31',
        'migration-guide': 'https://api.example.com/migrate'
    }
};

const apiVersionHeader = StructuredFields.serialize(apiVersionData, 'item');
console.log('**API Version Header:**');
console.log('```http');
console.log('x-api-version: ' + apiVersionHeader);
console.log('```\n');

// Service metadata
const serviceMetadata = {
    'service-id': { value: StructuredFields.token('user-service'), parameters: {} },
    'instance': { value: StructuredFields.token('us-west-2a'), parameters: { 
        'load-factor': 0.67,
        'health-score': 0.98
    }},
    'features': { value: [
        { value: StructuredFields.token('rate-limiting'), parameters: {} },
        { value: StructuredFields.token('caching'), parameters: { ttl: 300 } },
        { value: StructuredFields.token('monitoring'), parameters: {} }
    ], parameters: {} }
};

const metadataHeader = StructuredFields.serialize(serviceMetadata, 'dictionary');
console.log('**Service Metadata Header:**');
console.log('```http');
console.log('x-service-metadata: ' + metadataHeader);
console.log('```\n');

// Example 5: Security and Auth Context
console.log('## Example 5: Security and Auth Context\n');

// Security context
const securityContext = {
    'auth-method': { value: StructuredFields.token('oauth2'), parameters: { 
        scope: 'read write',
        'token-type': StructuredFields.token('bearer')
    }},
    'csrf-protection': { value: true, parameters: {} },
    'rate-limiting': { value: StructuredFields.token('user-based'), parameters: { 
        'requests-per-hour': 1000,
        'burst-limit': 50
    }},
    'permissions': { value: [
        { value: StructuredFields.token('users:read'), parameters: {} },
        { value: StructuredFields.token('posts:write'), parameters: { scope: StructuredFields.token('own') } }
    ], parameters: {} }
};

const securityHeader = StructuredFields.serialize(securityContext, 'dictionary');
console.log('**Security Context Header:**');
console.log('```http');
console.log('x-security-context: ' + securityHeader);
console.log('```\n');

// Example 6: Performance Hints
console.log('## Example 6: Performance Hints\n');

// Client performance profile
const performanceHints = [
    { value: StructuredFields.token('connection'), parameters: { 
        type: StructuredFields.token('4g'),
        bandwidth: 15000000,
        latency: 45
    }},
    { value: StructuredFields.token('device'), parameters: { 
        type: StructuredFields.token('mobile'),
        'cpu-cores': 4,
        memory: 4096
    }},
    { value: StructuredFields.token('preferences'), parameters: { 
        'data-saver': true,
        'quality-over-speed': false
    }}
];

const performanceHeader = StructuredFields.serialize(performanceHints, 'list');
console.log('**Client Performance Hints:**');
console.log('```http');
console.log('x-performance-hints: ' + performanceHeader);
console.log('```\n');

// Server optimization response
const optimizationResponse = {
    'image-quality': { value: 0.7, parameters: {} },
    'compression': { value: StructuredFields.token('aggressive'), parameters: {} },
    'preload': { value: false, parameters: { reason: StructuredFields.token('data-saver') } },
    'cdn-node': { value: StructuredFields.token('edge-closest'), parameters: { distance: 12.5 } }
};

const optimizationHeader = StructuredFields.serialize(optimizationResponse, 'dictionary');
console.log('**Server Optimization Response:**');
console.log('```http');
console.log('x-optimization: ' + optimizationHeader);
console.log('```\n');

// Example 7: Real Fetch Integration
console.log('## Example 7: Real Fetch Integration\n');

// Function to create API request with structured headers
function createApiRequest(url, options = {}) {
    const headers = new StructuredHeaders(options.headers);
    
    // Set structured headers
    headers.setStructured('accept', [
        { value: StructuredFields.token('application/json'), parameters: { version: 2 } },
        { value: StructuredFields.token('application/hal+json'), parameters: { q: 0.8 } }
    ], 'list');
    
    headers.setStructured('x-client-metadata', {
        value: StructuredFields.token('web-app'),
        parameters: {
            version: '1.0.0',
            'user-agent': 'StructuredFieldsDemo/1.0'
        }
    }, 'item');
    
    return {
        ...options,
        headers: headers.toHeaders()
    };
}

console.log('**JavaScript Code:**');
console.log('```javascript');
console.log('const requestConfig = createApiRequest(\'/api/users\', {');
console.log('    method: \'GET\',');
console.log('    headers: {');
console.log('        \'authorization\': \'Bearer token123\'');
console.log('    }');
console.log('});');
console.log('```\n');

// Simulate the request configuration
const requestConfig = createApiRequest('/api/users', {
    method: 'GET',
    headers: {
        'authorization': 'Bearer token123'
    }
});

console.log('**Generated Request Headers:**');
console.log('```http');
for (const [name, value] of requestConfig.headers.entries()) {
    console.log(`${name}: ${value}`);
}
console.log('```\n');

console.log('---\n');
console.log('✅ **HTTP Headers Examples completed!** 🎉');
