"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Lock,
  Menu,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wallet,
  X,
} from "lucide-react";
import { createWalletPublicClient, readLotteryState, type LotteryState } from "@/lib/contractReads";
import { loadContractHistory, type ActivityEntry, type WinnerEntry } from "@/lib/contractHistory";
import { canLoadContractData } from "@/lib/dataGate";
import { formatCount, formatPol, shortenAddress, shortenHash } from "@/lib/format";
import { normalizeContractError, type AppError } from "@/lib/contractErrors";
import { validatePurchaseMethod } from "@/lib/contractAdapter";
import { executeTicketPurchase } from "@/lib/purchaseFlow";
import { CONTRACT_ADDRESS, CONTRACT_LINK, POLYGON_EXPLORER } from "@/config/contract";
import { useLanguage } from "@/hooks/useLanguage";
import { useWallet } from "@/hooks/useWallet";
import { getSessionPrediction, hasSessionPrediction } from "@/lib/prediction";
import type { PredictionId } from "@/i18n/translations";

type TxState =
  | { status: "idle" }
  | { status: "simulating" }
  | { status: "awaitingWallet" }
  | { status: "pending"; hash: `0x${string}` }
  | { status: "success"; hash: `0x${string}` }
  | { status: "failed"; error: AppError; hash?: `0x${string}` };

const navLinks = [
  ["draw", "#draw"],
  ["activity", "#activity"],
  ["winners", "#winners"],
  ["how", "#how"],
  ["fairness", "#fairness"],
] as const;

function StatusPill({ state, t }: { state?: LotteryState; t: ReturnType<typeof useLanguage>["t"] }) {
  if (!state) {
    return (
      <span className="status-pill status-muted">
        <Lock size={14} /> {t.dashboard.locked}
      </span>
    );
  }
  if (state.emergencyActive) {
    return (
      <span className="status-pill status-warning">
        <AlertTriangle size={14} /> {t.dashboard.emergency}
      </span>
    );
  }
  return (
    <span className={`status-pill ${state.open ? "status-good" : "status-warning"}`}>
      {state.open ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
      {state.open ? t.dashboard.open : t.dashboard.closed}
    </span>
  );
}

function MetricCard({
  label,
  value,
  locked,
  accent,
}: {
  label: string;
  value?: string;
  locked: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`metric ${accent ? "metric-accent" : ""}`}>
      <span>{label}</span>
      {locked ? (
        <strong className="locked-value">
          <Lock size={16} /> —
        </strong>
      ) : (
        <strong>{value || "—"}</strong>
      )}
    </div>
  );
}

function formatDate(timestamp?: number) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function SerenApp() {
  const { language, setLanguage, t } = useLanguage();
  const wallet = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [lotteryState, setLotteryState] = useState<LotteryState>();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [winners, setWinners] = useState<WinnerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);
  const [readError, setReadError] = useState<AppError>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txState, setTxState] = useState<TxState>({ status: "idle" });
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [predictionId, setPredictionId] = useState<PredictionId | undefined>();

  const dataAllowed = canLoadContractData({
    hasExplicitConnection: wallet.explicitConnection,
    chainId: wallet.chainId,
  });

  const purchaseValidation = useMemo(() => validatePurchaseMethod(), []);
  const refreshData = useCallback(
    async (forceHistory = false) => {
      if (!dataAllowed || !wallet.provider || !wallet.account) return;
      setLoading(true);
      setReadError(undefined);
      setHistoryError(false);
      try {
        const state = await readLotteryState(wallet.provider, wallet.account);
        setLotteryState(state);
        try {
          const history = await loadContractHistory(wallet.provider, forceHistory);
          setActivity(history.activity);
          setWinners(history.winners);
        } catch {
          setActivity([]);
          setWinners([]);
          setHistoryError(true);
        }
      } catch (error) {
        setReadError(normalizeContractError(error));
      } finally {
        setLoading(false);
      }
    },
    [dataAllowed, wallet.provider, wallet.account],
  );

  useEffect(() => {
    if (dataAllowed && !lotteryState && !loading) {
      void refreshData();
    }
    if (!dataAllowed) {
      setLotteryState(undefined);
      setActivity([]);
      setWinners([]);
      setReadError(undefined);
      setHistoryError(false);
    }
  }, [dataAllowed, lotteryState, loading, refreshData]);

  useEffect(() => {
    if (hasSessionPrediction()) {
      setPredictionId(getSessionPrediction());
    }
  }, []);

  const purchaseDisabled =
    !dataAllowed ||
    !lotteryState?.canPurchase ||
    txState.status === "simulating" ||
    txState.status === "awaitingWallet" ||
    txState.status === "pending";

  const purchaseMessage = lotteryState?.purchaseUnavailableReason
    ? {
        config_invalid: t.purchase.unavailableConfig,
        closed: t.purchase.closed,
        emergency: t.purchase.emergency,
        price_mismatch: t.purchase.priceMismatch,
      }[lotteryState.purchaseUnavailableReason]
    : undefined;

  const runPurchase = async () => {
    if (!wallet.provider || !wallet.walletClient || !wallet.account || !lotteryState) return;
    setTxState({ status: "simulating" });
    try {
      const client = createWalletPublicClient(wallet.provider);
      const result = await executeTicketPurchase({
        client,
        walletClient: wallet.walletClient,
        account: wallet.account,
        value: lotteryState.ticketPrice,
        onProgress: (progress, hash) => {
          if (progress === "simulating") setTxState({ status: "simulating" });
          if (progress === "awaitingWallet") setTxState({ status: "awaitingWallet" });
          if (progress === "pending" && hash) setTxState({ status: "pending", hash });
        },
      });
      if (result.receipt.status !== "success") {
        setTxState({ status: "failed", error: { key: "transactionFailed" }, hash: result.hash });
        return;
      }
      setTxState({ status: "success", hash: result.hash });
      setConfirmOpen(false);
      await refreshData(true);
    } catch (error) {
      setTxState({ status: "failed", error: normalizeContractError(error) });
    }
  };

  const revealPrediction = () => {
    const selected = getSessionPrediction();
    setPredictionId(selected);
    setPredictionOpen(true);
  };

  const walletError = wallet.error ? t.errors[wallet.error.key] : undefined;
  const readErrorMessage = readError ? t.errors[readError.key] : undefined;
  const txErrorMessage = txState.status === "failed" ? t.errors[txState.error.key] : undefined;
  const txHash =
    txState.status === "pending" || txState.status === "success" || txState.status === "failed"
      ? txState.hash
      : undefined;

  return (
    <main>
      <header className="site-header">
        <Link href="#" className="brand" aria-label="Seren Lottery Chain home">
          <Image src="/assets/logo.png" alt="" width={40} height={40} priority />
          <span>Seren Lottery Chain</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(([key, href]) => (
            <Link key={key} href={href}>
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <label className="language-select">
            <span className="sr-only">{t.langName}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as "en" | "ru")}>
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select>
            <ChevronDown size={14} aria-hidden />
          </label>

          <div className="wallet-area">
            {wallet.account ? (
              <button className="wallet-button connected" onClick={() => setWalletOpen((open) => !open)}>
                <Wallet size={18} />
                {shortenAddress(wallet.account)}
              </button>
            ) : (
              <button className="wallet-button" onClick={() => setWalletOpen((open) => !open)}>
                <Wallet size={18} />
                {wallet.connecting ? t.wallet.connecting : t.wallet.connect}
              </button>
            )}
            {walletOpen && (
              <div className="wallet-popover">
                {wallet.account ? (
                  <>
                    <div className="wallet-address">{wallet.account}</div>
                    <button onClick={wallet.copyAddress}>
                      <Copy size={16} /> {wallet.copied ? t.wallet.copied : t.wallet.copy}
                    </button>
                    {!wallet.isPolygon && (
                      <button onClick={wallet.switchToPolygon}>
                        <ShieldCheck size={16} /> {t.wallet.switch}
                      </button>
                    )}
                    <button onClick={wallet.disconnect}>
                      <X size={16} /> {t.wallet.disconnect}
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{t.wallet.selectProvider}</strong>
                    {wallet.providers.length > 0 ? (
                      wallet.providers.map((provider) => (
                        <button key={provider.id} onClick={() => wallet.connectWithProvider(provider)}>
                          <Wallet size={16} /> {provider.name}
                        </button>
                      ))
                    ) : (
                      <p>{t.wallet.unavailable}</p>
                    )}
                    <button onClick={wallet.connectWalletConnect}>
                      <Wallet size={16} /> {t.wallet.walletConnect}
                    </button>
                  </>
                )}
                {walletError && <p className="inline-error">{walletError}</p>}
              </div>
            )}
          </div>

          <button className="menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? t.nav.close : t.nav.menu}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map(([key, href]) => (
            <Link key={key} href={href} onClick={() => setMobileOpen(false)}>
              {t.nav[key]}
            </Link>
          ))}
        </nav>
      )}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.heading}</h1>
          <p>{t.hero.body}</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => (wallet.account ? setConfirmOpen(true) : setWalletOpen(true))}>
              <Wallet size={18} /> {wallet.account ? t.purchase.buy : t.wallet.connect}
            </button>
            <Link className="secondary-action" href={CONTRACT_LINK} target="_blank">
              <ExternalLink size={18} /> {t.hero.contract}
            </Link>
            <button className="ghost-action" onClick={revealPrediction} disabled={Boolean(predictionId)}>
              <Sparkles size={18} /> {predictionId ? t.hero.luckyDone : t.hero.lucky}
            </button>
          </div>
        </div>
        <div className="hero-art">
          <Image src="/assets/Banner.jpg" alt="Seren luminous polygonal lottery artwork" width={1024} height={1024} priority />
          <div className="contract-chip">
            <ShieldCheck size={16} />
            {shortenAddress(CONTRACT_ADDRESS)}
          </div>
        </div>
      </section>

      <section id="draw" className="draw-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.dashboard.readable}</p>
            <h2>{t.dashboard.title}</h2>
            <p>{dataAllowed ? t.dashboard.subtitleConnected : wallet.account ? t.wallet.connectedLocked : t.dashboard.subtitleLocked}</p>
          </div>
          {dataAllowed && (
            <button className="refresh-button" onClick={() => refreshData(true)} disabled={loading}>
              <RefreshCcw size={17} className={loading ? "spin" : ""} />
              {loading ? t.dashboard.refreshing : t.dashboard.refresh}
            </button>
          )}
        </div>

        {wallet.account && !wallet.isPolygon && (
          <div className="network-warning">
            <AlertTriangle size={18} />
            <span>{t.wallet.wrongNetwork}</span>
            <button onClick={wallet.switchToPolygon}>{t.wallet.switch}</button>
          </div>
        )}

        {readErrorMessage && <div className="network-warning error"><AlertTriangle size={18} /> {readErrorMessage}</div>}

        <div className="draw-grid">
          <div className="dashboard-panel">
            <div className="metrics-grid">
              <MetricCard label={t.dashboard.prizePool} value={formatPol(lotteryState?.prizePool)} locked={!dataAllowed || !lotteryState} accent />
              <MetricCard label={t.dashboard.currentRound} value={formatCount(lotteryState?.round)} locked={!dataAllowed || !lotteryState} />
              <MetricCard label={t.dashboard.ticketsInDraw} value={formatCount(lotteryState?.ticketsCount)} locked={!dataAllowed || !lotteryState} />
              <MetricCard label={t.dashboard.yourTickets} value={formatCount(lotteryState?.userTickets)} locked={!dataAllowed || !lotteryState} />
              <MetricCard label={t.dashboard.ticketPrice} value={formatPol(lotteryState?.ticketPrice)} locked={!dataAllowed || !lotteryState} />
              <div className="metric">
                <span>{t.dashboard.drawStatus}</span>
                <StatusPill state={dataAllowed ? lotteryState : undefined} t={t} />
              </div>
            </div>
            {lotteryState?.maxTicketsPerRound && (
              <p className="limit-note">{t.dashboard.maxPerRound}: {formatCount(lotteryState.maxTicketsPerRound)}</p>
            )}
            {lotteryState?.maxTicketsPerAddress && (
              <p className="limit-note">{t.dashboard.maxPerAddress}: {formatCount(lotteryState.maxTicketsPerAddress)}</p>
            )}
          </div>

          <aside className="purchase-panel">
            <div>
              <Ticket size={30} />
              <h2>{t.purchase.title}</h2>
              <p>{t.purchase.oneTicket}</p>
              <p>{t.purchase.gas}</p>
            </div>
            <div className="purchase-facts">
              <span>{t.purchase.userTickets}</span>
              <strong>{formatCount(lotteryState?.userTickets)}</strong>
              <span>{t.purchase.contractState}</span>
              <StatusPill state={dataAllowed ? lotteryState : undefined} t={t} />
            </div>
            {purchaseMessage && <p className="inline-error">{purchaseMessage}</p>}
            {!purchaseValidation.ok && <p className="inline-error">{t.purchase.unavailableConfig}</p>}
            <button className="buy-button" disabled={purchaseDisabled} onClick={() => setConfirmOpen(true)}>
              {lotteryState?.ticketPrice
                ? t.purchase.buyWithPrice.replace("{price}", formatPol(lotteryState.ticketPrice))
                : t.purchase.buy}
            </button>
            {txState.status !== "idle" && (
              <div className="tx-status">
                {txState.status === "simulating" && t.purchase.simulating}
                {txState.status === "awaitingWallet" && t.purchase.awaitingWallet}
                {txState.status === "pending" && t.purchase.pending}
                {txState.status === "success" && t.purchase.success}
                {txErrorMessage}
                {txHash && (
                  <Link href={`${POLYGON_EXPLORER}/tx/${txHash}`} target="_blank">
                    {t.purchase.viewTx} <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>

      <section id="activity" className="data-section">
        <div className="section-heading">
          <div>
            <h2>{t.activity.title}</h2>
            <p>{dataAllowed ? t.activity.subtitle : t.activity.locked}</p>
          </div>
        </div>
        <div className="data-list">
          {historyError && <div className="empty-state">{t.activity.unavailable}</div>}
          {!historyError && dataAllowed && activity.length === 0 && <div className="empty-state">{t.activity.empty}</div>}
          {!dataAllowed && <div className="empty-state locked"><Lock size={18} /> {t.activity.locked}</div>}
          {activity.map((item) => (
            <Link className="event-row" href={item.explorerUrl} target="_blank" key={item.id}>
              <span>{shortenAddress(item.buyer)}</span>
              <span>{t.activity.round} {formatCount(item.round)}</span>
              <span>{item.price ? formatPol(item.price) : "—"}</span>
              <span>{formatDate(item.timestamp) || shortenHash(item.transactionHash)}</span>
              <ExternalLink size={15} />
            </Link>
          ))}
        </div>
      </section>

      <section id="winners" className="data-section">
        <div className="section-heading">
          <div>
            <h2>{t.winners.title}</h2>
            <p>{dataAllowed ? t.winners.subtitle : t.winners.locked}</p>
          </div>
        </div>
        <div className="winner-grid">
          {dataAllowed && winners.length === 0 && <div className="empty-state">{t.winners.empty}</div>}
          {!dataAllowed && <div className="empty-state locked"><Lock size={18} /> {t.winners.locked}</div>}
          {winners.map((winner) => (
            <Link className="winner-card" href={winner.explorerUrl} target="_blank" key={winner.id}>
              <span>{t.winners.winner}</span>
              <strong>{shortenAddress(winner.winner)}</strong>
              <small>{t.winners.round} {formatCount(winner.round)} · {winner.prize ? formatPol(winner.prize) : "—"}</small>
              <small>{formatDate(winner.timestamp) || shortenHash(winner.transactionHash)}</small>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="info-band">
        <h2>{t.sections.howTitle}</h2>
        <div className="steps">
          {t.sections.howSteps.map((step, index) => (
            <div className="step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fairness" className="fairness-section">
        <h2>{t.sections.fairnessTitle}</h2>
        <div className="fairness-grid">
          {t.sections.fairnessItems.map((item) => (
            <div className="fairness-item" key={item}>
              <ShieldCheck size={18} />
              <p>{item}</p>
            </div>
          ))}
        </div>
        <Link className="secondary-action" href={CONTRACT_LINK} target="_blank">
          <ExternalLink size={18} /> {t.hero.contract}
        </Link>
      </section>

      <section className="risk-band">
        <AlertTriangle size={20} />
        <div>
          <strong>{t.sections.riskTitle}</strong>
          <p>{t.sections.risk}</p>
        </div>
      </section>

      <section className="faq-section">
        <h2>{t.sections.faqTitle}</h2>
        <div className="faq-grid">
          {t.sections.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer>
        <div className="brand">
          <Image src="/assets/logo.png" alt="" width={36} height={36} />
          <span>Seren Lottery Chain</span>
        </div>
        <span>{t.footer.polygon}</span>
        <Link href={CONTRACT_LINK} target="_blank">{t.footer.contract}</Link>
        <small>{t.sections.risk}</small>
        <small>{t.footer.copyright}</small>
      </footer>

      {confirmOpen && lotteryState && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
          <div className="modal">
            <button className="modal-close" onClick={() => setConfirmOpen(false)} aria-label={t.purchase.cancel}>
              <X size={20} />
            </button>
            <h2 id="purchase-title">{t.purchase.confirmTitle}</h2>
            <p>{t.purchase.confirmBody}</p>
            <dl>
              <div><dt>{t.purchase.contract}</dt><dd>{shortenAddress(CONTRACT_ADDRESS)}</dd></div>
              <div><dt>{t.purchase.price}</dt><dd>{formatPol(lotteryState.ticketPrice)}</dd></div>
            </dl>
            <p className="risk-inline">{t.purchase.gas} {t.purchase.risk}</p>
            <div className="modal-actions">
              <button className="secondary-action" onClick={() => setConfirmOpen(false)}>{t.purchase.cancel}</button>
              <button className="primary-action" onClick={runPurchase} disabled={purchaseDisabled}>
                {txState.status === "simulating" ? t.purchase.simulating : t.purchase.continue}
              </button>
            </div>
          </div>
        </div>
      )}

      {predictionOpen && predictionId && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="prediction-title">
          <div className="modal lucky-modal">
            <button className="modal-close" onClick={() => setPredictionOpen(false)} aria-label={t.lucky.close}>
              <X size={20} />
            </button>
            <Sparkles size={28} />
            <h2 id="prediction-title">{t.lucky.title}</h2>
            <p className="prediction-text">{t.lucky.predictions[predictionId]}</p>
            <span>{t.lucky.label}</span>
          </div>
        </div>
      )}

      {dataAllowed && lotteryState?.canPurchase && (
        <div className="mobile-buy-bar">
          <button disabled={purchaseDisabled} onClick={() => setConfirmOpen(true)}>
            {t.purchase.buyWithPrice.replace("{price}", formatPol(lotteryState.ticketPrice))}
          </button>
        </div>
      )}
    </main>
  );
}
