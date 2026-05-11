import { describe, expect, it } from "vitest";
import { shareholderCreateSchema } from "@/lib/validation/schemas";

describe("shareholder validation", () => {
  it("normalizes email and accepts valid equity data", () => {
    const parsed = shareholderCreateSchema.parse({ legalName: "Apex Holdings LLC", email: "OPS@APEX.EXAMPLE", country: "US", shareClass: "COMMON", shares: 100, joinedAt: "2026-01-10" });
    expect(parsed.email).toBe("ops@apex.example");
  });
});
