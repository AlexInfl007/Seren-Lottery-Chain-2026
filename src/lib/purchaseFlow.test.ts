import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contractReads", () => ({
  simulateTicketPurchase: vi.fn().mockRejectedValue(new Error("simulation reverted")),
}));

describe("purchase flow", () => {
  it("does not submit a wallet transaction when simulation fails", async () => {
    const { executeTicketPurchase } = await import("@/lib/purchaseFlow");
    const writeContract = vi.fn();

    await expect(
      executeTicketPurchase({
        client: {} as never,
        walletClient: { writeContract } as never,
        account: "0xf90169AD413429af4AE0a3B8962648d4a3289011",
        value: 30n,
      }),
    ).rejects.toThrow("simulation reverted");

    expect(writeContract).not.toHaveBeenCalled();
  });
});
