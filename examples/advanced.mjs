import StructuredFields from '../index.mjs';

console.log('# RFC 8941 Structured Fields - Advanced Use Cases\n');

// Example 1: Progressive Web App Feature Negotiation
console.log('## Example 1: Progressive Web App Feature Negotiation\n');

const clientCapabilities = [
    { value: StructuredFields.token('webgl2'), parameters: { 
        confidence: 0.95, 
        fallback: StructuredFields.token('webgl1') 
    }},
    { value: StructuredFields.token('webassembly'), parameters: { confidence: 1.0 } },
    { value: StructuredFields.token('service-workers'), parameters: { confidence: 0.8 } },
    { value: StructuredFields.token('push-notifications'), parameters: { 
        confidence: 0.6, 
        permission: StructuredFields.token('prompt') 
    }}
];

const capabilitiesHeader = StructuredFields.serialize(clientCapabilities, 'list');
console.log('**Client Capabilities Header:**');
console.log('```http');
console.log('x-client-capabilities: ' + capabilitiesHeader);
console.log('```\n');

// Server responds with optimized bundle
const bundleResponse = {
    script: { value: StructuredFields.token('modern'), parameters: { size: 45000 } },
    assets: { value: StructuredFields.token('webp'), parameters: { 
        compression: StructuredFields.token('brotli') 
    }},
    features: { value: [
        { value: StructuredFields.token('webgl-renderer'), parameters: {} },
        { value: StructuredFields.token('wasm-compute'), parameters: {} }
    ], parameters: {} }
};

const bundleHeader = StructuredFields.serialize(bundleResponse, 'dictionary');
console.log('**Server Bundle Response:**');
console.log('```http');
console.log('x-bundle-config: ' + bundleHeader);
console.log('```\n');

// Example 2: AI Model Serving with Dynamic Parameters
console.log('## Example 2: AI Model Serving with Dynamic Parameters\n');

const modelRequest = {
    model: { value: StructuredFields.token('gpt-4'), parameters: { 
        'max-tokens': 1000,
        temperature: 0.7,
        'top-p': 0.9,
        fallback: StructuredFields.token('gpt-3.5-turbo')
    }},
    format: { value: StructuredFields.token('streaming'), parameters: { 
        'chunk-size': 512,
        'buffer-timeout': 100
    }},
    safety: { value: StructuredFields.token('strict'), parameters: {
        'content-filter': true,
        'bias-check': true
    }}
};

const aiRequestHeader = StructuredFields.serialize(modelRequest, 'dictionary');
console.log('**AI Model Request:**');
console.log('```http');
console.log('x-ai-inference: ' + aiRequestHeader);
console.log('```\n');

// Server responds with model selection and billing info
const aiResponse = {
    value: StructuredFields.token('gpt-4-turbo'),
    parameters: {
        'compute-units': 45,
        'response-time': 1.2,
        'model-version': '2024-03-15',
        'safety-score': 0.98
    }
};

const aiResponseHeader = StructuredFields.serialize(aiResponse, 'item');
console.log('**AI Model Response:**');
console.log('```http');
console.log('x-ai-response: ' + aiResponseHeader);
console.log('```\n');

// Example 3: IoT Device Mesh Networking
console.log('## Example 3: IoT Device Mesh Networking\n');

const deviceAnnouncement = {
    'device-type': { value: StructuredFields.token('smart-thermostat'), parameters: {} },
    'battery-level': { value: 0.73, parameters: { 'low-power-mode': false } },
    'mesh-role': { value: StructuredFields.token('router'), parameters: { 
        'max-connections': 8,
        'signal-strength': -45,
        bandwidth: 2400000
    }},
    sensors: { value: [
        { value: StructuredFields.token('temperature'), parameters: { 
            accuracy: 0.1, 
            'update-freq': 30 
        }},
        { value: StructuredFields.token('humidity'), parameters: { 
            accuracy: 2.0, 
            'update-freq': 60 
        }},
        { value: StructuredFields.token('motion'), parameters: { 
            'detection-range': 5.0 
        }}
    ], parameters: {} },
    protocols: { value: [
        { value: StructuredFields.token('zigbee'), parameters: { version: '3.0' } },
        { value: StructuredFields.token('matter'), parameters: { commissioning: true } }
    ], parameters: {} }
};

const deviceHeader = StructuredFields.serialize(deviceAnnouncement, 'dictionary');
console.log('**IoT Device Announcement:**');
console.log('```http');
console.log('x-device-capabilities: ' + deviceHeader);
console.log('```\n');

// Example 4: CDN Optimization
console.log('## Example 4: CDN Content Delivery Optimization\n');

const clientProfile = {
    connection: { value: StructuredFields.token('4g'), parameters: { 
        bandwidth: 15000000,
        latency: 45,
        'data-cost': StructuredFields.token('metered')
    }},
    device: { value: StructuredFields.token('mobile'), parameters: { 
        'screen-width': 390,
        'screen-height': 844,
        'pixel-ratio': 3.0,
        memory: 4096
    }},
    preferences: { value: StructuredFields.token('adaptive'), parameters: { 
        'quality-over-speed': false,
        'preload-next': true,
        'offline-capable': true
    }}
};

const clientProfileHeader = StructuredFields.serialize(clientProfile, 'dictionary');
console.log('**Client Profile:**');
console.log('```http');
console.log('x-client-profile: ' + clientProfileHeader);
console.log('```\n');

// CDN responds with optimized delivery strategy
const deliveryStrategy = {
    'image-format': { value: StructuredFields.token('webp'), parameters: { 
        quality: 0.8,
        progressive: true
    }},
    'video-codec': { value: StructuredFields.token('av1'), parameters: { 
        'max-bitrate': 2000000,
        'adaptive-streaming': true
    }},
    'edge-node': { value: StructuredFields.token('us-west-2a'), parameters: { 
        distance: 15.2,
        'cache-hit-ratio': 0.94
    }}
};

const deliveryHeader = StructuredFields.serialize(deliveryStrategy, 'dictionary');
console.log('**CDN Delivery Strategy:**');
console.log('```http');
console.log('x-delivery-strategy: ' + deliveryHeader);
console.log('```\n');

// Example 5: Blockchain/Web3 Transaction Metadata
console.log('## Example 5: Blockchain/Web3 Transaction Intent\n');

const transactionIntent = {
    'gas-strategy': { value: StructuredFields.token('dynamic'), parameters: { 
        'max-fee': 50000000000,
        'priority-fee': 2000000000,
        speed: StructuredFields.token('fast')
    }},
    slippage: { value: 0.005, parameters: { 'auto-adjust': true } },
    'mev-protection': { value: true, parameters: { 
        'flashloan-guard': true,
        'sandwich-protection': StructuredFields.token('strict')
    }},
    wallet: { value: StructuredFields.token('metamask'), parameters: { 
        version: '10.22.0',
        'hardware-wallet': false
    }}
};

const transactionHeader = StructuredFields.serialize(transactionIntent, 'dictionary');
console.log('**Transaction Intent:**');
console.log('```http');
console.log('x-transaction-intent: ' + transactionHeader);
console.log('```\n');

// DeFi protocol responds with execution plan
const executionPlan = [
    { value: StructuredFields.token('swap-usdc-eth'), parameters: { 
        'expected-output': 1.234567,
        'price-impact': 0.002,
        route: StructuredFields.token('uniswap-v3')
    }},
    { value: StructuredFields.token('stake-eth'), parameters: { 
        validator: StructuredFields.token('lido'),
        apy: 0.045,
        'lock-period': 0
    }}
];

const executionHeader = StructuredFields.serialize(executionPlan, 'list');
console.log('**DeFi Execution Plan:**');
console.log('```http');
console.log('x-execution-plan: ' + executionHeader);
console.log('```\n');

// Example 6: ML Pipeline Orchestration
console.log('## Example 6: ML Pipeline Orchestration\n');

const pipelineConfig = {
    'data-source': { value: StructuredFields.token('s3-bucket'), parameters: { 
        'partition-strategy': StructuredFields.token('temporal'),
        compression: StructuredFields.token('parquet'),
        'estimated-size': 15000000000
    }},
    preprocessing: { value: [
        { value: StructuredFields.token('normalize'), parameters: { 
            method: StructuredFields.token('z-score') 
        }},
        { value: StructuredFields.token('feature-selection'), parameters: { 
            'top-k': 100 
        }}
    ], parameters: { 'parallel-workers': 8 } },
    model: { value: StructuredFields.token('transformer'), parameters: { 
        layers: 12,
        'attention-heads': 8,
        'context-length': 2048,
        checkpoint: StructuredFields.token('latest')
    }},
    resources: { value: StructuredFields.token('gpu-cluster'), parameters: { 
        'min-gpus': 4,
        'max-cost-per-hour': 12.50,
        'spot-instances': true
    }}
};

const pipelineHeader = StructuredFields.serialize(pipelineConfig, 'dictionary');
console.log('**ML Pipeline Configuration:**');
console.log('```http');
console.log('x-ml-pipeline: ' + pipelineHeader);
console.log('```\n');

// Example 7: Augmented Reality Spatial Computing
console.log('## Example 7: AR Spatial Computing Session\n');

const arSession = {
    tracking: { value: StructuredFields.token('world-scale'), parameters: { 
        relocalization: true,
        occlusion: StructuredFields.token('mesh-based'),
        lighting: StructuredFields.token('environmental')
    }},
    anchors: { value: [
        { value: StructuredFields.binary(btoa('anchor-uuid-1')), parameters: { 
            x: 1.5, 
            y: 0.0, 
            z: -2.3,
            confidence: 0.97,
            persistence: StructuredFields.token('cloud')
        }},
        { value: StructuredFields.binary(btoa('anchor-uuid-2')), parameters: { 
            x: -0.8, 
            y: 1.2, 
            z: 0.5,
            confidence: 0.89,
            persistence: StructuredFields.token('local')
        }}
    ], parameters: {} },
    rendering: { value: StructuredFields.token('pbr'), parameters: { 
        'shadow-quality': StructuredFields.token('medium'),
        'reflection-probes': 4,
        'target-fps': 60
    }}
};

const arHeader = StructuredFields.serialize(arSession, 'dictionary');
console.log('**AR Session Requirements:**');
console.log('```http');
console.log('x-ar-session: ' + arHeader);
console.log('```\n');

// Example 8: Microservices Health Monitoring
console.log('## Example 8: Microservices Health Monitoring\n');

const serviceHealth = {
    'service-id': { value: StructuredFields.token('user-auth-service'), parameters: {} },
    'health-score': { value: 0.94, parameters: { 
        trend: StructuredFields.token('improving'),
        'sla-compliance': 0.999
    }},
    dependencies: { value: [
        { value: StructuredFields.token('postgres-primary'), parameters: { 
            latency: 2.3,
            'connection-pool': 0.67,
            'error-rate': 0.001
        }},
        { value: StructuredFields.token('redis-cluster'), parameters: { 
            latency: 0.8,
            'hit-ratio': 0.94,
            'memory-usage': 0.78
        }}
    ], parameters: {} },
    'circuit-breakers': { value: StructuredFields.token('healthy'), parameters: { 
        'payment-service': StructuredFields.token('half-open'),
        'notification-service': StructuredFields.token('closed')
    }}
};

const healthHeader = StructuredFields.serialize(serviceHealth, 'dictionary');
console.log('**Service Health Status:**');
console.log('```http');
console.log('x-service-health: ' + healthHeader);
console.log('```\n');

// Example 9: Content Recommendation Engine
console.log('## Example 9: Personalized Content Recommendations\n');

const userContext = {
    'session-intent': { value: StructuredFields.token('browse'), parameters: { 
        'time-budget': 25,
        'exploration-factor': 0.3
    }},
    'privacy-preferences': { value: StructuredFields.token('selective'), parameters: { 
        'behavioral-tracking': false,
        'interest-categories': true,
        'demographic-inference': StructuredFields.token('age-range-only')
    }},
    'content-signals': { value: [
        { value: StructuredFields.token('tech'), parameters: { weight: 0.8, recency: 0.9 } },
        { value: StructuredFields.token('productivity'), parameters: { weight: 0.6, recency: 0.7 } },
        { value: StructuredFields.token('design'), parameters: { weight: 0.4, recency: 0.3 } }
    ], parameters: { confidence: 0.85 } },
    'engagement-patterns': { value: StructuredFields.token('deep-reader'), parameters: { 
        'avg-time-on-page': 180,
        'scroll-depth': 0.87,
        'social-sharing': 0.15
    }}
};

const recommendationHeader = StructuredFields.serialize(userContext, 'dictionary');
console.log('**User Context for Recommendations:**');
console.log('```http');
console.log('x-user-context: ' + recommendationHeader);
console.log('```\n');

// Example 10: Complex Header Analysis
console.log('## Example 10: Complex Header Analysis\n');

// Parse a complex header and extract useful information
const complexHeaderString = 'model=gpt-4;temp=0.7;tokens=1000, format=stream;chunks=512, safety=(content-filter bias-check);level=strict';
console.log('**Input Header:**');
console.log('```http');
console.log('x-ai-config: ' + complexHeaderString);
console.log('```\n');

const parsed = StructuredFields.parse(complexHeaderString, 'dictionary');

console.log('**Parsed Analysis:**');
console.log('```json');
console.log(JSON.stringify(parsed, null, 2));
console.log('```\n');

console.log('**Extracted Information:**');
console.log('- **Model:** `' + parsed.model?.value?.value + '`');
console.log('- **Temperature:** `' + parsed.model?.parameters?.temp + '`');
console.log('- **Max tokens:** `' + parsed.model?.parameters?.tokens + '`');
console.log('- **Format:** `' + parsed.format?.value?.value + '`');
console.log('- **Chunk size:** `' + parsed.format?.parameters?.chunks + '`');
console.log('- **Safety level:** `' + parsed.safety?.parameters?.level?.value + '`');

// Extract safety features
if (parsed.safety?.value && Array.isArray(parsed.safety.value)) {
    const safetyFeatures = parsed.safety.value.map(item => item.value?.value || item.value);
    console.log('- **Safety features:** `' + safetyFeatures.join(', ') + '`');
}
console.log();

console.log('---\n');
console.log('✅ **Advanced Use Cases completed!** 🚀');
