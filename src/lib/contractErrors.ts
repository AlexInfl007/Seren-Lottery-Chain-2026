export type ErrorKey =
  | "walletUnavailable"
  | "userRejected"
  | "wrongNetwork"
  | "noAccounts"
  | "providerFailure"
  | "configInvalid"
  | "readFailed"
  | "simulationFailed"
  | "purchaseClosed"
  | "emergencyActive"
  | "insufficientFunds"
  | "transactionRejected"
  | "transactionFailed"
  | "historyUnavailable";

export type AppError = {
  key: ErrorKey;
  technical?: string;
};

export function normalizeContractError(error: unknown): AppError {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const lower = message.toLowerCase();

  if (lower.includes("user rejected") || lower.includes("rejected the request")) {
    return { key: "userRejected", technical: message };
  }

  if (lower.includes("insufficient funds") || lower.includes("exceeds the balance")) {
    return { key: "insufficientFunds", technical: message };
  }

  if (lower.includes("simulation") || lower.includes("reverted")) {
    return { key: "simulationFailed", technical: message };
  }

  if (lower.includes("range") || lower.includes("eth_getlogs")) {
    return { key: "historyUnavailable", technical: message };
  }

  return { key: "providerFailure", technical: message };
}
