import { formatEther, isAddress } from "viem";

export function formatPol(value?: bigint | null): string {
  if (value === undefined || value === null) return "—";
  const raw = formatEther(value);
  const [whole, fraction = ""] = raw.split(".");
  const trimmed = fraction.slice(0, 4).replace(/0+$/, "");
  return `${trimmed ? `${whole}.${trimmed}` : whole} POL`;
}

export function formatCount(value?: bigint | null): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function shortenAddress(value?: string, size = 4): string {
  if (!value || !isAddress(value)) return "—";
  return `${value.slice(0, size + 2)}…${value.slice(-size)}`;
}

export function shortenHash(value?: string, size = 6): string {
  if (!value) return "—";
  return `${value.slice(0, size + 2)}…${value.slice(-size)}`;
}

export function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
