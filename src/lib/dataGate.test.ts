import { describe, expect, it } from "vitest";
import { POLYGON_CHAIN_ID } from "@/config/contract";
import { canLoadContractData } from "@/lib/dataGate";

describe("wallet-gated data loading", () => {
  it("blocks contract reads before explicit wallet connection", () => {
    expect(canLoadContractData({ hasExplicitConnection: false, chainId: POLYGON_CHAIN_ID })).toBe(false);
  });

  it("blocks contract reads on the wrong network", () => {
    expect(canLoadContractData({ hasExplicitConnection: true, chainId: 1 })).toBe(false);
  });

  it("allows reads only after explicit connection on Polygon", () => {
    expect(canLoadContractData({ hasExplicitConnection: true, chainId: POLYGON_CHAIN_ID })).toBe(true);
  });
});
