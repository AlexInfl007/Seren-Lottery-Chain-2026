import { parseEther } from "viem";
import { describe, expect, it } from "vitest";
import { ticketLogToActivity, winnerLogToEntry } from "@/lib/contractHistory";

const baseLog = {
  transactionHash: "0x123400000000000000000000000000000000000000000000000000000000abcd",
  blockNumber: 10n,
  logIndex: 2,
};

describe("event view-model conversion", () => {
  it("maps ticket events into activity rows", () => {
    const row = ticketLogToActivity({
      ...baseLog,
      args: {
        buyer: "0xf90169AD413429af4AE0a3B8962648d4a3289011",
        round: 5n,
        price: parseEther("30"),
      },
    } as never);

    expect(row.buyer).toBe("0xf90169AD413429af4AE0a3B8962648d4a3289011");
    expect(row.round).toBe(5n);
    expect(row.price).toBe(parseEther("30"));
    expect(row.explorerUrl).toContain("/tx/");
  });

  it("maps winner events into winner rows", () => {
    const row = winnerLogToEntry({
      ...baseLog,
      args: {
        winner: "0xf90169AD413429af4AE0a3B8962648d4a3289011",
        round: 6n,
        prize: parseEther("90"),
      },
    } as never);

    expect(row.winner).toBe("0xf90169AD413429af4AE0a3B8962648d4a3289011");
    expect(row.round).toBe(6n);
    expect(row.prize).toBe(parseEther("90"));
  });
});
