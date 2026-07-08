import {
  createPublicClient,
  custom,
  type Address,
  type PublicClient,
  type WalletClient,
} from "viem";
import { polygon } from "viem/chains";
import {
  CANONICAL_PRICE_METHOD,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  EXPECTED_TICKET_PRICE,
} from "@/config/contract";
import type { Eip1193Provider } from "@/lib/eip1193";
import { validatePurchaseMethod } from "@/lib/contractAdapter";

export type LotteryState = {
  prizePool: bigint;
  round: bigint;
  ticketsCount: bigint;
  userTickets: bigint;
  ticketPrice: bigint;
  ticketPriceSource: "ticketPrice" | "TICKET_PRICE";
  priceMismatch: boolean;
  unexpectedTicketPrice: boolean;
  open: boolean;
  emergencyActive: boolean;
  maxTicketsPerRound?: bigint;
  maxTicketsPerAddress?: bigint;
  canPurchase: boolean;
  purchaseUnavailableReason?: "closed" | "emergency" | "price_mismatch" | "config_invalid";
};

export function createWalletPublicClient(provider: Eip1193Provider): PublicClient {
  return createPublicClient({
    chain: polygon,
    transport: custom(provider),
  }) as unknown as PublicClient;
}

async function optionalRead<T>(
  client: PublicClient,
  functionName:
    | "ticketPrice"
    | "TICKET_PRICE"
    | "maxTicketsPerRound"
    | "maxTicketsPerAddress"
    | "emergencyActive",
): Promise<T | undefined> {
  try {
    return (await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName,
    })) as T;
  } catch {
    return undefined;
  }
}

export async function readLotteryState(
  provider: Eip1193Provider,
  account: Address,
): Promise<LotteryState> {
  const client = createWalletPublicClient(provider);
  const [
    prizePool,
    round,
    ticketsCount,
    userTickets,
    open,
    emergencyActive,
    ticketPriceValue,
    constantPriceValue,
    maxTicketsPerRound,
    maxTicketsPerAddress,
  ] = await Promise.all([
    client.readContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "prizePool" }),
    client.readContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "round" }),
    client.readContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "ticketsCount" }),
    client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "ticketsOf",
      args: [account],
    }),
    client.readContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "open" }),
    optionalRead<boolean>(client, "emergencyActive"),
    optionalRead<bigint>(client, "ticketPrice"),
    optionalRead<bigint>(client, "TICKET_PRICE"),
    optionalRead<bigint>(client, "maxTicketsPerRound"),
    optionalRead<bigint>(client, "maxTicketsPerAddress"),
  ]);

  const hasTicketPrice = ticketPriceValue !== undefined;
  const hasConstantPrice = constantPriceValue !== undefined;
  const priceMismatch =
    hasTicketPrice && hasConstantPrice && ticketPriceValue !== constantPriceValue;
  const ticketPrice =
    CANONICAL_PRICE_METHOD === "ticketPrice"
      ? ticketPriceValue ?? constantPriceValue
      : constantPriceValue ?? ticketPriceValue;

  if (ticketPrice === undefined) {
    throw new Error("Ticket price method is unavailable on this contract.");
  }

  const purchaseValidation = validatePurchaseMethod();
  const unexpectedTicketPrice = ticketPrice !== EXPECTED_TICKET_PRICE;
  const isEmergency = Boolean(emergencyActive);
  const isOpen = Boolean(open);
  const canPurchase = purchaseValidation.ok && isOpen && !isEmergency && !priceMismatch;
  const purchaseUnavailableReason = !purchaseValidation.ok
    ? "config_invalid"
    : priceMismatch
      ? "price_mismatch"
      : isEmergency
        ? "emergency"
        : !isOpen
          ? "closed"
          : undefined;

  return {
    prizePool: prizePool as bigint,
    round: round as bigint,
    ticketsCount: ticketsCount as bigint,
    userTickets: userTickets as bigint,
    ticketPrice,
    ticketPriceSource: hasTicketPrice ? "ticketPrice" : "TICKET_PRICE",
    priceMismatch,
    unexpectedTicketPrice,
    open: isOpen,
    emergencyActive: isEmergency,
    maxTicketsPerRound: maxTicketsPerRound && maxTicketsPerRound > 0n ? maxTicketsPerRound : undefined,
    maxTicketsPerAddress:
      maxTicketsPerAddress && maxTicketsPerAddress > 0n ? maxTicketsPerAddress : undefined,
    canPurchase,
    purchaseUnavailableReason,
  };
}

export async function simulateTicketPurchase(params: {
  client: PublicClient;
  walletClient: WalletClient;
  account: Address;
  value: bigint;
}) {
  const validation = validatePurchaseMethod();
  if (!validation.ok) {
    throw new Error("Lottery purchase is temporarily unavailable because the contract configuration requires verification.");
  }

  return params.client.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    account: params.account,
    functionName: validation.method,
    value: params.value,
  });
}
