import { describe, expect, it } from "vitest";
import { normalizeTags } from "@/lib/tags";
import { buildWhere, firstParam, listHref, parsePage } from "@/lib/prompts";
import { promptInputSchema } from "@/lib/validation";

describe("normalizeTags", () => {
  it("trims, lowercases and dedupes", () => {
    expect(normalizeTags(" Coding, AI , coding ,")).toEqual(["coding", "ai"]);
  });
  it("caps at 10 tags", () => {
    const many = Array.from({ length: 15 }, (_, i) => `t${i}`);
    expect(normalizeTags(many)).toHaveLength(10);
  });
});

describe("buildWhere", () => {
  it("searches title and body", () => {
    expect(buildWhere({ q: " hello " }).OR).toHaveLength(2);
  });
  it("filters by lowercase tag", () => {
    expect(buildWhere({ tag: "Writing" }).tags).toEqual({ some: { name: "writing" } });
  });
});

describe("parsePage", () => {
  it("falls back to 1 for bad input", () => {
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("3")).toBe(3);
  });
});

// TODO: add the happy-path integration test (register -> create prompt -> fetch -> search)
// once the API routes exist. Use DATABASE_URL=file:./test.db.

describe("listHref", () => {
  it("keeps filters, drops empty values and page 1", () => {
    expect(listHref({ q: "sql", tag: "coding", page: 1 })).toBe("/?q=sql&tag=coding");
    expect(
      listHref({ q: "sql", tag: "coding", page: 2 }, { tag: undefined, page: 1 }),
    ).toBe("/?q=sql");
    expect(listHref({}, { page: 3 })).toBe("/?page=3");
    expect(listHref({})).toBe("/");
  });
});

describe("firstParam", () => {
  it("takes the first value of repeated params", () => {
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam("a")).toBe("a");
    expect(firstParam(undefined)).toBeUndefined();
  });
});

describe("promptInputSchema", () => {
  const base = { title: " Hi ", body: " Say hi " };
  it("trims fields and normalizes tags", () => {
    expect(promptInputSchema.parse({ ...base, tags: "AI, ai , Coding" })).toEqual({
      title: "Hi",
      body: "Say hi",
      tags: ["ai", "coding"],
    });
  });
  it("rejects more than 10 tags instead of dropping them", () => {
    const tags = Array.from({ length: 11 }, (_, i) => `t${i}`).join(",");
    expect(promptInputSchema.safeParse({ ...base, tags }).success).toBe(false);
  });
  it("rejects a blank title", () => {
    const r = promptInputSchema.safeParse({ ...base, title: "   " });
    expect(r.error?.issues[0].message).toBe("Title is required");
  });
});
