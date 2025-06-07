// Simple base32 implementation for testing
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base64ToBase32(base64) {
    if (!base64) return '';
    
    try {
        // Decode base64 to bytes
        const decoded = atob(base64);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
            bytes[i] = decoded.charCodeAt(i);
        }
        
        // Convert bytes to base32
        return bytesToBase32(bytes);
    } catch (e) {
        return base64; // Return original if conversion fails
    }
}

function bytesToBase32(bytes) {
    if (bytes.length === 0) return '';
    
    let result = '';
    let buffer = 0;
    let bufferLength = 0;
    
    for (const byte of bytes) {
        buffer = (buffer << 8) | byte;
        bufferLength += 8;
        
        while (bufferLength >= 5) {
            const index = (buffer >> (bufferLength - 5)) & 0x1F;
            result += BASE32_ALPHABET[index];
            bufferLength -= 5;
        }
    }
    
    if (bufferLength > 0) {
        const index = (buffer << (5 - bufferLength)) & 0x1F;
        result += BASE32_ALPHABET[index];
    }
    
    // Add padding if needed (base32 uses '=' for padding)
    const paddingLength = (8 - (result.length % 8)) % 8;
    result += '='.repeat(paddingLength);
    
    return result;
}

// Test it
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('hello (aGVsbG8=) as base32:', base64ToBase32('aGVsbG8='));
    console.log('empty string as base32:', base64ToBase32(''));
}