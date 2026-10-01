import { describe, expect, it } from "vitest";
import { normalizeTags } from "@/lib/tags";
import { buildWhere, parsePage } from "@/lib/prompts";

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
