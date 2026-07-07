declare module "@walletconnect/ethereum-provider" {
  const EthereumProvider: {
    init(options: Record<string, unknown>): Promise<unknown>;
  };
  export default EthereumProvider;
}
