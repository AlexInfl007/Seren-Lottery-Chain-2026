# Seren Lottery Chain

Production-oriented frontend for the Seren Lottery Chain Polygon lottery contract.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Open the local URL shown by Next.js.

## Build And Checks

```bash
npm run typecheck
npm run test
npm run build
```

## Environment Variables

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is optional. If it is omitted, injected browser wallets still work and WalletConnect is not enabled.

## Contract Adapter

The contract boundary is centralized in `src/config/contract.ts` and `src/lib/contractAdapter.ts`.

It defines:

- Polygon Mainnet chain ID `137`;
- contract address `0xf90169AD413429af4AE0a3B8962648d4a3289011`;
- deployment block `76819613`;
- the minimal ABI used by the app;
- the verified public purchase function `buyTicket()`;
- ticket and winner event definitions;
- adaptive history scanning settings.

Live lottery reads are performed only after the user explicitly connects a wallet and the wallet is on Polygon Mainnet. Reads use the connected EIP-1193 wallet provider. The app does not perform server-side reads, explorer API reads, background polling, or fake data rendering.

## Purchase Method Verification

Before purchases are enabled, the app validates that `buyTicket()` exists in the adapter ABI, is payable, and takes no arguments. It then reads the live ticket price and simulates the exact payable call with that value. The wallet transaction is only submitted after successful simulation.

The app does not call `enterRaffle()`, fallback handlers, `receive()`, or plain native-token transfers for ticket purchases.

## History

Recent activity and winners are loaded from contract event logs through the connected wallet provider. The scanner starts from deployment block `76819613`, uses bounded ranges, reduces range size when providers reject large requests, and stores session-only history cache in `sessionStorage`.

Some wallet RPC providers restrict `eth_getLogs`. In that case, the UI shows a clear unavailable state and links users to PolygonScan.
