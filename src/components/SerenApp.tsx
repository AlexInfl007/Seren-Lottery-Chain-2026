"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  Gift,
  Lock,
  Menu,
  Minus,
  Send,
  Shield,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_LINK, POLYGON_EXPLORER } from "@/config/contract";
import { useWallet } from "@/hooks/useWallet";
import { createWalletPublicClient, readLotteryState, type LotteryState } from "@/lib/contractReads";
import { loadContractHistory, type ActivityEntry, type WinnerEntry } from "@/lib/contractHistory";
import { canLoadContractData } from "@/lib/dataGate";
import { normalizeContractError, type AppError } from "@/lib/contractErrors";
import { executeTicketPurchase } from "@/lib/purchaseFlow";
import { getSessionPrediction } from "@/lib/prediction";

type TxState =
  | { status: "idle" }
  | { status: "simulating" }
  | { status: "awaitingWallet" }
  | { status: "pending"; hash?: `0x${string}` }
  | { status: "success"; hash?: `0x${string}` }
  | { status: "failed"; error: AppError; hash?: `0x${string}` };

const FIXED_TICKET_PRICE = parseEther("30");
const MAX_TICKETS = 10;

const navLinks = [
  ["Home", "#home"],
  ["Buy Tickets", "#buy"],
  ["My Tickets", "#buy"],
  ["History", "#history"],
  ["How It Works", "#how"],
  ["FAQ", "#faq"],
] as const;

const demoPurchases = [
  ["0x8a7f...d3e2", "25", "750 POL", "2m ago"],
  ["0x3c1b...a9f7", "10", "300 POL", "5m ago"],
  ["0x9d4e...b1c8", "5", "150 POL", "7m ago"],
  ["0x6f2a...e7d4", "12", "360 POL", "11m ago"],
  ["0x7b3c...f8a9", "3", "90 POL", "15m ago"],
  ["0x1e9d...c2b7", "8", "240 POL", "18m ago"],
  ["0x4a6f...d9e1", "6", "180 POL", "23m ago"],
] as const;

const demoWinners = [
  ["46", "0x7e48...a2f1", "8,765.32 POL", "Jul 5, 2025"],
  ["45", "0x1c9d...b7a3", "7,654.11 POL", "Jun 28, 2025"],
  ["44", "0x2f6a...d4c8", "6,543.21 POL", "Jun 21, 2025"],
  ["43", "0x9b3e...f1a7", "5,432.10 POL", "Jun 14, 2025"],
  ["42", "0x8d1f...c3b6", "4,321.77 POL", "Jun 7, 2025"],
] as const;

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="#home" className={`brand-logo ${footer ? "footer-brand" : ""}`} aria-label="Seren Lottery home">
      <span>Seren</span>
      <span>
        L
        <Image src="/assets/logo.png" alt="" width={footer ? 27 : 22} height={footer ? 27 : 22} />
        ttery
      </span>
    </Link>
  );
}

function formatPol(value?: bigint, fallback = "12,345.67 POL") {
  if (value === undefined) return fallback;
  return `${Number(formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} POL`;
}

function formatCount(value?: bigint, fallback = "24,578") {
  if (value === undefined) return fallback;
  return Number(value).toLocaleString("en-US");
}

function shortAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatWhen(timestamp?: number) {
  if (!timestamp) return "just now";
  const diff = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(timestamp));
}

function walletErrorText(error?: AppError) {
  if (!error) return "";
  const copy: Record<AppError["key"], string> = {
    walletUnavailable: "No wallet provider is available in this browser.",
    userRejected: "The wallet request was rejected.",
    wrongNetwork: "Switch to Polygon Mainnet to continue.",
    noAccounts: "No wallet accounts were returned.",
    providerFailure: "The wallet provider could not complete the request.",
    configInvalid: "Ticket purchase is temporarily unavailable.",
    readFailed: "Contract data could not be read.",
    simulationFailed: "The transaction check failed.",
    purchaseClosed: "Entries are unavailable while this draw is closed.",
    emergencyActive: "Entry is temporarily unavailable.",
    insufficientFunds: "Your wallet needs enough POL for tickets and gas.",
    transactionRejected: "The transaction was rejected in the wallet.",
    transactionFailed: "The transaction did not complete successfully.",
    historyUnavailable: "History is unavailable through this wallet provider.",
  };
  return copy[error.key];
}

function Stat({
  label,
  value,
  helper,
  accent,
}: {
  label: string;
  value: string;
  helper: string;
  accent?: boolean;
}) {
  return (
    <div className="draw-stat">
      <span>{label}</span>
      <strong className={accent ? "stat-accent" : ""}>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

export default function SerenApp() {
  const wallet = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [lotteryState, setLotteryState] = useState<LotteryState>();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [winners, setWinners] = useState<WinnerEntry[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [txState, setTxState] = useState<TxState>({ status: "idle" });
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [predictionText, setPredictionText] = useState("");

  const dataAllowed = canLoadContractData({
    hasExplicitConnection: wallet.explicitConnection,
    chainId: wallet.chainId,
  });

  const totalPrice = useMemo(() => FIXED_TICKET_PRICE * BigInt(quantity), [quantity]);

  const refreshData = useCallback(
    async (forceHistory = false) => {
      if (!dataAllowed || !wallet.provider || !wallet.account) return;
      try {
        const state = await readLotteryState(wallet.provider, wallet.account);
        setLotteryState(state);
        const history = await loadContractHistory(wallet.provider, forceHistory);
        setActivity(history.activity);
        setWinners(history.winners);
      } catch {
        setActivity([]);
        setWinners([]);
      }
    },
    [dataAllowed, wallet.account, wallet.provider],
  );

  useEffect(() => {
    if (dataAllowed) {
      void refreshData();
    } else {
      setLotteryState(undefined);
      setActivity([]);
      setWinners([]);
    }
  }, [dataAllowed, refreshData]);

  const canBuy =
    dataAllowed &&
    Boolean(lotteryState?.canPurchase) &&
    txState.status !== "simulating" &&
    txState.status !== "awaitingWallet" &&
    txState.status !== "pending";

  const openWallet = () => setWalletOpen((open) => !open);

  const buyTickets = async () => {
    if (!wallet.provider || !wallet.walletClient || !wallet.account || !lotteryState) {
      setWalletOpen(true);
      return;
    }

    setTxState({ status: "simulating" });
    try {
      const client = createWalletPublicClient(wallet.provider);
      let lastHash: `0x${string}` | undefined;

      for (let index = 0; index < quantity; index += 1) {
        const result = await executeTicketPurchase({
          client,
          walletClient: wallet.walletClient,
          account: wallet.account,
          value: FIXED_TICKET_PRICE,
          onProgress: (progress, hash) => {
            if (progress === "simulating") setTxState({ status: "simulating" });
            if (progress === "awaitingWallet") setTxState({ status: "awaitingWallet" });
            if (progress === "pending") setTxState({ status: "pending", hash });
          },
        });
        lastHash = result.hash;
        if (result.receipt.status !== "success") {
          setTxState({ status: "failed", error: { key: "transactionFailed" }, hash: result.hash });
          return;
        }
      }

      setTxState({ status: "success", hash: lastHash });
      await refreshData(true);
    } catch (error) {
      setTxState({ status: "failed", error: normalizeContractError(error) });
    }
  };

  const revealPrediction = () => {
    const predictions = {
      "quiet-door": "A quiet decision may open an unexpected door.",
      "patient-luck": "Patience can be its own kind of luck.",
      "look-twice": "Look twice before choosing the obvious path.",
      "new-connection": "A new connection may bring fresh momentum.",
      "small-steps": "Small steps can lead to memorable outcomes.",
      "trust-process": "Trust your process, not a promise.",
      "curious-chapter": "The next chapter may start with curiosity.",
      "careful-attention": "Today rewards careful attention.",
    };
    setPredictionText(predictions[getSessionPrediction()]);
    setPredictionOpen(true);
  };

  const txHash =
    txState.status === "pending" || txState.status === "success" || txState.status === "failed"
      ? txState.hash
      : undefined;

  const txMessage =
    txState.status === "simulating"
      ? "Checking transaction..."
      : txState.status === "awaitingWallet"
        ? "Waiting for wallet confirmation..."
        : txState.status === "pending"
          ? "Waiting for Polygon confirmation..."
          : txState.status === "success"
            ? "Ticket purchase confirmed."
            : txState.status === "failed"
              ? walletErrorText(txState.error)
              : "";

  const purchaseRows =
    activity.length > 0
      ? activity.slice(0, 7).map((item) => [
          shortAddress(item.buyer),
          "1",
          "30 POL",
          formatWhen(item.timestamp),
        ])
      : demoPurchases;

  const winnerRows =
    winners.length > 0
      ? winners.slice(0, 5).map((item) => [
          formatCount(item.round, "0"),
          shortAddress(item.winner),
          formatPol(item.prize, "Pending"),
          formatWhen(item.timestamp),
        ])
      : demoWinners;

  return (
    <main id="home" className="seren-page">
      <header className="site-header">
        <Brand />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(([label, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={label}>
              {label}
            </Link>
          ))}
          <button type="button" onClick={revealPrediction}>
            Predictions
          </button>
        </nav>

        <div className="header-actions">
          <button type="button" className="outline-button wallet-button" onClick={openWallet}>
            {wallet.account ? shortAddress(wallet.account) : wallet.connecting ? "Connecting..." : "Connect Wallet"}
          </button>
          <button
            type="button"
            className="icon-button menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {walletOpen && (
          <div className="wallet-popover">
            {wallet.account ? (
              <>
                <strong>Wallet connected</strong>
                <p>{wallet.account}</p>
                <button type="button" onClick={wallet.copyAddress}>
                  <Copy size={16} /> {wallet.copied ? "Address copied" : "Copy address"}
                </button>
                {!wallet.isPolygon && (
                  <button type="button" onClick={wallet.switchToPolygon}>
                    <Shield size={16} /> Switch to Polygon
                  </button>
                )}
                <button type="button" onClick={wallet.disconnect}>
                  <X size={16} /> Disconnect
                </button>
              </>
            ) : (
              <>
                <strong>Choose a wallet</strong>
                {wallet.providers.map((provider) => (
                  <button type="button" key={provider.id} onClick={() => wallet.connectWithProvider(provider)}>
                    <Wallet size={16} /> {provider.name}
                  </button>
                ))}
                <button type="button" onClick={wallet.connectWalletConnect}>
                  <Wallet size={16} /> WalletConnect
                </button>
                {wallet.providers.length === 0 && <p>No browser wallet was found.</p>}
              </>
            )}
            {wallet.error && <p className="inline-error">{walletErrorText(wallet.error)}</p>}
          </div>
        )}
      </header>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map(([label, href]) => (
            <Link href={href} key={label} onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <button type="button" onClick={revealPrediction}>
            Predictions
          </button>
        </nav>
      )}

      <section className="hero-banner" aria-label="Seren Lottery">
        <Image src="/assets/Banner.png" alt="Seren Lottery blockchain lottery on Polygon Network" fill priority sizes="100vw" />
      </section>

      <section id="buy" className="content-grid">
        <article className="panel current-draw">
          <div className="panel-title">
            <span className="status-dot" />
            <h2>Current Draw</h2>
          </div>

          <div className="draw-stats">
            <Stat label="Round" value={formatCount(lotteryState?.round, "47")} helper="" accent />
            <Stat label="Prize Pool" value={formatPol(lotteryState?.prizePool)} helper="~ $5,678.90" />
            <Stat label="Total Tickets" value={formatCount(lotteryState?.ticketsCount)} helper="sold" />
            <Stat label="Ticket Price" value="30 POL" helper="per ticket" />
          </div>

          <div className="draw-progress">
            <div>
              <span>Until Next Draw</span>
              <strong>2D 14H 32M 18S</strong>
            </div>
            <div className="progress-track">
              <span />
            </div>
            <div>
              <span>0 Tickets</span>
              <span>50,000 Tickets</span>
            </div>
          </div>

          <div className="guarantee">
            <span className="round-icon">
              <Trophy />
            </span>
            <div>
              <strong>Min 1 winner guaranteed</strong>
              <p>If no one matches all numbers, the prize pool rolls over to the next round.</p>
            </div>
            <Link href="#how" className="outline-button">
              How It Works
            </Link>
          </div>
        </article>

        <aside className="panel wallet-card">
          <div className="panel-title">
            <Wallet size={18} />
            <h2>Your Wallet</h2>
            <span className="green-dot" />
          </div>

          <button type="button" className="outline-button wide" onClick={openWallet}>
            {wallet.account ? shortAddress(wallet.account) : "Connect Wallet"}
          </button>

          <div className="wallet-copy">
            <strong>Buy tickets at 30 POL each</strong>
            <p>Each purchase sends 30 POL per ticket directly to the lottery contract.</p>
          </div>

          <button type="button" className="primary-button wide" onClick={revealPrediction}>
            Predictions
          </button>

          <div className="separator">
            <span />
            <small>OR</small>
            <span />
          </div>

          <div className="buy-control">
            <span>Buy Tickets</span>
            <div className="stepper" aria-label="Ticket quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                <Minus />
              </button>
              <strong>{quantity}</strong>
              <button type="button" onClick={() => setQuantity((value) => Math.min(MAX_TICKETS, value + 1))}>
                <span>+</span>
              </button>
            </div>
          </div>

          <button type="button" className="buy-button wide" disabled={!canBuy} onClick={buyTickets}>
            Buy {quantity} Ticket{quantity > 1 ? "s" : ""} ({formatPol(totalPrice, "30 POL")})
          </button>

          <p className="my-tickets">My Tickets: {formatCount(lotteryState?.userTickets, "-")}</p>
          {!wallet.account && <p className="inline-error">Connect your wallet to buy tickets.</p>}
          {wallet.account && !wallet.isPolygon && <p className="inline-error">Switch to Polygon Mainnet to buy tickets.</p>}
          {wallet.account && wallet.isPolygon && lotteryState && !lotteryState.canPurchase && (
            <p className="inline-error">This draw is not accepting ticket purchases right now.</p>
          )}
          {txMessage && <p className={txState.status === "failed" ? "inline-error" : "tx-message"}>{txMessage}</p>}
          {txHash && (
            <Link className="tx-link" href={`${POLYGON_EXPLORER}/tx/${txHash}`} target="_blank">
              View transaction <ExternalLink size={14} />
            </Link>
          )}
        </aside>
      </section>

      <section id="history" className="tables-grid">
        <article className="panel table-panel">
          <div className="table-title">
            <div>
              <Users size={18} />
              <h2>Recent Purchases</h2>
            </div>
            <Link href={CONTRACT_LINK} target="_blank">
              View All
            </Link>
          </div>
          <div className="purchase-list">
            <div className="table-head">
              <span>Address</span>
              <span>Tickets</span>
              <span>Amount</span>
              <span>Time</span>
            </div>
            {purchaseRows.map(([address, tickets, amount, time]) => (
              <div className="purchase-row" key={`${address}-${time}`}>
                <span className="avatar">SR</span>
                <span>{address}</span>
                <span>{tickets}</span>
                <span>{amount}</span>
                <span>{time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel table-panel">
          <div className="table-title">
            <div>
              <Trophy size={18} />
              <h2>Past Winners</h2>
            </div>
            <Link href={CONTRACT_LINK} target="_blank">
              View All
            </Link>
          </div>
          <div className="winner-list">
            <div className="table-head">
              <span>Round</span>
              <span>Winner</span>
              <span>Prize</span>
              <span>Date</span>
            </div>
            {winnerRows.map(([round, winner, prize, date]) => (
              <div className="winner-row" key={`${round}-${winner}`}>
                <span>{round}</span>
                <span>{winner}</span>
                <span>{prize}</span>
                <span>{date}</span>
              </div>
            ))}
          </div>
          <Link className="outline-button centered" href={CONTRACT_LINK} target="_blank">
            View All Winners
          </Link>
        </article>
      </section>

      <section id="how" className="benefits panel">
        <div>
          <span className="large-icon">
            <Shield />
          </span>
          <strong>Fair & Transparent</strong>
          <p>Our smart contract is transparent and verifiable on-chain.</p>
        </div>
        <div>
          <span className="large-icon">
            <Lock />
          </span>
          <strong>Secure</strong>
          <p>Built on Polygon network for low fees and high security.</p>
        </div>
        <div>
          <span className="large-icon">
            <Zap />
          </span>
          <strong>Instant</strong>
          <p>Instant ticket delivery and prize distribution.</p>
        </div>
        <div>
          <span className="large-icon">
            <Gift />
          </span>
          <strong>Big Prizes</strong>
          <p>The more tickets sold, the bigger the prize pool.</p>
        </div>
      </section>

      <section id="faq" className="faq-strip">
        <details>
          <summary>How much is one ticket?</summary>
          <p>Each lottery ticket costs exactly 30 POL. The interface only supports direct ticket purchases.</p>
        </details>
        <details>
          <summary>What does Predictions do?</summary>
          <p>Predictions reveals a symbolic entertainment message. It does not predict lottery results.</p>
        </details>
      </section>

      <footer className="site-footer">
        <div>
          <Brand footer />
          <p>Blockchain Lottery<br />on Polygon Network</p>
          <div className="socials">
            <span>t</span>
            <Send size={16} />
            <span>d</span>
            <span>ig</span>
          </div>
        </div>
        <div>
          <h3>Quick Links</h3>
          <Link href="#buy">Buy Tickets</Link>
          <Link href="#buy">My Tickets</Link>
          <Link href="#history">History</Link>
          <Link href="#how">How It Works</Link>
          <Link href="#faq">FAQ</Link>
        </div>
        <div>
          <h3>Information</h3>
          <Link href={CONTRACT_LINK} target="_blank">About Us</Link>
          <Link href={CONTRACT_LINK} target="_blank">Terms of Service</Link>
          <Link href={CONTRACT_LINK} target="_blank">Privacy Policy</Link>
          <Link href={CONTRACT_LINK} target="_blank">Smart Contract</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="mailto:support@serenlottery.com">support@serenlottery.com</a>
          <Link className="outline-button community" href={CONTRACT_LINK} target="_blank">
            Join Our Community
          </Link>
        </div>
        <small>© 2026 Seren Lottery. All rights reserved.</small>
      </footer>

      {predictionOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="prediction-title">
          <div className="modal">
            <button type="button" className="icon-button modal-close" onClick={() => setPredictionOpen(false)} aria-label="Close">
              <X />
            </button>
            <Sparkles size={32} />
            <h2 id="prediction-title">Predictions</h2>
            <p>{predictionText}</p>
            <small>For entertainment only. Not a prediction of lottery results.</small>
          </div>
        </div>
      )}
    </main>
  );
}
