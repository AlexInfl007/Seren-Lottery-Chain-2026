export type HexString = `0x${string}`;

export type Eip1193Request = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

export type Eip1193Provider = {
  request<T = unknown>(request: Eip1193Request): Promise<T>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

export type WalletProviderInfo = {
  id: string;
  name: string;
  provider: Eip1193Provider;
  rdns?: string;
  icon?: string;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      providers?: Eip1193Provider[];
      selectedProvider?: Eip1193Provider;
    };
  }
}
