/**
 * RFC 9651 Structured Field Values for HTTP - Enhanced JavaScript Implementation
 * Translates between structured header strings and JSON
 * Now supports RFC 9651 features: Dates and Display Strings
 */

const HTTPFields = (() => {
  "use strict";

  // Utility functions
  const isAsciiPrintable = (char) => {
    const code = char.charCodeAt(0);
    return code >= 0x20 && code <= 0x7e;
  };

  const isLcAlpha = (char) => {
    const code = char.charCodeAt(0);
    return code >= 0x61 && code <= 0x7a; // a-z
  };

  const isAlpha = (char) => {
    const code = char.charCodeAt(0);
    return (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a); // A-Z or a-z
  };

  const isDigit = (char) => {
    const code = char.charCodeAt(0);
    return code >= 0x30 && code <= 0x39; // 0-9
  };

  const isLcHexDigit = (char) => {
    const code = char.charCodeAt(0);
    return (code >= 0x30 && code <= 0x39) || (code >= 0x61 && code <= 0x66); // 0-9, a-f
  };

  const isTchar = (char) => {
    return "!#$%&'*+-.^_`|~".includes(char) || isAlpha(char) || isDigit(char);
  };

  const skipOWS = (input) => {
    while (input.length > 0 && (input[0] === " " || input[0] === "\t")) {
      input.splice(0, 1);
    }
  };

  const skipSP = (input) => {
    while (input.length > 0 && input[0] === " ") {
      input.splice(0, 1);
    }
  };

  // Parser functions
  const parseList = (inputString) => {
    const input = Array.from(inputString);
    const members = [];

    skipOWS(input);

    while (input.length > 0) {
      const [member, params] = parseListMember(input);
      members.push({ value: member, parameters: params });

      skipOWS(input);
      if (input.length > 0 && input[0] === ",") {
        input.shift(); // consume comma
        skipOWS(input);
        if (input.length === 0) {
          throw new Error("Unexpected end of input after comma");
        }
      } else {
        break;
      }
    }

    if (input.length > 0) {
      throw new Error("Unexpected characters at end of list");
    }

    return members;
  };

  const parseListMember = (input) => {
    if (input[0] === "(") {
      return parseInnerList(input);
    } else {
      return parseItem(input);
    }
  };

  const parseInnerList = (input) => {
    if (input[0] !== "(") {
      throw new Error('Expected "(" at start of inner list');
    }
    input.shift(); // consume '('

    const innerList = [];
    skipSP(input);

    while (input.length > 0 && input[0] !== ")") {
      const [item, params] = parseItem(input);
      innerList.push({ value: item, parameters: params });

      if (input.length === 0) {
        throw new Error("Unexpected end of input in inner list");
      }

      if (input[0] === ")") {
        break;
      }

      if (input[0] !== " ") {
        throw new Error("Expected space between inner list items");
      }

      // Skip one or more spaces
      while (input.length > 0 && input[0] === " ") {
        input.shift();
      }
    }

    if (input.length === 0 || input[0] !== ")") {
      throw new Error('Expected ")" at end of inner list');
    }
    input.shift(); // consume ')'

    const params = parseParameters(input);
    return [innerList, params];
  };

  const parseDictionary = (inputString) => {
    const input = Array.from(inputString);
    const dict = {};

    // Only skip spaces at the beginning, not tabs (keys cannot start with tabs)
    skipSP(input);

    while (input.length > 0) {
      const key = parseKey(input);

      let value, params;
      if (input.length > 0 && input[0] === "=") {
        input.shift(); // consume '='
        const [memberValue, memberParams] = parseListMember(input);
        value = memberValue;
        params = memberParams;
      } else {
        // Boolean true with parameters
        value = true;
        params = parseParameters(input);
      }

      dict[key] = { value, parameters: params };

      skipOWS(input);
      if (input.length > 0 && input[0] === ",") {
        input.shift(); // consume comma
        skipOWS(input);
        if (input.length === 0) {
          throw new Error("Unexpected end of input after comma");
        }
        // After comma whitespace, don't allow tabs before next key
        if (input.length > 0 && input[0] === "\t") {
          throw new Error("Tab character not allowed before dictionary key");
        }
      } else {
        break;
      }
    }

    if (input.length > 0) {
      throw new Error("Unexpected characters at end of dictionary");
    }

    return dict;
  };

  const parseItem = (input) => {
    const bareItem = parseBareItem(input);
    const params = parseParameters(input);
    return [bareItem, params];
  };

  const parseBareItem = (input) => {
    if (input.length === 0) {
      throw new Error("Unexpected end of input");
    }

    const firstChar = input[0];

    if (firstChar === '"') {
      return parseString(input);
    } else if (firstChar === ":") {
      return parseBinary(input);
    } else if (firstChar === "?") {
      return parseBoolean(input);
    } else if (firstChar === "@") {
      return parseDate(input);
    } else if (firstChar === "%") {
      return parseDisplayString(input);
    } else if (isDigit(firstChar) || firstChar === "-") {
      return parseNumber(input);
    } else if (isAlpha(firstChar) || firstChar === "*") {
      return parseToken(input);
    } else {
      throw new Error(`Unexpected character: ${firstChar}`);
    }
  };

  const parseParameters = (input) => {
    const params = {};

    while (input.length > 0 && input[0] === ";") {
      input.shift(); // consume ';'
      skipSP(input);

      const key = parseKey(input);
      let value = true; // default value for parameters

      if (input.length > 0 && input[0] === "=") {
        input.shift(); // consume '='
        value = parseBareItem(input);
      }

      params[key] = value;
    }

    return params;
  };

  const parseKey = (input) => {
    if (input.length === 0) {
      throw new Error("Unexpected end of input");
    }

    if (!isLcAlpha(input[0]) && input[0] !== "*") {
      throw new Error('Key must start with lowercase letter or "*"');
    }

    let key = "";
    while (input.length > 0) {
      const char = input[0];
      if (
        isLcAlpha(char) ||
        isDigit(char) ||
        char === "_" ||
        char === "-" ||
        char === "." ||
        char === "*"
      ) {
        key += char;
        input.shift();
      } else {
        break;
      }
    }

    if (key.length === 0) {
      throw new Error("Empty key");
    }

    return key;
  };

  const parseNumber = (input) => {
    let sign = 1;
    let num = "";
    let type = "integer";

    if (input[0] === "-") {
      sign = -1;
      input.shift();
    }

    if (input.length === 0 || !isDigit(input[0])) {
      throw new Error("Expected digit after minus sign");
    }

    // Parse integer part
    while (input.length > 0 && isDigit(input[0])) {
      num += input.shift();
    }

    if (num.length === 0) {
      throw new Error("Expected digits");
    }

    if (num.length > 15) {
      throw new Error("Integer too large");
    }

    // RFC 8941: Check for invalid leading zero patterns in decimals
    // This will be checked later if we find a decimal point

    // Check for decimal point
    if (input.length > 0 && input[0] === ".") {
      type = "decimal";
      input.shift(); // consume '.'

      // RFC 8941: Reject decimal numbers with excessive leading zeros
      // "000000000000000.0" should fail (15 zeros + decimal)
      if (num.length >= 15 && num === "0".repeat(15)) {
        throw new Error("Too many leading zeros in decimal number");
      }

      if (input.length === 0 || !isDigit(input[0])) {
        throw new Error("Expected digit after decimal point");
      }

      let fractionalPart = "";
      while (input.length > 0 && isDigit(input[0])) {
        fractionalPart += input.shift();
      }

      if (fractionalPart.length > 3) {
        throw new Error("Too many fractional digits");
      }

      num += "." + fractionalPart;
    }

    if (type === "integer") {
      const value = sign * parseInt(num, 10);
      if (value < -999999999999999 || value > 999999999999999) {
        throw new Error("Integer out of range");
      }
      // Normalize -0 to 0 as per RFC 8941
      return value === 0 ? 0 : value;
    } else {
      const value = sign * parseFloat(num);
      if (Math.abs(value) >= 1000000000000) {
        throw new Error("Decimal out of range");
      }
      // Normalize -0 to 0 as per RFC 8941
      return value === 0 ? 0 : value;
    }
  };

  const parseString = (input) => {
    if (input[0] !== '"') {
      throw new Error("Expected quote at start of string");
    }
    input.shift(); // consume opening quote

    let str = "";
    while (input.length > 0) {
      const char = input.shift();

      if (char === '"') {
        return str;
      } else if (char === "\\") {
        if (input.length === 0) {
          throw new Error("Unexpected end of input in string escape");
        }
        const escapedChar = input.shift();
        if (escapedChar === '"' || escapedChar === "\\") {
          str += escapedChar;
        } else {
          throw new Error(`Invalid escape sequence: \\${escapedChar}`);
        }
      } else if (isAsciiPrintable(char) && char !== '"' && char !== "\\") {
        str += char;
      } else {
        throw new Error(`Invalid character in string: ${char}`);
      }
    }

    throw new Error("Unterminated string");
  };

  const parseToken = (input) => {
    if (input.length === 0) {
      throw new Error("Unexpected end of input");
    }

    if (!isAlpha(input[0]) && input[0] !== "*") {
      throw new Error('Token must start with letter or "*"');
    }

    let token = "";
    while (input.length > 0) {
      const char = input[0];
      if (isTchar(char) || char === ":" || char === "/") {
        token += char;
        input.shift();
      } else {
        break;
      }
    }

    return { type: "token", value: token };
  };

  const parseBinary = (input) => {
    if (input[0] !== ":") {
      throw new Error('Expected ":" at start of binary');
    }
    input.shift(); // consume opening ':'

    let encoded = "";
    while (input.length > 0 && input[0] !== ":") {
      const char = input.shift();
      if (
        isAlpha(char) ||
        isDigit(char) ||
        char === "+" ||
        char === "/" ||
        char === "="
      ) {
        encoded += char;
      } else {
        throw new Error(`Invalid base64 character: ${char}`);
      }
    }

    if (input.length === 0 || input[0] !== ":") {
      throw new Error('Expected ":" at end of binary');
    }
    input.shift(); // consume closing ':'

    try {
      const decoded = atob(encoded);
      return { type: "binary", value: encoded, decoded };
    } catch (e) {
      throw new Error("Invalid base64 encoding");
    }
  };

  const parseBoolean = (input) => {
    if (input[0] !== "?") {
      throw new Error('Expected "?" at start of boolean');
    }
    input.shift(); // consume '?'

    if (input.length === 0) {
      throw new Error('Unexpected end of input after "?"');
    }

    const value = input.shift();
    if (value === "1") {
      return true;
    } else if (value === "0") {
      return false;
    } else {
      throw new Error(`Invalid boolean value: ${value}`);
    }
  };

  // RFC 9651: Date parsing
  const parseDate = (input) => {
    if (input[0] !== "@") {
      throw new Error('Expected "@" at start of date');
    }
    input.shift(); // consume '@'

    // Parse the integer timestamp
    const timestamp = parseNumber(input);

    if (!Number.isInteger(timestamp)) {
      throw new Error("Date timestamp must be an integer");
    }

    // Validate date range (years 1 to 9999)
    if (timestamp < -62135596800 || timestamp > 253402214400) {
      throw new Error("Date out of supported range");
    }

    return { type: "date", value: new Date(timestamp * 1000) };
  };

  // RFC 9651: Display String parsing
  const parseDisplayString = (input) => {
    if (input.length < 2 || input[0] !== "%" || input[1] !== '"') {
      throw new Error(
        'Expected "%" followed by quote at start of display string'
      );
    }
    input.shift(); // consume '%'
    input.shift(); // consume opening quote

    const byteArray = [];

    while (input.length > 0) {
      const char = input.shift();

      if (char === '"') {
        // End of display string, decode UTF-8
        try {
          const decoder = new TextDecoder("utf-8", { fatal: true });
          const uint8Array = new Uint8Array(byteArray);
          const unicode = decoder.decode(uint8Array);
          return { type: "displaystring", value: unicode };
        } catch (e) {
          throw new Error("Invalid UTF-8 in display string");
        }
      } else if (char === "%") {
        // Percent-encoded byte
        if (input.length < 2) {
          throw new Error("Incomplete percent encoding");
        }
        const hex1 = input.shift();
        const hex2 = input.shift();

        if (!isLcHexDigit(hex1) || !isLcHexDigit(hex2)) {
          throw new Error("Invalid hex digits in percent encoding");
        }

        const byte = parseInt(hex1 + hex2, 16);
        byteArray.push(byte);
      } else if (isAsciiPrintable(char) && char !== '"' && char !== "%") {
        // Regular ASCII character
        byteArray.push(char.charCodeAt(0));
      } else {
        throw new Error(`Invalid character in display string: ${char}`);
      }
    }

    throw new Error("Unterminated display string");
  };

  // Serializer functions
  const serializeList = (list) => {
    return list
      .map((member) => {
        const serializedValue = Array.isArray(member.value)
          ? serializeInnerList(member.value, member.parameters || {})
          : serializeBareItem(member.value) +
            serializeParameters(member.parameters || {});
        return serializedValue;
      })
      .join(", ");
  };

  const serializeInnerList = (innerList, listParams = {}) => {
    const items = innerList
      .map(
        (item) =>
          serializeBareItem(item.value) +
          serializeParameters(item.parameters || {})
      )
      .join(" ");
    return `(${items})${serializeParameters(listParams)}`;
  };

  // Validation function for dictionary keys during serialization
  const validateKey = (key) => {
    if (typeof key !== "string" || key.length === 0) {
      throw new Error("Dictionary key must be a non-empty string");
    }

    // Check first character: must be lowercase letter or '*'
    if (!isLcAlpha(key[0]) && key[0] !== "*") {
      throw new Error('Dictionary key must start with lowercase letter or "*"');
    }

    // Check all characters: must be valid key characters
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      if (
        !isLcAlpha(char) &&
        !isDigit(char) &&
        char !== "_" &&
        char !== "-" &&
        char !== "." &&
        char !== "*"
      ) {
        throw new Error(
          `Invalid character in dictionary key: "${char}" (0x${char
            .charCodeAt(0)
            .toString(16)
            .padStart(2, "0")})`
        );
      }
    }
  };

  const serializeDictionary = (dict) => {
    return Object.entries(dict)
      .map(([key, member]) => {
        // Validate the key before serializing
        validateKey(key);

        if (member.value === true) {
          return key + serializeParameters(member.parameters || {});
        } else {
          const serializedValue = Array.isArray(member.value)
            ? serializeInnerList(member.value, {})
            : serializeBareItem(member.value);
          return (
            key +
            "=" +
            serializedValue +
            serializeParameters(member.parameters || {})
          );
        }
      })
      .join(", ");
  };

  const serializeItem = (value, params = {}) => {
    return serializeBareItem(value) + serializeParameters(params);
  };

  const serializeBareItem = (item) => {
    if (typeof item === "number") {
      if (Number.isInteger(item)) {
        // Validate integer range
        if (item < -999999999999999 || item > 999999999999999) {
          throw new Error("Integer out of serializable range");
        }
        return item.toString();
      } else {
        // Validate decimal range
        if (Math.abs(item) >= 1000000000000) {
          throw new Error("Decimal out of serializable range");
        }
        // Handle JavaScript rounding - use custom rounding to match RFC
        const rounded = Math.round(item * 1000) / 1000;
        return rounded.toFixed(3).replace(/\.?0+$/, "");
      }
    } else if (typeof item === "string") {
      // Validate string doesn't contain control characters that aren't properly escapable
      for (let i = 0; i < item.length; i++) {
        const char = item[i];
        const code = char.charCodeAt(0);
        // All control characters (0x00-0x1F and 0x7F) should fail serialization
        if (code < 0x20 || code === 0x7f) {
          throw new Error(
            `String contains invalid control character: 0x${code
              .toString(16)
              .padStart(2, "0")}`
          );
        }
      }
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    } else if (typeof item === "boolean") {
      return item ? "?1" : "?0";
    } else if (item && item.type === "token") {
      // Validate token characters
      const tokenValue = item.value;
      if (typeof tokenValue !== "string" || tokenValue.length === 0) {
        throw new Error("Token value must be a non-empty string");
      }

      // Check first character
      if (!isAlpha(tokenValue[0]) && tokenValue[0] !== "*") {
        throw new Error('Token must start with alphabetic character or "*"');
      }

      // Check all characters
      for (let i = 0; i < tokenValue.length; i++) {
        const char = tokenValue[i];
        if (!isTchar(char)) {
          throw new Error(
            `Invalid character in token: "${char}" (0x${char
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")})`
          );
        }
      }

      return tokenValue;
    } else if (item && item.type === "binary") {
      return `:${item.value}:`;
    } else if (item && item.type === "date") {
      const timestamp = Math.floor(item.value.getTime() / 1000);
      return `@${timestamp}`;
    } else if (item && item.type === "displaystring") {
      // Encode as UTF-8 and percent-encode special characters
      const encoder = new TextEncoder();
      const bytes = encoder.encode(item.value);
      let encoded = '%"';

      for (const byte of bytes) {
        if (byte === 0x25 || byte === 0x22 || byte < 0x20 || byte > 0x7e) {
          // Percent-encode
          encoded += `%${byte.toString(16).padStart(2, "0")}`;
        } else {
          // Regular ASCII character
          encoded += String.fromCharCode(byte);
        }
      }

      encoded += '"';
      return encoded;
    } else {
      throw new Error(`Unsupported item type: ${typeof item}`);
    }
  };

  const serializeParameters = (params) => {
    return Object.entries(params)
      .map(([key, value]) => {
        // Validate parameter key
        validateKey(key);

        if (value === true) {
          return `;${key}`;
        } else {
          return `;${key}=${serializeBareItem(value)}`;
        }
      })
      .join("");
  };

  // Main API
  return {
    /**
     * Parse a structured field string into JSON
     * @param {string} fieldValue - The HTTP field value
     * @param {'list'|'dictionary'|'item'} fieldType - Type: 'list', 'dictionary', or 'item'
     * @returns {any} Parsed structure
     */
    parse: (fieldValue, fieldType) => {
      if (typeof fieldValue !== "string") {
        throw new Error("Field value must be a string");
      }

      switch (fieldType) {
        case "list":
          return parseList(fieldValue);
        case "dictionary":
          return parseDictionary(fieldValue);
        case "item":
          const input = Array.from(fieldValue);
          skipSP(input); // Skip leading spaces (not tabs for items)
          const [value, params] = parseItem(input);
          skipSP(input); // Skip trailing spaces (not tabs for items)
          if (input.length > 0) {
            throw new Error(`Unexpected characters at end: ${input.join("")}`);
          }
          return { value, parameters: params };
        default:
          throw new Error('Field type must be "list", "dictionary", or "item"');
      }
    },

    /**
     * Serialize a JSON structure to a structured field string
     * @param {any} data - The data structure to serialize
     * @param {'list'|'dictionary'|'item'} fieldType - Type: 'list', 'dictionary', or 'item'
     * @returns {string} Serialized field value
     */
    serialize: (data, fieldType) => {
      switch (fieldType) {
        case "list":
          if (!Array.isArray(data)) {
            throw new Error("List data must be an array");
          }
          return serializeList(data);
        case "dictionary":
          if (
            typeof data !== "object" ||
            data === null ||
            Array.isArray(data)
          ) {
            throw new Error("Dictionary data must be an object");
          }
          return serializeDictionary(data);
        case "item":
          if (typeof data !== "object" || data === null) {
            throw new Error(
              "Item data must be an object with value and parameters"
            );
          }
          return serializeItem(data.value, data.parameters);
        default:
          throw new Error('Field type must be "list", "dictionary", or "item"');
      }
    },

    /**
     * Create a token value
     * @param {string} value - Token string
     * @returns {{type: 'token', value: string}} Token object
     */
    token: (value) => ({ type: "token", value }),

    /**
     * Create a binary value
     * @param {string} base64Value - Base64 encoded string
     * @returns {{type: 'binary', value: string}} Binary object
     */
    binary: (base64Value) => ({ type: "binary", value: base64Value }),

    /**
     * Create a date value (RFC 9651)
     * @param {Date} dateValue - JavaScript Date object
     * @returns {{type: 'date', value: Date}} Date object
     */
    date: (dateValue) => ({ type: "date", value: dateValue }),

    /**
     * Create a display string value (RFC 9651)
     * @param {string} unicodeValue - Unicode string
     * @returns {{type: 'displaystring', value: string}} Display string object
     */
    displayString: (unicodeValue) => ({
      type: "displaystring",
      value: unicodeValue,
    }),
  };
})();

export default HTTPFields;
