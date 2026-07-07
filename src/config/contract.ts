import { getAddress, parseAbi, type Abi } from "viem";

export const POLYGON_CHAIN_ID = 137;
export const POLYGON_CHAIN_ID_HEX = "0x89";
export const POLYGON_RPC_URLS = ["https://polygon-rpc.com"];
export const POLYGON_EXPLORER = "https://polygonscan.com";
export const CONTRACT_ADDRESS = getAddress(
  "0xf90169AD413429af4AE0a3B8962648d4a3289011",
);
export const DEPLOYMENT_BLOCK = 76819613n;

export type PurchaseFunctionName = "buyTicket" | "enterRaffle";
export type PriceFunctionName = "ticketPrice" | "TICKET_PRICE";

export const PURCHASE_FUNCTIONS = ["buyTicket", "enterRaffle"] as const;
export const CANONICAL_PRICE_METHOD: PriceFunctionName = "ticketPrice";

export const configuredPurchaseFunction = (
  process.env.NEXT_PUBLIC_PURCHASE_FUNCTION || "buyTicket"
) as PurchaseFunctionName;

export const CONTRACT_ABI = parseAbi([
  "function prizePool() view returns (uint256)",
  "function round() view returns (uint256)",
  "function ticketsCount() view returns (uint256)",
  "function ticketsOf(address player) view returns (uint256)",
  "function ticketPrice() view returns (uint256)",
  "function TICKET_PRICE() view returns (uint256)",
  "function open() view returns (bool)",
  "function maxTicketsPerRound() view returns (uint256)",
  "function maxTicketsPerAddress() view returns (uint256)",
  "function emergencyActive() view returns (bool)",
  "function buyTicket() payable",
  "function enterRaffle() payable",
  "event TicketBought(address indexed buyer, uint256 indexed round, uint256 price)",
  "event WinnerPicked(address indexed winner, uint256 indexed round, uint256 prize)",
]) satisfies Abi;

export const HISTORY_SCAN_CONFIG = {
  deploymentBlock: DEPLOYMENT_BLOCK,
  initialBlockSpan: 90_000n,
  minBlockSpan: 2_000n,
  purchaseLimit: 8,
  winnerLimit: 6,
  sessionKey: "seren.history.v1",
};

export const CONTRACT_LINK = `${POLYGON_EXPLORER}/address/${CONTRACT_ADDRESS}`;

export const POLYGON_CHAIN_PARAMS = {
  chainId: POLYGON_CHAIN_ID_HEX,
  chainName: "Polygon Mainnet",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: POLYGON_RPC_URLS,
  blockExplorerUrls: [POLYGON_EXPLORER],
};
