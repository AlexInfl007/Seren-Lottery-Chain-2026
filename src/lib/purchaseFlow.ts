import type { Address, Hash, PublicClient, WalletClient } from "viem";
import { simulateTicketPurchase } from "@/lib/contractReads";

export type PurchaseProgress = "simulating" | "awaitingWallet" | "pending";

export async function executeTicketPurchase(params: {
  client: PublicClient;
  walletClient: WalletClient;
  account: Address;
  value: bigint;
  onProgress?: (progress: PurchaseProgress, hash?: Hash) => void;
}) {
  params.onProgress?.("simulating");
  const simulation = await simulateTicketPurchase({
    client: params.client,
    walletClient: params.walletClient,
    account: params.account,
    value: params.value,
  });

  params.onProgress?.("awaitingWallet");
  const hash = await params.walletClient.writeContract(simulation.request);
  params.onProgress?.("pending", hash);
  const receipt = await params.client.waitForTransactionReceipt({ hash, confirmations: 1 });
  return { hash, receipt };
}
