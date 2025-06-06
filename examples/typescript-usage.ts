// TypeScript Usage Example for structured-headers
// Note: This file demonstrates type usage but isn't runnable directly
// To use in a real project, compile with TypeScript

import StructuredFields from '../index.mjs';
import type {
    Item,
    List,
    Dictionary,
    BareItemValue,
    TokenValue,
    BinaryValue,
    DateValue,
    DisplayStringValue,
    Parameters,
    InnerList,
} from '../types';
import {
  isTokenValue,
  isBinaryValue,
  isDateValue,
  isDisplayStringValue,
} from "../types";


// Type guards demonstration
function processValue(item: BareItemValue): void {
    if (isTokenValue(item)) {
        console.log(`Token value: ${item.value}`);
    } else if (isBinaryValue(item)) {
        console.log(`Binary base64: ${item.value}`);
    } else if (isDateValue(item)) {
        console.log(`Date: ${item.value.toISOString()}`);
    } else if (isDisplayStringValue(item)) {
        console.log(`Display string: ${item.value}`);
    } else if (typeof item === 'number') {
        console.log(`Number: ${item}`);
    } else if (typeof item === 'string') {
        console.log(`String: ${item}`);
    } else if (typeof item === 'boolean') {
        console.log(`Boolean: ${item}`);
    }
}

// Strongly typed parsing
const cacheControl: Dictionary = StructuredFields.parse(
    'max-age=3600, private, must-revalidate',
    'dictionary'
);

// TypeScript knows the structure
const maxAge: Item = cacheControl['max-age'];
const maxAgeValue: BareItemValue | InnerList = maxAge.value;
const maxAgeParams: Parameters = maxAge.parameters;

// Creating typed structures
const typedToken: TokenValue = StructuredFields.token('application/json');
const typedBinary: BinaryValue = StructuredFields.binary('SGVsbG8=');
const typedDate: DateValue = StructuredFields.date(new Date());
const typedDisplayString: DisplayStringValue = StructuredFields.displayString('Hello 世界');

// Building a typed list
const typedList: List = [
    {
        value: typedToken,
        parameters: {
            charset: StructuredFields.token('utf-8'),
            priority: 1
        }
    },
    {
        value: typedDate,
        parameters: {}
    }
];

// Building a typed dictionary
const typedDict: Dictionary = {
    'content-type': {
        value: StructuredFields.token('text/html'),
        parameters: {
            charset: StructuredFields.token('utf-8')
        }
    },
    'expires': {
        value: StructuredFields.date(new Date('2025-01-01')),
        parameters: {}
    },
    'title': {
        value: StructuredFields.displayString('My Page タイトル'),
        parameters: {
            lang: StructuredFields.token('ja')
        }
    }
};

// Serialization with type safety
const serializedList: string = StructuredFields.serialize(typedList, 'list');
const serializedDict: string = StructuredFields.serialize(typedDict, 'dictionary');

// Parsing with explicit types
const parsedItem: Item = StructuredFields.parse('@1672531200;priority=high', 'item');
const parsedList: List = StructuredFields.parse('a, b, c', 'list');
const parsedDict: Dictionary = StructuredFields.parse('x=1, y=2', 'dictionary');

// Using in HTTP header context
interface HttpHeaders {
    [key: string]: string;
}

const headers: HttpHeaders = {
    'Cache-Control': StructuredFields.serialize({
        'max-age': { value: 3600, parameters: {} },
        'private': { value: true, parameters: {} }
    }, 'dictionary'),
    'Accept': StructuredFields.serialize([
        { value: StructuredFields.token('text/html'), parameters: { q: 0.9 } },
        { value: StructuredFields.token('application/json'), parameters: { q: 0.8 } }
    ], 'list'),
    'Expires': StructuredFields.serialize({
        value: StructuredFields.date(new Date('2025-01-01')),
        parameters: {}
    }, 'item')
};

// Parsing incoming headers with proper types
function parseStructuredHeader(
    value: string,
    type: 'item'
): Item;
function parseStructuredHeader(
    value: string,
    type: 'list'
): List;
function parseStructuredHeader(
    value: string,
    type: 'dictionary'
): Dictionary;
function parseStructuredHeader(
    value: string,
    type: 'item' | 'list' | 'dictionary'
): Item | List | Dictionary {
    return StructuredFields.parse(value, type);
}

// Example usage with proper typing
const acceptHeader = parseStructuredHeader(headers['Accept'], 'list');
acceptHeader.forEach(item => {
    if (isTokenValue(item.value)) {
        console.log(`Media type: ${item.value.value}, Quality: ${item.parameters.q || 1}`);
    }
});

// Handling RFC 9651 features with types
const event: Dictionary = {
    name: {
        value: StructuredFields.displayString('Tokyo Conference 東京会議'),
        parameters: {}
    },
    date: {
        value: StructuredFields.date(new Date('2024-06-15T09:00:00Z')),
        parameters: { timezone: StructuredFields.token('JST') }
    },
    venue: {
        value: StructuredFields.token('tokyo-big-sight'),
        parameters: { 
            capacity: 5000,
            accessible: true
        }
    }
};

console.log('Event details:', StructuredFields.serialize(event, 'dictionary'));