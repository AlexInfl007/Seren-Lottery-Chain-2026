import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  PURCHASE_FUNCTIONS,
  configuredPurchaseFunction,
  type PurchaseFunctionName,
} from "@/config/contract";

export type PurchaseValidation =
  | { ok: true; method: PurchaseFunctionName }
  | { ok: false; reason: "unsupported_method" | "missing_method" | "not_payable" | "has_inputs" };

type AbiFunction = {
  type: "function";
  name: string;
  stateMutability?: string;
  inputs?: readonly unknown[];
};

export function getConfiguredPurchaseFunction(): PurchaseFunctionName | string {
  return configuredPurchaseFunction;
}

export function validatePurchaseMethod(
  method = getConfiguredPurchaseFunction(),
): PurchaseValidation {
  if (!PURCHASE_FUNCTIONS.includes(method as PurchaseFunctionName)) {
    return { ok: false, reason: "unsupported_method" };
  }

  const fragment = (CONTRACT_ABI as readonly AbiFunction[]).find(
    (item) => item.type === "function" && item.name === method,
  );

  if (!fragment) return { ok: false, reason: "missing_method" };
  if (fragment.stateMutability !== "payable") return { ok: false, reason: "not_payable" };
  if ((fragment.inputs?.length || 0) > 0) return { ok: false, reason: "has_inputs" };

  return { ok: true, method: method as PurchaseFunctionName };
}

export function getContractAdapter() {
  return {
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    purchaseMethod: getConfiguredPurchaseFunction(),
    purchaseValidation: validatePurchaseMethod(),
  };
}
