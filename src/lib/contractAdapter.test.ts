import { describe, expect, it } from "vitest";
import { validatePurchaseMethod } from "@/lib/contractAdapter";

describe("contract adapter validation", () => {
  it("accepts only the verified public ticket purchase function", () => {
    expect(validatePurchaseMethod("buyTicket")).toEqual({ ok: true, method: "buyTicket" });
    expect(validatePurchaseMethod("enterRaffle")).toEqual({ ok: false, reason: "unsupported_method" });
  });

  it("rejects unsupported purchase functions", () => {
    expect(validatePurchaseMethod("transfer")).toEqual({ ok: false, reason: "unsupported_method" });
  });
});
