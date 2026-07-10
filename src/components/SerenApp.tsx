"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  Lock,
  Menu,
  RefreshCcw,
  Send,
  Shield,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { Hash } from "viem";
import {
  CONTRACT_ADDRESS,
  CONTRACT_LINK,
  POLYGON_EXPLORER,
} from "@/config/contract";
import { useLanguage } from "@/hooks/useLanguage";
import { useWallet } from "@/hooks/useWallet";
import { createWalletPublicClient, readLotteryState, simulateTicketPurchase, type LotteryState } from "@/lib/contractReads";
import { loadContractHistory, type ActivityEntry, type WinnerEntry } from "@/lib/contractHistory";
import { canLoadContractData } from "@/lib/dataGate";
import { normalizeContractError, type AppError } from "@/lib/contractErrors";
import { executeTicketPurchase } from "@/lib/purchaseFlow";
import { getSessionPrediction } from "@/lib/prediction";
import { formatCount, formatPol, formatTimestamp, shortenAddress, shortenHash } from "@/lib/format";
import { languageLabels, languages, type Language } from "@/i18n/translations";

type TxState =
  | { status: "idle" }
  | { status: "simulating" }
  | { status: "awaitingWallet" }
  | { status: "pending"; hash?: Hash }
  | { status: "success"; hash?: Hash }
  | { status: "failed"; error: AppError; hash?: Hash };

type SimulationState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ready" }
  | { status: "failed"; error: AppError }
  | { status: "insufficientFunds" };

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="#home" className={`brand-logo ${footer ? "footer-brand" : ""}`} aria-label="Seren Lottery Chain">
      <Image src="/assets/logo.png" alt="" width={footer ? 34 : 30} height={footer ? 34 : 30} />
      <span>Seren</span>
      <span>Lottery Chain</span>
    </Link>
  );
}

function Stat({
  label,
  value,
  helper,
  locked,
  accent,
}: {
  label: string;
  value: string;
  helper?: string;
  locked?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`draw-stat ${locked ? "is-locked" : ""}`}>
      <span>{label}</span>
      <strong className={accent ? "stat-accent" : ""}>{locked ? "—" : value}</strong>
      {helper && <small>{helper}</small>}
    </div>
  );
}

function walletConnectConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);
}

export default function SerenApp() {
  const wallet = useWallet();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [lotteryState, setLotteryState] = useState<LotteryState>();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [winners, setWinners] = useState<WinnerEntry[]>([]);
  const [historyError, setHistoryError] = useState(false);
  const [readError, setReadError] = useState<AppError>();
  const [refreshing, setRefreshing] = useState(false);
  const [simulation, setSimulation] = useState<SimulationState>({ status: "idle" });
  const [txState, setTxState] = useState<TxState>({ status: "idle" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [predictionText, setPredictionText] = useState("");

  const dataAllowed = canLoadContractData({
    hasExplicitConnection: wallet.explicitConnection,
    chainId: wallet.chainId,
  });

  const navLinks = useMemo(
    () =>
      [
        [t.nav.home, "#home"],
        [t.nav.buy, "#buy"],
        [t.nav.activity, "#history"],
        [t.nav.how, "#how"],
        [t.nav.faq, "#faq"],
      ] as const,
    [t],
  );

  const refreshData = useCallback(
    async (forceHistory = false) => {
      if (!dataAllowed || !wallet.provider || !wallet.account) return;
      setRefreshing(true);
      setReadError(undefined);
      setHistoryError(false);
      setSimulation({ status: "checking" });

      try {
        const state = await readLotteryState(wallet.provider, wallet.account);
        setLotteryState(state);

        const client = createWalletPublicClient(wallet.provider);
        const balance = await client.getBalance({ address: wallet.account });
        if (balance <= state.ticketPrice) {
          setSimulation({ status: "insufficientFunds" });
        } else if (!state.canPurchase) {
          setSimulation({ status: "idle" });
        } else {
          try {
            await simulateTicketPurchase({
              client,
              walletClient: wallet.walletClient!,
              account: wallet.account,
              value: state.ticketPrice,
            });
            setSimulation({ status: "ready" });
          } catch (error) {
            setSimulation({ status: "failed", error: normalizeContractError(error) });
          }
        }

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
        setLotteryState(undefined);
        setActivity([]);
        setWinners([]);
        setReadError({ key: "readFailed", technical: error instanceof Error ? error.message : "" });
        setSimulation({ status: "idle" });
      } finally {
        setRefreshing(false);
      }
    },
    [dataAllowed, wallet.account, wallet.provider, wallet.walletClient],
  );

  useEffect(() => {
    if (dataAllowed) {
      void refreshData();
    } else {
      setLotteryState(undefined);
      setActivity([]);
      setWinners([]);
      setHistoryError(false);
      setReadError(undefined);
      setSimulation({ status: "idle" });
    }
  }, [dataAllowed, refreshData]);

  const txHash =
    txState.status === "pending" || txState.status === "success" || txState.status === "failed"
      ? txState.hash
      : undefined;

  const txMessage =
    txState.status === "simulating"
      ? t.purchase.simulating
      : txState.status === "awaitingWallet"
        ? t.purchase.awaitingWallet
        : txState.status === "pending"
          ? t.purchase.pending
          : txState.status === "success"
            ? t.purchase.success
            : txState.status === "failed"
              ? t.errors[txState.error.key]
              : "";

  const purchaseDisabled =
    !dataAllowed ||
    !lotteryState ||
    !lotteryState.canPurchase ||
    simulation.status !== "ready" ||
    txState.status === "simulating" ||
    txState.status === "awaitingWallet" ||
    txState.status === "pending";

  const purchaseReason = !wallet.account
    ? t.purchase.connectFirst
    : !wallet.isPolygon
      ? t.purchase.wrongNetwork
      : readError
        ? t.errors[readError.key]
        : !lotteryState
          ? t.purchase.readFirst
          : lotteryState.priceMismatch
            ? t.purchase.priceMismatch
            : lotteryState.purchaseUnavailableReason === "closed"
              ? t.purchase.closed
              : lotteryState.purchaseUnavailableReason === "emergency"
                ? t.purchase.emergency
                : lotteryState.purchaseUnavailableReason === "config_invalid"
                  ? t.purchase.unavailableConfig
                  : simulation.status === "insufficientFunds"
                    ? t.purchase.insufficientFunds
                    : simulation.status === "failed"
                      ? t.errors[simulation.error.key]
                      : simulation.status === "checking"
                        ? t.purchase.simulating
                        : simulation.status === "ready"
                          ? t.purchase.ready
                          : "";

  const openWallet = () => setWalletOpen((open) => !open);

  const revealPrediction = () => {
    const id = getSessionPrediction();
    setPredictionText(t.lucky.predictions[id]);
    setPredictionOpen(true);
  };

  const buyTicket = async () => {
    if (!wallet.provider || !wallet.walletClient || !wallet.account || !lotteryState) {
      setWalletOpen(true);
      return;
    }

    setConfirmOpen(false);
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
          if (progress === "pending") setTxState({ status: "pending", hash });
        },
      });

      if (result.receipt.status !== "success") {
        setTxState({ status: "failed", error: { key: "transactionFailed" }, hash: result.hash });
        return;
      }

      setTxState({ status: "success", hash: result.hash });
      await refreshData(true);
    } catch (error) {
      setTxState({ status: "failed", error: normalizeContractError(error) });
    }
  };

  const locked = !dataAllowed;
  const ticketPrice = lotteryState?.ticketPrice;
  const buyLabel = ticketPrice
    ? t.purchase.buyWithPrice.replace("{price}", formatPol(ticketPrice))
    : t.purchase.buy;

  return (
    <main id="home" className="seren-page">
      <header className="site-header">
        <Brand />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(([label, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={href}>
              {label}
            </Link>
          ))}
          <button type="button" onClick={revealPrediction}>
            {t.hero.lucky}
          </button>
        </nav>

        <div className="header-actions">
          <select
            className="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            aria-label="Language"
          >
            {languages.map((item) => (
              <option value={item} key={item}>
                {languageLabels[item]}
              </option>
            ))}
          </select>
          <button type="button" className="outline-button wallet-button" onClick={openWallet}>
            {wallet.account ? shortenAddress(wallet.account) : wallet.connecting ? t.wallet.connecting : t.wallet.connect}
          </button>
          <button
            type="button"
            className="icon-button menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? t.wallet.close : t.wallet.menu}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {walletOpen && (
          <div className="wallet-popover">
            {wallet.account ? (
              <>
                <strong>{t.wallet.connected}</strong>
                <p>{wallet.account}</p>
                <button type="button" onClick={wallet.copyAddress}>
                  <Copy size={16} /> {wallet.copied ? t.wallet.copied : t.wallet.copy}
                </button>
                {!wallet.isPolygon && (
                  <button type="button" onClick={wallet.switchToPolygon}>
                    <Shield size={16} /> {t.wallet.switch}
                  </button>
                )}
                <button type="button" onClick={wallet.disconnect}>
                  <X size={16} /> {t.wallet.disconnect}
                </button>
              </>
            ) : (
              <>
                <strong>{t.wallet.selectProvider}</strong>
                {wallet.providers.map((provider) => (
                  <button type="button" key={provider.id} onClick={() => wallet.connectWithProvider(provider)}>
                    <Wallet size={16} /> {provider.name || t.wallet.browserWallet}
                  </button>
                ))}
                {walletConnectConfigured() && (
                  <button type="button" onClick={wallet.connectWalletConnect}>
                    <Wallet size={16} /> {t.wallet.walletConnect}
                  </button>
                )}
                {!walletConnectConfigured() && <p>{t.wallet.walletConnectUnavailable}</p>}
                {wallet.providers.length === 0 && <p>{t.wallet.unavailable}</p>}
              </>
            )}
            {wallet.error && <p className="inline-error">{t.errors[wallet.error.key]}</p>}
          </div>
        )}
      </header>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map(([label, href]) => (
            <Link href={href} key={href} onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <button type="button" onClick={revealPrediction}>
            {t.hero.lucky}
          </button>
        </nav>
      )}

      <section className="hero-banner" aria-label="Seren Lottery Chain">
        <Image src="/assets/Banner.png" alt="Seren Lottery Chain on Polygon" fill priority sizes="100vw" />
        <div className="hero-copy">
          <span>{t.hero.eyebrow}</span>
          <h1>{t.hero.heading}</h1>
          <p>{t.hero.body}</p>
          <div>
            <button type="button" className="primary-button" onClick={openWallet}>
              <Wallet size={18} /> {wallet.account ? shortenAddress(wallet.account) : t.wallet.connect}
            </button>
            <Link className="outline-button" href={CONTRACT_LINK} target="_blank">
              {t.hero.contract} <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section id="buy" className="content-grid">
        <article className="panel current-draw">
          <div className="panel-title">
            <span className={`status-dot ${dataAllowed ? "is-live" : ""}`} />
            <div>
              <h2>{t.dashboard.title}</h2>
              <p>{dataAllowed ? t.dashboard.subtitleConnected : t.dashboard.subtitleLocked}</p>
            </div>
            {dataAllowed && (
              <button type="button" className="icon-button refresh-button" onClick={() => refreshData(true)} disabled={refreshing} aria-label={t.dashboard.refresh}>
                <RefreshCcw />
              </button>
            )}
          </div>

          <div className="draw-stats">
            <Stat label={t.dashboard.currentRound} value={formatCount(lotteryState?.round)} locked={locked} accent />
            <Stat label={t.dashboard.prizePool} value={formatPol(lotteryState?.prizePool)} locked={locked} />
            <Stat label={t.dashboard.ticketsInDraw} value={formatCount(lotteryState?.ticketsCount)} locked={locked} />
            <Stat label={t.dashboard.yourTickets} value={formatCount(lotteryState?.userTickets)} locked={locked} />
            <Stat label={t.dashboard.ticketPrice} value={formatPol(lotteryState?.ticketPrice)} locked={locked} />
            <Stat label={t.dashboard.drawStatus} value={lotteryState?.open ? t.dashboard.open : t.dashboard.closed} locked={locked} />
            <Stat label={t.dashboard.emergency} value={lotteryState?.emergencyActive ? t.dashboard.emergency : t.dashboard.normal} locked={locked} />
            {lotteryState?.maxTicketsPerRound && <Stat label={t.dashboard.maxPerRound} value={formatCount(lotteryState.maxTicketsPerRound)} />}
            {lotteryState?.maxTicketsPerAddress && <Stat label={t.dashboard.maxPerAddress} value={formatCount(lotteryState.maxTicketsPerAddress)} />}
          </div>

          {locked && (
            <div className="locked-state">
              <Lock size={18} />
              <span>{wallet.account && !wallet.isPolygon ? t.wallet.wrongNetwork : t.dashboard.subtitleLocked}</span>
            </div>
          )}
          {readError && <p className="inline-error">{t.errors[readError.key]}</p>}
        </article>

        <aside className="panel wallet-card">
          <div className="panel-title">
            <Ticket size={18} />
            <div>
              <h2>{t.purchase.title}</h2>
              <p>{t.purchase.oneTicket}</p>
            </div>
          </div>

          <button type="button" className="outline-button wide" onClick={openWallet}>
            {wallet.account ? shortenAddress(wallet.account) : t.wallet.connect}
          </button>

          {wallet.account && !wallet.isPolygon && (
            <button type="button" className="primary-button wide" onClick={wallet.switchToPolygon}>
              <Shield size={16} /> {t.wallet.switch}
            </button>
          )}

          <div className="wallet-copy">
            <strong>{ticketPrice ? formatPol(ticketPrice) : t.misc.unavailableDash}</strong>
            <p>{t.purchase.gas}</p>
          </div>

          <button type="button" className="buy-button wide" disabled={purchaseDisabled} onClick={() => setConfirmOpen(true)}>
            {buyLabel}
          </button>

          <p className="my-tickets">{t.purchase.userTickets}: {formatCount(lotteryState?.userTickets)}</p>
          {purchaseReason && <p className={simulation.status === "ready" ? "tx-message" : "inline-error"}>{purchaseReason}</p>}
          {txMessage && <p className={txState.status === "failed" ? "inline-error" : "tx-message"}>{txMessage}</p>}
          {txHash && (
            <Link className="tx-link" href={`${POLYGON_EXPLORER}/tx/${txHash}`} target="_blank">
              {t.purchase.viewTx}: {shortenHash(txHash)} <ExternalLink size={14} />
            </Link>
          )}
        </aside>
      </section>

      <section id="history" className="tables-grid">
        <article className="panel table-panel">
          <div className="table-title">
            <div>
              <Users size={18} />
              <h2>{t.activity.title}</h2>
            </div>
            <Link href={CONTRACT_LINK} target="_blank">{t.misc.explorer}</Link>
          </div>
          <p className="table-subtitle">{t.activity.subtitle}</p>
          <div className="purchase-list">
            <div className="table-head">
              <span>{t.activity.buyer}</span>
              <span>{t.activity.round}</span>
              <span>{t.activity.price}</span>
              <span>{t.activity.time}</span>
              <span>{t.activity.tx}</span>
            </div>
            {!dataAllowed && <p className="empty-state">{t.activity.locked}</p>}
            {dataAllowed && historyError && <p className="empty-state">{t.activity.unavailable}</p>}
            {dataAllowed && !historyError && activity.length === 0 && <p className="empty-state">{t.activity.empty}</p>}
            {dataAllowed && !historyError && activity.map((item) => (
              <Link className="purchase-row" key={item.id} href={item.explorerUrl} target="_blank">
                <span>{shortenAddress(item.buyer)}</span>
                <span>{formatCount(item.round)}</span>
                <span>{item.price === undefined ? t.misc.unavailableDash : formatPol(item.price)}</span>
                <span>{formatTimestamp(item.timestamp)}</span>
                <span>{shortenHash(item.transactionHash)}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel table-panel">
          <div className="table-title">
            <div>
              <Trophy size={18} />
              <h2>{t.winners.title}</h2>
            </div>
            <Link href={CONTRACT_LINK} target="_blank">{t.misc.explorer}</Link>
          </div>
          <p className="table-subtitle">{t.winners.subtitle}</p>
          <div className="winner-list">
            <div className="table-head">
              <span>{t.winners.round}</span>
              <span>{t.winners.winner}</span>
              <span>{t.winners.prize}</span>
              <span>{t.winners.time}</span>
              <span>{t.winners.tx}</span>
            </div>
            {!dataAllowed && <p className="empty-state">{t.winners.locked}</p>}
            {dataAllowed && historyError && <p className="empty-state">{t.winners.unavailable}</p>}
            {dataAllowed && !historyError && winners.length === 0 && <p className="empty-state">{t.winners.empty}</p>}
            {dataAllowed && !historyError && winners.map((item) => (
              <Link className="winner-row" key={item.id} href={item.explorerUrl} target="_blank">
                <span>{formatCount(item.round)}</span>
                <span>{shortenAddress(item.winner)}</span>
                <span>{formatPol(item.prize)}</span>
                <span>{formatTimestamp(item.timestamp)}</span>
                <span>{shortenHash(item.transactionHash)}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section id="how" className="benefits panel">
        <div>
          <span className="large-icon"><Shield /></span>
          <strong>{t.sections.howTitle}</strong>
          {t.sections.howSteps.map((step) => <p key={step}>{step}</p>)}
        </div>
        <div>
          <span className="large-icon"><Lock /></span>
          <strong>{t.sections.transparencyTitle}</strong>
          {t.sections.transparencyItems.map((item) => <p key={item}>{item}</p>)}
        </div>
      </section>

      <section className="risk-strip panel">
        <strong>{t.sections.riskTitle}</strong>
        <p>{t.sections.risk}</p>
      </section>

      <section id="faq" className="faq-strip">
        {t.sections.faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <footer className="site-footer">
        <div>
          <Brand footer />
          <p>{t.footer.tagline}</p>
        </div>
        <div>
          <h3>{t.footer.links}</h3>
          <Link href="#buy">{t.nav.buy}</Link>
          <Link href="#history">{t.nav.activity}</Link>
          <Link href="#how">{t.nav.how}</Link>
          <Link href="#faq">{t.nav.faq}</Link>
        </div>
        <div>
          <h3>{t.footer.information}</h3>
          <Link href={CONTRACT_LINK} target="_blank">{t.footer.contract}</Link>
          <Link href={CONTRACT_LINK} target="_blank">{t.footer.polygon}</Link>
          <Link href={`${POLYGON_EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank">{shortenAddress(CONTRACT_ADDRESS)}</Link>
        </div>
        <small>{t.footer.rights}</small>
      </footer>

      {confirmOpen && lotteryState && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal">
            <button type="button" className="icon-button modal-close" onClick={() => setConfirmOpen(false)} aria-label={t.purchase.cancel}>
              <X />
            </button>
            <Ticket size={32} />
            <h2 id="confirm-title">{t.purchase.confirmTitle}</h2>
            <p>{t.purchase.confirmBody}</p>
            <dl className="confirm-list">
              <div><dt>{t.purchase.price}</dt><dd>{formatPol(lotteryState.ticketPrice)}</dd></div>
              <div><dt>{t.purchase.contract}</dt><dd>{shortenAddress(CONTRACT_ADDRESS)}</dd></div>
            </dl>
            <p className="inline-warning">{t.purchase.risk} {t.purchase.gas}</p>
            <div className="modal-actions">
              <button type="button" className="outline-button" onClick={() => setConfirmOpen(false)}>{t.purchase.cancel}</button>
              <button type="button" className="primary-button" onClick={buyTicket}>{t.purchase.continue}</button>
            </div>
          </div>
        </div>
      )}

      {predictionOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="prediction-title">
          <div className="modal">
            <button type="button" className="icon-button modal-close" onClick={() => setPredictionOpen(false)} aria-label={t.lucky.close}>
              <X />
            </button>
            <Sparkles size={32} />
            <h2 id="prediction-title">{t.lucky.title}</h2>
            <p>{predictionText}</p>
            <small>{t.lucky.label}</small>
          </div>
        </div>
      )}
    </main>
  );
}
