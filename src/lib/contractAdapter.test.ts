import { describe, expect, it } from "vitest";
import { validatePurchaseMethod } from "@/lib/contractAdapter";

describe("contract adapter validation", () => {
  it("accepts configured payable no-argument purchase functions", () => {
    expect(validatePurchaseMethod("buyTicket")).toEqual({ ok: true, method: "buyTicket" });
    expect(validatePurchaseMethod("enterRaffle")).toEqual({ ok: true, method: "enterRaffle" });
  });

  it("rejects unsupported purchase functions", () => {
    expect(validatePurchaseMethod("transfer")).toEqual({ ok: false, reason: "unsupported_method" });
  });
});
