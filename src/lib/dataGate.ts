import { POLYGON_CHAIN_ID } from "@/config/contract";

export type DataGateInput = {
  hasExplicitConnection: boolean;
  chainId?: number;
};

export function canLoadContractData({ hasExplicitConnection, chainId }: DataGateInput) {
  return hasExplicitConnection && chainId === POLYGON_CHAIN_ID;
}
