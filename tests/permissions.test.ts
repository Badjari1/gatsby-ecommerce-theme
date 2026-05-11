import { describe, expect, it } from "vitest";
import { hasPermission } from "@/lib/auth/permissions";

describe("RBAC permissions", () => {
  it("allows super administrators to manage documents", () => {
    expect(hasPermission(["SUPER_ADMIN"], "documents:write")).toBe(true);
  });

  it("prevents shareholders from modifying property records", () => {
    expect(hasPermission(["SHAREHOLDER"], "properties:write")).toBe(false);
  });
});
