import * as HTTPFields from "../index.mjs";

console.log("RFC 9651 - Dates and Display Strings Examples");
console.log("=============================================\n");

// Date Examples
console.log("1. Date Values:");

// Parsing dates
const expiresHeader = "@1672531200";
const parsedDate = HTTPFields.parse(expiresHeader, "item");
console.log("Parsed date:", parsedDate);
console.log("As JavaScript Date:", parsedDate.value.value);
console.log("ISO String:", parsedDate.value.value.toISOString());

// Serializing dates
const futureDate = new Date("2025-12-31T23:59:59Z");
const dateItem = {
  value: HTTPFields.date(futureDate),
  parameters: { priority: HTTPFields.token("high") },
};
const serializedDate = HTTPFields.serialize(dateItem, "item");
console.log("\nSerialized date with parameter:", serializedDate);

// Date in dictionary
const timingDict = {
  start: {
    value: HTTPFields.date(new Date("2024-01-01T00:00:00Z")),
    parameters: {},
  },
  end: {
    value: HTTPFields.date(new Date("2024-12-31T23:59:59Z")),
    parameters: {},
  },
  duration: { value: 365, parameters: { unit: HTTPFields.token("days") } },
};
const serializedTiming = HTTPFields.serialize(timingDict, "dictionary");
console.log("\nTiming dictionary:", serializedTiming);

// Display String Examples
console.log("\n2. Display String Values:");

// Parsing display strings
const greetingHeader = '%"Hello %e4%b8%96%e7%95%8c"';
const parsedGreeting = HTTPFields.parse(greetingHeader, "item");
console.log("Parsed display string:", parsedGreeting);
console.log("Unicode value:", parsedGreeting.value.value);

// Serializing display strings
const unicodeMessage = {
  value: HTTPFields.displayString("Welcome to Tokyo 東京へようこそ"),
  parameters: { lang: HTTPFields.token("ja") },
};
const serializedUnicode = HTTPFields.serialize(unicodeMessage, "item");
console.log("\nSerialized display string:", serializedUnicode);

// Mixed content in a list
console.log("\n3. Mixed RFC 9651 Features:");

const eventList = [
  {
    value: HTTPFields.displayString("Conference 会議"),
    parameters: { type: HTTPFields.token("event") },
  },
  {
    value: HTTPFields.date(new Date("2024-06-15T09:00:00Z")),
    parameters: { timezone: HTTPFields.token("JST") },
  },
  {
    value: HTTPFields.token("tokyo-convention-center"),
    parameters: {},
  },
];
const serializedEvent = HTTPFields.serialize(eventList, "list");
console.log("Event list:", serializedEvent);

// Parse it back
const parsedEvent = HTTPFields.parse(serializedEvent, "list");
console.log("\nParsed event list:");
parsedEvent.forEach((item, index) => {
  if (item.value.type === "displaystring") {
    console.log(`  [${index}] Display String: "${item.value.value}"`);
  } else if (item.value.type === "date") {
    console.log(`  [${index}] Date: ${item.value.value.toISOString()}`);
  } else if (item.value.type === "token") {
    console.log(`  [${index}] Token: ${item.value.value}`);
  }
  if (Object.keys(item.parameters).length > 0) {
    console.log(`       Parameters:`, item.parameters);
  }
});

// Localized content dictionary
console.log("\n4. Localized Content Example:");

const localizedContent = {
  "title-en": {
    value: HTTPFields.displayString("Product Catalog"),
    parameters: {},
  },
  "title-ja": {
    value: HTTPFields.displayString("製品カタログ"),
    parameters: {},
  },
  "title-zh": {
    value: HTTPFields.displayString("产品目录"),
    parameters: {},
  },
  updated: {
    value: HTTPFields.date(new Date()),
    parameters: {},
  },
};
const serializedLocalized = HTTPFields.serialize(
  localizedContent,
  "dictionary"
);
console.log("Localized content:", serializedLocalized);

// Error handling examples
console.log("\n5. Error Handling:");

try {
  HTTPFields.parse("@1.5", "item");
} catch (error) {
  console.log("Invalid date (decimal):", error.message);
}

try {
  HTTPFields.parse('%"Invalid %gg"', "item");
} catch (error) {
  console.log("Invalid hex in display string:", error.message);
}

try {
  HTTPFields.parse("@999999999999999", "item");
} catch (error) {
  console.log("Date out of range:", error.message);
}
