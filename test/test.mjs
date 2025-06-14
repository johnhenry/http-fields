import { test, describe } from "node:test";
import assert from "node:assert";
import * as HTTPFields from "../index.mjs";

describe("RFC 8941 Structured Fields", () => {
  describe("Basic parsing", () => {
    test("should parse integers", () => {
      const int1 = HTTPFields.parse("42", "item");
      assert.deepStrictEqual(int1, { value: 42, parameters: {} });

      const int2 = HTTPFields.parse("-123", "item");
      assert.deepStrictEqual(int2, { value: -123, parameters: {} });
    });

    test("should parse decimals", () => {
      const dec1 = HTTPFields.parse("3.14", "item");
      assert.deepStrictEqual(dec1, { value: 3.14, parameters: {} });

      const dec2 = HTTPFields.parse("-2.5", "item");
      assert.deepStrictEqual(dec2, { value: -2.5, parameters: {} });
    });

    test("should parse strings", () => {
      const str1 = HTTPFields.parse('"hello world"', "item");
      assert.deepStrictEqual(str1, { value: "hello world", parameters: {} });

      const str2 = HTTPFields.parse('"escaped \\"quote\\""', "item");
      assert.deepStrictEqual(str2, {
        value: 'escaped "quote"',
        parameters: {},
      });
    });

    test("should parse tokens", () => {
      const tok1 = HTTPFields.parse("application/json", "item");
      assert.deepStrictEqual(tok1, {
        value: { type: "token", value: "application/json" },
        parameters: {},
      });
    });

    test("should parse booleans", () => {
      const bool1 = HTTPFields.parse("?1", "item");
      assert.deepStrictEqual(bool1, { value: true, parameters: {} });

      const bool2 = HTTPFields.parse("?0", "item");
      assert.deepStrictEqual(bool2, { value: false, parameters: {} });
    });

    test("should parse binary data", () => {
      const bin1 = HTTPFields.parse(":SGVsbG8=:", "item");
      assert.strictEqual(bin1.value.type, "binary");
      assert.strictEqual(bin1.value.value, "SGVsbG8=");
    });
  });

  describe("Parameters", () => {
    test("should parse items with parameters", () => {
      const paramItem = HTTPFields.parse("42;foo=bar;baz", "item");
      assert.deepStrictEqual(paramItem, {
        value: 42,
        parameters: {
          foo: { type: "token", value: "bar" },
          baz: true,
        },
      });
    });
  });

  describe("Lists", () => {
    test("should parse basic lists", () => {
      const list1 = HTTPFields.parse("a, b, c", "list");
      assert.deepStrictEqual(list1, [
        { value: { type: "token", value: "a" }, parameters: {} },
        { value: { type: "token", value: "b" }, parameters: {} },
        { value: { type: "token", value: "c" }, parameters: {} },
      ]);
    });

    test("should parse mixed type lists", () => {
      const list2 = HTTPFields.parse('1, "hello", ?1', "list");
      assert.deepStrictEqual(list2, [
        { value: 1, parameters: {} },
        { value: "hello", parameters: {} },
        { value: true, parameters: {} },
      ]);
    });

    test("should parse lists with parameters", () => {
      const list3 = HTTPFields.parse("a;x=1, b;y=2", "list");
      assert.deepStrictEqual(list3, [
        { value: { type: "token", value: "a" }, parameters: { x: 1 } },
        { value: { type: "token", value: "b" }, parameters: { y: 2 } },
      ]);
    });
  });

  describe("Inner Lists", () => {
    test("should parse basic inner lists", () => {
      const innerList1 = HTTPFields.parse("(a b c)", "list");
      assert.deepStrictEqual(innerList1, [
        {
          value: [
            { value: { type: "token", value: "a" }, parameters: {} },
            { value: { type: "token", value: "b" }, parameters: {} },
            { value: { type: "token", value: "c" }, parameters: {} },
          ],
          parameters: {},
        },
      ]);
    });

    test("should parse mixed lists with inner lists", () => {
      const innerList2 = HTTPFields.parse("a, (b c), d", "list");
      assert.deepStrictEqual(innerList2, [
        { value: { type: "token", value: "a" }, parameters: {} },
        {
          value: [
            { value: { type: "token", value: "b" }, parameters: {} },
            { value: { type: "token", value: "c" }, parameters: {} },
          ],
          parameters: {},
        },
        { value: { type: "token", value: "d" }, parameters: {} },
      ]);
    });
  });

  describe("Dictionaries", () => {
    test("should parse basic dictionaries", () => {
      const dict1 = HTTPFields.parse("a=1, b=2", "dictionary");
      assert.deepStrictEqual(dict1, {
        a: { value: 1, parameters: {} },
        b: { value: 2, parameters: {} },
      });
    });

    test("should parse dictionaries with boolean values", () => {
      const dict2 = HTTPFields.parse("foo, bar=baz", "dictionary");
      assert.deepStrictEqual(dict2, {
        foo: { value: true, parameters: {} },
        bar: { value: { type: "token", value: "baz" }, parameters: {} },
      });
    });

    test("should parse complex dictionaries", () => {
      const dict3 = HTTPFields.parse("a=1;x=y, b=(c d)", "dictionary");
      assert.deepStrictEqual(dict3, {
        a: { value: 1, parameters: { x: { type: "token", value: "y" } } },
        b: {
          value: [
            { value: { type: "token", value: "c" }, parameters: {} },
            { value: { type: "token", value: "d" }, parameters: {} },
          ],
          parameters: {},
        },
      });
    });
  });

  describe("Serialization", () => {
    test("should serialize lists", () => {
      const listData = [
        { value: HTTPFields.token("sugar"), parameters: {} },
        { value: HTTPFields.token("tea"), parameters: { quality: 0.8 } },
        { value: HTTPFields.token("rum"), parameters: {} },
      ];
      const serializedList = HTTPFields.serialize(listData, "list");
      assert.strictEqual(serializedList, "sugar, tea;quality=0.8, rum");
    });

    test("should serialize dictionaries", () => {
      const dictData = {
        "max-age": { value: 3600, parameters: {} },
        private: { value: true, parameters: {} },
        "must-revalidate": { value: true, parameters: {} },
      };
      const serializedDict = HTTPFields.serialize(dictData, "dictionary");
      assert.strictEqual(
        serializedDict,
        "max-age=3600, private, must-revalidate"
      );
    });

    test("should serialize items", () => {
      const itemData = {
        value: HTTPFields.token("application-json"),
        parameters: { charset: HTTPFields.token("utf-8") },
      };
      const serializedItem = HTTPFields.serialize(itemData, "item");
      assert.strictEqual(serializedItem, "application-json;charset=utf-8");
    });
  });

  describe("Round-trip parsing", () => {
    const roundTripTests = [
      { input: "a, b, c", type: "list" },
      { input: "a=1, b=2", type: "dictionary" },
      { input: "42;foo=bar", type: "item" },
      { input: "(a b), c", type: "list" },
      { input: "foo, bar=baz;x=y", type: "dictionary" },
    ];

    roundTripTests.forEach(({ input, type }, index) => {
      test(`should round-trip: ${input}`, () => {
        const parsed = HTTPFields.parse(input, type);
        const serialized = HTTPFields.serialize(parsed, type);
        const reparsed = HTTPFields.parse(serialized, type);
        assert.deepStrictEqual(parsed, reparsed);
      });
    });
  });

  describe("Error handling", () => {
    test("should throw on invalid syntax", () => {
      assert.throws(() => HTTPFields.parse("invalid[", "list"));
      assert.throws(() => HTTPFields.parse('"unterminated', "item"));
      assert.throws(() => HTTPFields.parse("999999999999999999", "item"));
      assert.throws(() => HTTPFields.parse("1.2345", "item"));
      assert.throws(() => HTTPFields.parse(":invalid_base64:", "item"));
    });
  });

  describe("Helper functions", () => {
    test("should create token objects", () => {
      const token = HTTPFields.token("test");
      assert.deepStrictEqual(token, { type: "token", value: "test" });
    });

    test("should create binary objects", () => {
      const binary = HTTPFields.binary("SGVsbG8=");
      assert.deepStrictEqual(binary, { type: "binary", value: "SGVsbG8=" });
    });

    test("should create date objects", () => {
      const date = new Date("2023-01-15T10:30:00Z");
      const dateObj = HTTPFields.date(date);
      assert.deepStrictEqual(dateObj, { type: "date", value: date });
    });

    test("should create display string objects", () => {
      const displayStr = HTTPFields.displayString("Hello 世界");
      assert.deepStrictEqual(displayStr, {
        type: "displaystring",
        value: "Hello 世界",
      });
    });
  });

  describe("RFC 9651 Features", () => {
    describe("Date values", () => {
      test("should parse date values", () => {
        const date1 = HTTPFields.parse("@1659889457", "item");
        assert.strictEqual(date1.value.type, "date");
        assert.strictEqual(date1.value.value.getTime(), 1659889457000);
      });

      test("should parse dates with parameters", () => {
        const dateWithParam = HTTPFields.parse("@1659889457;foo=bar", "item");
        assert.strictEqual(dateWithParam.value.type, "date");
        assert.strictEqual(dateWithParam.value.value.getTime(), 1659889457000);
        assert.deepStrictEqual(dateWithParam.parameters.foo, {
          type: "token",
          value: "bar",
        });
      });

      test("should serialize date values", () => {
        const date = new Date(1659889457000);
        const dateItem = {
          value: HTTPFields.date(date),
          parameters: {},
        };
        const serialized = HTTPFields.serialize(dateItem, "item");
        assert.strictEqual(serialized, "@1659889457");
      });

      test("should handle dates in lists", () => {
        const list = HTTPFields.parse("@1659889457, @1659889458", "list");
        assert.strictEqual(list[0].value.type, "date");
        assert.strictEqual(list[1].value.type, "date");
        assert.strictEqual(list[0].value.value.getTime(), 1659889457000);
        assert.strictEqual(list[1].value.value.getTime(), 1659889458000);
      });

      test("should reject invalid date values", () => {
        assert.throws(
          () => HTTPFields.parse("@1.5", "item"),
          /Date timestamp must be an integer/
        );
        assert.throws(
          () => HTTPFields.parse("@999999999999999", "item"),
          /Date out of supported range/
        );
        assert.throws(
          () => HTTPFields.parse("@-99999999999999", "item"),
          /Date out of supported range/
        );
      });
    });

    describe("Display string values", () => {
      test("should parse ASCII display strings", () => {
        const str1 = HTTPFields.parse('%"Hello World"', "item");
        assert.strictEqual(str1.value.type, "displaystring");
        assert.strictEqual(str1.value.value, "Hello World");
      });

      test("should parse Unicode display strings", () => {
        const str2 = HTTPFields.parse('%"Hello %e4%b8%96%e7%95%8c"', "item");
        assert.strictEqual(str2.value.type, "displaystring");
        assert.strictEqual(str2.value.value, "Hello 世界");
      });

      test("should parse display strings with percent-encoded special chars", () => {
        const str3 = HTTPFields.parse('%"Hello%20%22World%22"', "item");
        assert.strictEqual(str3.value.type, "displaystring");
        assert.strictEqual(str3.value.value, 'Hello "World"');
      });

      test("should serialize display strings", () => {
        const displayStr = {
          value: HTTPFields.displayString("Hello 世界"),
          parameters: {},
        };
        const serialized = HTTPFields.serialize(displayStr, "item");
        assert.strictEqual(serialized, '%"Hello %e4%b8%96%e7%95%8c"');
      });

      test("should serialize display strings with special characters", () => {
        const displayStr = {
          value: HTTPFields.displayString('Hello "World"'),
          parameters: {},
        };
        const serialized = HTTPFields.serialize(displayStr, "item");
        assert.strictEqual(serialized, '%"Hello %22World%22"');
      });

      test("should handle display strings in dictionaries", () => {
        const dict = HTTPFields.parse(
          'msg=%"Hello %e4%b8%96%e7%95%8c", status=ok',
          "dictionary"
        );
        assert.strictEqual(dict.msg.value.type, "displaystring");
        assert.strictEqual(dict.msg.value.value, "Hello 世界");
        assert.deepStrictEqual(dict.status.value, {
          type: "token",
          value: "ok",
        });
      });

      test("should reject invalid UTF-8 sequences", () => {
        assert.throws(
          () => HTTPFields.parse('%"Invalid %ff%fe"', "item"),
          /Invalid UTF-8/
        );
      });

      test("should reject invalid percent encoding", () => {
        assert.throws(
          () => HTTPFields.parse('%"Invalid %gg"', "item"),
          /Invalid hex digits/
        );
        assert.throws(
          () => HTTPFields.parse('%"Invalid %f"', "item"),
          /Invalid hex digits/
        );
      });
    });

    describe("Mixed RFC 9651 features", () => {
      test("should handle dates and display strings in same list", () => {
        const list = HTTPFields.parse(
          '@1659889457, %"Event %e5%90%8d"',
          "list"
        );
        assert.strictEqual(list[0].value.type, "date");
        assert.strictEqual(list[1].value.type, "displaystring");
        assert.strictEqual(list[1].value.value, "Event 名");
      });

      test("should round-trip RFC 9651 values", () => {
        const original = [
          { value: HTTPFields.date(new Date(1672531200000)), parameters: {} },
          {
            value: HTTPFields.displayString("Test 测试"),
            parameters: { lang: HTTPFields.token("zh") },
          },
        ];
        const serialized = HTTPFields.serialize(original, "list");
        const parsed = HTTPFields.parse(serialized, "list");

        assert.strictEqual(parsed[0].value.type, "date");
        assert.strictEqual(parsed[0].value.value.getTime(), 1672531200000);
        assert.strictEqual(parsed[1].value.type, "displaystring");
        assert.strictEqual(parsed[1].value.value, "Test 测试");
        assert.deepStrictEqual(parsed[1].parameters.lang, {
          type: "token",
          value: "zh",
        });
      });
    });
  });

  describe("Real-world examples", () => {
    test("should parse Cache-Control headers", () => {
      const cacheControl = HTTPFields.parse(
        "max-age=3600, private, must-revalidate",
        "dictionary"
      );
      assert.strictEqual(cacheControl["max-age"].value, 3600);
      assert.strictEqual(cacheControl.private.value, true);
      assert.strictEqual(cacheControl["must-revalidate"].value, true);
    });

    test("should parse Accept headers", () => {
      const accept = HTTPFields.parse(
        "text/html;q=0.9, application/json;q=0.8",
        "list"
      );
      assert.strictEqual(accept[0].value.value, "text/html");
      assert.strictEqual(accept[0].parameters.q, 0.9);
      assert.strictEqual(accept[1].value.value, "application/json");
      assert.strictEqual(accept[1].parameters.q, 0.8);
    });

    test("should handle Expires-like headers with dates", () => {
      const expiresDict = HTTPFields.parse(
        "resource=@1672531200, cache=@1672617600",
        "dictionary"
      );
      assert.strictEqual(expiresDict.resource.value.type, "date");
      assert.strictEqual(expiresDict.cache.value.type, "date");
      assert.strictEqual(
        expiresDict.resource.value.value.getTime(),
        1672531200000
      );
      assert.strictEqual(
        expiresDict.cache.value.value.getTime(),
        1672617600000
      );
    });

    test("should handle localized content headers", () => {
      const contentDict = HTTPFields.parse(
        'title=%"Welcome %e6%ac%a2%e8%bf%8e", lang=zh-CN',
        "dictionary"
      );
      assert.strictEqual(contentDict.title.value.type, "displaystring");
      assert.strictEqual(contentDict.title.value.value, "Welcome 欢迎");
      assert.deepStrictEqual(contentDict.lang.value, {
        type: "token",
        value: "zh-CN",
      });
    });
  });
});
