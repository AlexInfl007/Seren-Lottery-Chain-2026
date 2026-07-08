import type { ErrorKey } from "@/lib/contractErrors";

export const languages = ["en", "ru", "es", "zh-CN", "hi", "ar", "fr", "pt"] as const;
export type Language = (typeof languages)[number];

export const languageLabels: Record<Language, string> = {
  en: "EN",
  ru: "RU",
  es: "ES",
  "zh-CN": "中文",
  hi: "HI",
  ar: "AR",
  fr: "FR",
  pt: "PT",
};

export const rtlLanguages: Language[] = ["ar"];

export const predictionIds = [
  "quiet-door",
  "patient-luck",
  "look-twice",
  "new-connection",
  "small-steps",
  "trust-process",
  "curious-chapter",
  "careful-attention",
] as const;

export type PredictionId = (typeof predictionIds)[number];

type NavKey = "home" | "buy" | "activity" | "how" | "faq";
type DashboardKey =
  | "title"
  | "subtitleConnected"
  | "subtitleLocked"
  | "refresh"
  | "refreshing"
  | "locked"
  | "prizePool"
  | "currentRound"
  | "ticketsInDraw"
  | "yourTickets"
  | "ticketPrice"
  | "drawStatus"
  | "open"
  | "closed"
  | "emergency"
  | "normal"
  | "maxPerRound"
  | "maxPerAddress"
  | "contractReadable";
type PurchaseKey =
  | "title"
  | "oneTicket"
  | "gas"
  | "userTickets"
  | "buy"
  | "buyWithPrice"
  | "connectFirst"
  | "wrongNetwork"
  | "readFirst"
  | "unavailableConfig"
  | "closed"
  | "emergency"
  | "priceMismatch"
  | "insufficientFunds"
  | "simulationFailed"
  | "ready"
  | "confirmTitle"
  | "confirmBody"
  | "contract"
  | "price"
  | "risk"
  | "cancel"
  | "continue"
  | "simulating"
  | "awaitingWallet"
  | "pending"
  | "success"
  | "failed"
  | "viewTx";
type TableKey =
  | "title"
  | "subtitle"
  | "locked"
  | "unavailable"
  | "empty"
  | "buyer"
  | "round"
  | "price"
  | "winner"
  | "prize"
  | "tx"
  | "time";

export type Translation = {
  dir: "ltr" | "rtl";
  langName: string;
  nav: Record<NavKey, string>;
  wallet: {
    connect: string;
    connecting: string;
    connected: string;
    switch: string;
    disconnect: string;
    copied: string;
    copy: string;
    unavailable: string;
    wrongNetwork: string;
    selectProvider: string;
    browserWallet: string;
    walletConnect: string;
    walletConnectUnavailable: string;
    menu: string;
    close: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    contract: string;
    lucky: string;
  };
  dashboard: Record<DashboardKey, string>;
  purchase: Record<PurchaseKey, string>;
  activity: Record<TableKey, string>;
  winners: Record<TableKey, string>;
  sections: {
    howTitle: string;
    howSteps: string[];
    transparencyTitle: string;
    transparencyItems: string[];
    riskTitle: string;
    risk: string;
    faqTitle: string;
    faq: [string, string][];
  };
  lucky: {
    title: string;
    label: string;
    close: string;
    predictions: Record<PredictionId, string>;
  };
  footer: {
    tagline: string;
    links: string;
    information: string;
    contract: string;
    polygon: string;
    rights: string;
  };
  misc: {
    copied: string;
    unavailableDash: string;
    explorer: string;
    address: string;
  };
  errors: Record<ErrorKey, string>;
};

const en: Translation = {
  dir: "ltr",
  langName: "English",
  nav: { home: "Home", buy: "Buy", activity: "Activity", how: "How it works", faq: "FAQ" },
  wallet: {
    connect: "Connect wallet",
    connecting: "Connecting",
    connected: "Wallet connected",
    switch: "Switch to Polygon",
    disconnect: "Reset app session",
    copied: "Address copied",
    copy: "Copy address",
    unavailable: "No Web3 wallet was found. Open this page in a wallet browser or install an injected wallet.",
    wrongNetwork: "Switch to Polygon Mainnet to reveal live contract data.",
    selectProvider: "Choose a wallet",
    browserWallet: "Browser wallet",
    walletConnect: "WalletConnect",
    walletConnectUnavailable: "WalletConnect is not configured for this app.",
    menu: "Open menu",
    close: "Close menu",
  },
  hero: {
    eyebrow: "ON-CHAIN LOTTERY · POLYGON",
    heading: "Seren Lottery Chain",
    body: "On-chain lottery on Polygon. Contract data is shown only after wallet connection.",
    contract: "View contract",
    lucky: "Lucky message",
  },
  dashboard: {
    title: "Current draw",
    subtitleConnected: "Real values loaded through your connected wallet provider.",
    subtitleLocked: "Connect your wallet to reveal live lottery data.",
    refresh: "Refresh data",
    refreshing: "Refreshing",
    locked: "Connect wallet",
    prizePool: "Prize pool",
    currentRound: "Current round",
    ticketsInDraw: "Total tickets",
    yourTickets: "Your tickets",
    ticketPrice: "Ticket price",
    drawStatus: "Draw status",
    open: "Open",
    closed: "Closed",
    emergency: "Emergency paused",
    normal: "Normal",
    maxPerRound: "Max per round",
    maxPerAddress: "Max per address",
    contractReadable: "Contract state readable",
  },
  purchase: {
    title: "Buy one ticket",
    oneTicket: "Exactly one ticket is purchased per transaction.",
    gas: "Network gas is paid separately.",
    userTickets: "Your tickets",
    buy: "Buy 1 ticket",
    buyWithPrice: "Buy 1 ticket — {price}",
    connectFirst: "Connect your wallet to buy a ticket.",
    wrongNetwork: "Switch to Polygon Mainnet before purchasing.",
    readFirst: "Load contract data before purchasing.",
    unavailableConfig: "Ticket purchase is temporarily unavailable because the contract configuration requires verification.",
    closed: "Entries are unavailable while this draw is closed.",
    emergency: "Entry is temporarily unavailable.",
    priceMismatch: "Ticket price methods disagree. Purchasing is disabled until this is verified.",
    insufficientFunds: "Your wallet needs enough POL for the ticket price plus gas.",
    simulationFailed: "The transaction check failed, so purchase is disabled.",
    ready: "Transaction check passed.",
    confirmTitle: "Confirm ticket purchase",
    confirmBody: "Your wallet will ask you to confirm a buyTicket() contract transaction.",
    contract: "Contract",
    price: "Ticket price",
    risk: "Participation involves risk. You may lose the POL used to buy a ticket.",
    cancel: "Cancel",
    continue: "Continue to wallet",
    simulating: "Checking transaction",
    awaitingWallet: "Waiting for wallet confirmation",
    pending: "Waiting for Polygon confirmation",
    success: "Ticket purchase confirmed.",
    failed: "Transaction could not be completed.",
    viewTx: "View transaction",
  },
  activity: {
    title: "Recent purchases",
    subtitle: "TicketBought events loaded through your wallet provider.",
    locked: "Connect your wallet to load verifiable activity.",
    unavailable: "Activity history is unavailable through this wallet provider. You can still inspect the contract on PolygonScan.",
    empty: "No recorded ticket purchases found.",
    buyer: "Buyer",
    round: "Round",
    price: "Price",
    winner: "Winner",
    prize: "Prize",
    tx: "Transaction",
    time: "Time",
  },
  winners: {
    title: "Past winners",
    subtitle: "WinnerPicked events loaded through your wallet provider.",
    locked: "Connect your wallet to load completed draws.",
    unavailable: "Activity history is unavailable through this wallet provider. You can still inspect the contract on PolygonScan.",
    empty: "No completed draws yet.",
    buyer: "Buyer",
    round: "Round",
    price: "Price",
    winner: "Winner",
    prize: "Prize",
    tx: "Transaction",
    time: "Time",
  },
  sections: {
    howTitle: "How it works",
    howSteps: [
      "Connect a wallet on Polygon Mainnet.",
      "Read the live contract state through that wallet.",
      "Buy exactly one ticket with buyTicket() when the transaction check passes.",
      "Inspect activity and winner events on-chain.",
    ],
    transparencyTitle: "Transparency",
    transparencyItems: [
      "No live lottery data is shown before wallet connection.",
      "Prize pool, round, tickets, status, and ticket price come from the contract.",
      "Winner events are publicly verifiable when emitted by the contract.",
      "Activity can be inspected on PolygonScan.",
    ],
    riskTitle: "Risk notice",
    risk: "Lottery participation involves risk. You may lose the POL used to purchase a ticket. Only participate where permitted by applicable law. This website does not provide financial or legal advice.",
    faqTitle: "FAQ",
    faq: [
      ["What is Seren Lottery Chain?", "An on-chain lottery on Polygon."],
      ["Why is data hidden before connection?", "The site only uses your connected wallet provider for blockchain data."],
      ["What does one ticket cost?", "The live contract ticket price controls the displayed price and transaction value."],
      ["Is the lucky message part of the lottery?", "No. It is entertainment only and does not predict lottery results."],
    ],
  },
  lucky: {
    title: "Lucky message",
    label: "For entertainment only. This does not predict lottery results.",
    close: "Close",
    predictions: {
      "quiet-door": "A quiet decision may open an unexpected door.",
      "patient-luck": "Patience can be its own kind of luck.",
      "look-twice": "Look twice before choosing the obvious path.",
      "new-connection": "A new connection may bring fresh momentum.",
      "small-steps": "Small steps can lead to memorable outcomes.",
      "trust-process": "Trust your process, not a promise.",
      "curious-chapter": "The next chapter may start with curiosity.",
      "careful-attention": "Today rewards careful attention.",
    },
  },
  footer: {
    tagline: "On-chain lottery on Polygon",
    links: "Links",
    information: "Information",
    contract: "Smart contract",
    polygon: "PolygonScan",
    rights: "© 2026 Seren Lottery Chain",
  },
  misc: { copied: "Copied", unavailableDash: "—", explorer: "PolygonScan", address: "Address" },
  errors: {
    walletUnavailable: "No wallet provider is available in this browser.",
    userRejected: "The wallet request was rejected.",
    wrongNetwork: "Polygon Mainnet is required.",
    noAccounts: "No wallet accounts were returned.",
    providerFailure: "The wallet provider could not complete the request.",
    configInvalid: "Lottery purchase is temporarily unavailable because the contract configuration requires verification.",
    readFailed: "Contract data could not be read through this wallet provider.",
    simulationFailed: "The transaction check failed, so purchase is disabled.",
    purchaseClosed: "Entries are unavailable while this draw is closed.",
    emergencyActive: "Entry temporarily unavailable.",
    insufficientFunds: "Your wallet does not have enough POL for this ticket and network gas.",
    transactionRejected: "The transaction was rejected in the wallet.",
    transactionFailed: "The transaction did not complete successfully.",
    historyUnavailable: "Activity history is unavailable through this wallet provider.",
  },
};

const dictionaries: Record<Exclude<Language, "en">, Partial<Translation>> = {
  ru: {
    langName: "Русский",
    nav: { home: "Главная", buy: "Купить", activity: "Активность", how: "Как это работает", faq: "FAQ" },
    wallet: {
      connect: "Подключить кошелек", connecting: "Подключение", connected: "Кошелек подключен", switch: "Переключить на Polygon", disconnect: "Сбросить сессию", copied: "Адрес скопирован", copy: "Скопировать адрес", unavailable: "Web3-кошелек не найден. Откройте страницу в кошельке или установите расширение.", wrongNetwork: "Переключитесь на Polygon Mainnet, чтобы увидеть данные контракта.", selectProvider: "Выберите кошелек", browserWallet: "Браузерный кошелек", walletConnect: "WalletConnect", walletConnectUnavailable: "WalletConnect не настроен для этого приложения.", menu: "Открыть меню", close: "Закрыть меню",
    },
    hero: { eyebrow: "ОНЧЕЙН-ЛОТЕРЕЯ · POLYGON", heading: "Seren Lottery Chain", body: "Ончейн-лотерея на Polygon. Данные контракта показываются только после подключения кошелька.", contract: "Открыть контракт", lucky: "Счастливое сообщение" },
    dashboard: { title: "Текущий розыгрыш", subtitleConnected: "Реальные значения загружены через провайдер вашего кошелька.", subtitleLocked: "Подключите кошелек, чтобы увидеть данные лотереи.", refresh: "Обновить данные", refreshing: "Обновление", locked: "Подключите кошелек", prizePool: "Призовой пул", currentRound: "Текущий раунд", ticketsInDraw: "Всего билетов", yourTickets: "Ваши билеты", ticketPrice: "Цена билета", drawStatus: "Статус розыгрыша", open: "Открыт", closed: "Закрыт", emergency: "Пауза", normal: "Норма", maxPerRound: "Макс. за раунд", maxPerAddress: "Макс. на адрес", contractReadable: "Состояние контракта доступно" },
    purchase: { title: "Купить один билет", oneTicket: "За одну транзакцию покупается ровно один билет.", gas: "Комиссия сети оплачивается отдельно.", userTickets: "Ваши билеты", buy: "Купить 1 билет", buyWithPrice: "Купить 1 билет — {price}", connectFirst: "Подключите кошелек, чтобы купить билет.", wrongNetwork: "Перед покупкой переключитесь на Polygon Mainnet.", readFirst: "Загрузите данные контракта перед покупкой.", unavailableConfig: "Покупка временно недоступна: конфигурацию контракта нужно проверить.", closed: "Участие недоступно, пока розыгрыш закрыт.", emergency: "Участие временно недоступно.", priceMismatch: "Методы цены билета расходятся. Покупка отключена до проверки.", insufficientFunds: "В кошельке должно быть достаточно POL для билета и газа.", simulationFailed: "Проверка транзакции не прошла, покупка отключена.", ready: "Проверка транзакции прошла.", confirmTitle: "Подтвердите покупку билета", confirmBody: "Кошелек попросит подтвердить транзакцию buyTicket().", contract: "Контракт", price: "Цена билета", risk: "Участие связано с риском. Вы можете потерять POL, использованные для покупки билета.", cancel: "Отмена", continue: "Перейти к кошельку", simulating: "Проверка транзакции", awaitingWallet: "Ожидание кошелька", pending: "Ожидание подтверждения Polygon", success: "Покупка билета подтверждена.", failed: "Транзакцию не удалось завершить.", viewTx: "Открыть транзакцию" },
    activity: { title: "Недавние покупки", subtitle: "События TicketBought загружены через провайдер кошелька.", locked: "Подключите кошелек, чтобы загрузить проверяемую активность.", unavailable: "История активности недоступна через этот провайдер кошелька. Контракт можно проверить на PolygonScan.", empty: "Записанных покупок билетов не найдено.", buyer: "Покупатель", round: "Раунд", price: "Цена", winner: "Победитель", prize: "Приз", tx: "Транзакция", time: "Время" },
    winners: { title: "Прошлые победители", subtitle: "События WinnerPicked загружены через провайдер кошелька.", locked: "Подключите кошелек, чтобы загрузить завершенные розыгрыши.", unavailable: "История активности недоступна через этот провайдер кошелька. Контракт можно проверить на PolygonScan.", empty: "Завершенных розыгрышей пока нет.", buyer: "Покупатель", round: "Раунд", price: "Цена", winner: "Победитель", prize: "Приз", tx: "Транзакция", time: "Время" },
    sections: { howTitle: "Как это работает", howSteps: ["Подключите кошелек в Polygon Mainnet.", "Прочитайте состояние контракта через этот кошелек.", "Купите ровно один билет через buyTicket(), если проверка транзакции прошла.", "Проверяйте активность и события победителей в блокчейне."], transparencyTitle: "Прозрачность", transparencyItems: ["До подключения кошелька данные лотереи не показываются.", "Призовой пул, раунд, билеты, статус и цена берутся из контракта.", "События победителей публично проверяемы после их эмиссии контрактом.", "Активность можно проверить на PolygonScan."], riskTitle: "Уведомление о риске", risk: "Участие в лотерее связано с риском. Вы можете потерять POL, использованные для покупки билета. Участвуйте только там, где это разрешено законом. Этот сайт не предоставляет финансовые или юридические советы.", faqTitle: "FAQ", faq: [["Что такое Seren Lottery Chain?", "Ончейн-лотерея на Polygon."], ["Почему данные скрыты до подключения?", "Сайт использует только провайдер подключенного кошелька."], ["Сколько стоит билет?", "Цена и сумма транзакции берутся из контракта."], ["Счастливое сообщение связано с лотереей?", "Нет. Это только развлечение и не предсказывает результаты."]] },
    lucky: { title: "Счастливое сообщение", label: "Только для развлечения. Это не предсказывает результаты лотереи.", close: "Закрыть", predictions: { "quiet-door": "Тихое решение может открыть неожиданную дверь.", "patient-luck": "Терпение тоже может быть удачей.", "look-twice": "Посмотрите дважды, прежде чем выбрать очевидный путь.", "new-connection": "Новая связь может дать новый импульс.", "small-steps": "Маленькие шаги ведут к заметным итогам.", "trust-process": "Доверяйте процессу, а не обещанию.", "curious-chapter": "Новая глава может начаться с любопытства.", "careful-attention": "Сегодня внимательность вознаграждается." } },
    footer: { tagline: "Ончейн-лотерея на Polygon", links: "Ссылки", information: "Информация", contract: "Смарт-контракт", polygon: "PolygonScan", rights: "© 2026 Seren Lottery Chain" },
    misc: { copied: "Скопировано", unavailableDash: "—", explorer: "PolygonScan", address: "Адрес" },
  },
  es: {
    langName: "Español",
    nav: { home: "Inicio", buy: "Comprar", activity: "Actividad", how: "Cómo funciona", faq: "FAQ" },
    wallet: { connect: "Conectar wallet", connecting: "Conectando", connected: "Wallet conectada", switch: "Cambiar a Polygon", disconnect: "Reiniciar sesión", copied: "Dirección copiada", copy: "Copiar dirección", unavailable: "No se encontró una wallet Web3. Abre la página en una wallet móvil o instala una wallet inyectada.", wrongNetwork: "Cambia a Polygon Mainnet para ver datos reales del contrato.", selectProvider: "Elige una wallet", browserWallet: "Wallet del navegador", walletConnect: "WalletConnect", walletConnectUnavailable: "WalletConnect no está configurado para esta app.", menu: "Abrir menú", close: "Cerrar menú" },
    hero: { eyebrow: "LOTERÍA ON-CHAIN · POLYGON", heading: "Seren Lottery Chain", body: "Lotería on-chain en Polygon. Los datos del contrato se muestran solo después de conectar la wallet.", contract: "Ver contrato", lucky: "Mensaje de suerte" },
    dashboard: { ...en.dashboard, title: "Sorteo actual", subtitleConnected: "Valores reales cargados desde el proveedor de tu wallet.", subtitleLocked: "Conecta tu wallet para revelar datos de la lotería.", refresh: "Actualizar datos", refreshing: "Actualizando", locked: "Conectar wallet", prizePool: "Pozo", currentRound: "Ronda actual", ticketsInDraw: "Boletos totales", yourTickets: "Tus boletos", ticketPrice: "Precio del boleto", drawStatus: "Estado", open: "Abierto", closed: "Cerrado", emergency: "Pausado", normal: "Normal", maxPerRound: "Máx. por ronda", maxPerAddress: "Máx. por dirección", contractReadable: "Estado del contrato legible" },
    purchase: { ...en.purchase, title: "Comprar un boleto", oneTicket: "Se compra exactamente un boleto por transacción.", gas: "El gas de red se paga por separado.", userTickets: "Tus boletos", buy: "Comprar 1 boleto", buyWithPrice: "Comprar 1 boleto — {price}", connectFirst: "Conecta tu wallet para comprar.", wrongNetwork: "Cambia a Polygon Mainnet antes de comprar.", readFirst: "Carga los datos del contrato antes de comprar.", closed: "No se aceptan entradas mientras el sorteo está cerrado.", emergency: "Entrada temporalmente no disponible.", priceMismatch: "Los métodos de precio no coinciden. La compra está desactivada.", insufficientFunds: "Necesitas POL suficiente para boleto y gas.", simulationFailed: "La comprobación falló; la compra está desactivada.", ready: "La comprobación pasó.", confirmTitle: "Confirmar compra", confirmBody: "Tu wallet pedirá confirmar una transacción buyTicket().", contract: "Contrato", price: "Precio", risk: "Participar implica riesgo. Puedes perder el POL usado.", cancel: "Cancelar", continue: "Continuar a wallet", simulating: "Comprobando", awaitingWallet: "Esperando wallet", pending: "Esperando Polygon", success: "Compra confirmada.", failed: "No se pudo completar.", viewTx: "Ver transacción" },
    activity: { ...en.activity, title: "Compras recientes", subtitle: "Eventos TicketBought cargados con tu wallet.", locked: "Conecta tu wallet para cargar actividad verificable.", unavailable: "El historial no está disponible con este proveedor. Puedes revisar el contrato en PolygonScan.", empty: "No hay compras registradas.", buyer: "Comprador", round: "Ronda", price: "Precio", tx: "Transacción", time: "Hora" },
    winners: { ...en.winners, title: "Ganadores anteriores", subtitle: "Eventos WinnerPicked cargados con tu wallet.", locked: "Conecta tu wallet para cargar sorteos completados.", empty: "Aún no hay sorteos completados.", winner: "Ganador", round: "Ronda", prize: "Premio", tx: "Transacción", time: "Hora" },
    sections: { ...en.sections, howTitle: "Cómo funciona", howSteps: ["Conecta una wallet en Polygon Mainnet.", "Lee el estado real del contrato.", "Compra exactamente un boleto con buyTicket() si la comprobación pasa.", "Revisa actividad y ganadores on-chain."], transparencyTitle: "Transparencia", transparencyItems: ["No se muestran datos de la lotería antes de conectar la wallet.", "Pozo, ronda, boletos, estado y precio vienen del contrato.", "Los eventos de ganadores son verificables cuando el contrato los emite.", "La actividad puede revisarse en PolygonScan."], riskTitle: "Aviso de riesgo", risk: "Participar en la lotería implica riesgo. Puedes perder el POL usado para comprar un boleto. Participa solo donde la ley lo permita. Este sitio no ofrece asesoría financiera ni legal.", faqTitle: "FAQ", faq: [["¿Qué es Seren Lottery Chain?", "Una lotería on-chain en Polygon."], ["¿Por qué se ocultan los datos antes de conectar?", "El sitio usa solo el proveedor de tu wallet conectada."], ["¿Cuánto cuesta un boleto?", "El precio y el valor de la transacción vienen del contrato."], ["¿El mensaje de suerte afecta la lotería?", "No. Es solo entretenimiento y no predice resultados."]] },
    lucky: { ...en.lucky, title: "Mensaje de suerte", label: "Solo entretenimiento. No predice resultados de la lotería.", close: "Cerrar", predictions: { "quiet-door": "Una decisión tranquila puede abrir una puerta inesperada.", "patient-luck": "La paciencia también puede ser una forma de suerte.", "look-twice": "Mira dos veces antes de elegir lo obvio.", "new-connection": "Una nueva conexión puede traer impulso.", "small-steps": "Los pasos pequeños pueden llevar a grandes momentos.", "trust-process": "Confía en tu proceso, no en una promesa.", "curious-chapter": "El próximo capítulo puede empezar con curiosidad.", "careful-attention": "Hoy se recompensa la atención cuidadosa." } },
    footer: { ...en.footer, tagline: "Lotería on-chain en Polygon", links: "Enlaces", information: "Información", contract: "Contrato inteligente" },
  },
  "zh-CN": {
    langName: "简体中文",
    nav: { home: "首页", buy: "购买", activity: "活动", how: "玩法", faq: "常见问题" },
    wallet: { connect: "连接钱包", connecting: "连接中", connected: "钱包已连接", switch: "切换到 Polygon", disconnect: "重置会话", copied: "地址已复制", copy: "复制地址", unavailable: "未找到 Web3 钱包。请在钱包浏览器打开或安装注入式钱包。", wrongNetwork: "请切换到 Polygon Mainnet 以查看合约数据。", selectProvider: "选择钱包", browserWallet: "浏览器钱包", walletConnect: "WalletConnect", walletConnectUnavailable: "此应用未配置 WalletConnect。", menu: "打开菜单", close: "关闭菜单" },
    hero: { eyebrow: "链上彩票 · POLYGON", heading: "Seren Lottery Chain", body: "Polygon 上的链上彩票。连接钱包后才显示合约数据。", contract: "查看合约", lucky: "幸运消息" },
    dashboard: { ...en.dashboard, title: "当前开奖", subtitleConnected: "真实数据通过已连接的钱包提供者加载。", subtitleLocked: "连接钱包以显示实时彩票数据。", refresh: "刷新数据", refreshing: "刷新中", locked: "连接钱包", prizePool: "奖池", currentRound: "当前轮次", ticketsInDraw: "总票数", yourTickets: "你的票数", ticketPrice: "票价", drawStatus: "状态", open: "开放", closed: "关闭", emergency: "暂停", normal: "正常", maxPerRound: "每轮上限", maxPerAddress: "每地址上限", contractReadable: "合约状态可读取" },
    purchase: { ...en.purchase, title: "购买一张票", oneTicket: "每笔交易只购买一张票。", gas: "网络 gas 另付。", userTickets: "你的票数", buy: "购买 1 张票", buyWithPrice: "购买 1 张票 — {price}", connectFirst: "连接钱包后购买。", wrongNetwork: "购买前请切换到 Polygon Mainnet。", readFirst: "购买前请先加载合约数据。", closed: "本轮关闭时无法参与。", emergency: "暂时无法参与。", priceMismatch: "票价方法不一致，购买已禁用。", insufficientFunds: "钱包需要足够 POL 支付票价和 gas。", simulationFailed: "交易检查失败，购买已禁用。", ready: "交易检查通过。", confirmTitle: "确认购票", confirmBody: "钱包将要求确认 buyTicket() 合约交易。", contract: "合约", price: "票价", risk: "参与有风险，你可能失去用于购票的 POL。", cancel: "取消", continue: "继续到钱包", simulating: "检查交易", awaitingWallet: "等待钱包", pending: "等待 Polygon 确认", success: "购票已确认。", failed: "交易未完成。", viewTx: "查看交易" },
    activity: { ...en.activity, title: "最近购买", subtitle: "通过钱包提供者加载 TicketBought 事件。", locked: "连接钱包以加载可验证活动。", unavailable: "此钱包提供者无法加载活动历史。你仍可在 PolygonScan 查看合约。", empty: "未找到购票记录。", buyer: "买家", round: "轮次", price: "价格", tx: "交易", time: "时间" },
    winners: { ...en.winners, title: "历史赢家", subtitle: "通过钱包提供者加载 WinnerPicked 事件。", locked: "连接钱包以加载已完成开奖。", empty: "暂无已完成开奖。", winner: "赢家", round: "轮次", prize: "奖金", tx: "交易", time: "时间" },
    sections: { ...en.sections, howTitle: "玩法", howSteps: ["连接 Polygon Mainnet 钱包。", "通过该钱包读取真实合约状态。", "交易检查通过后用 buyTicket() 购买一张票。", "在链上查看活动和赢家事件。"], transparencyTitle: "透明度", transparencyItems: ["连接钱包前不显示彩票数据。", "奖池、轮次、票数、状态和票价都来自合约。", "合约发出赢家事件后可公开验证。", "活动可在 PolygonScan 查看。"], riskTitle: "风险提示", risk: "参与彩票有风险。你可能失去用于购买彩票的 POL。请仅在适用法律允许的地区参与。本网站不提供金融或法律建议。", faqTitle: "常见问题", faq: [["Seren Lottery Chain 是什么？", "Polygon 上的链上彩票。"], ["为什么连接前隐藏数据？", "网站只使用已连接钱包的提供者。"], ["一张票多少钱？", "价格和交易金额由合约返回值决定。"], ["幸运消息和彩票有关吗？", "没有。它仅供娱乐，不预测结果。"]] },
    lucky: { ...en.lucky, title: "幸运消息", label: "仅供娱乐。这不会预测彩票结果。", close: "关闭", predictions: { "quiet-door": "一个安静的决定可能打开意外之门。", "patient-luck": "耐心也可以是一种好运。", "look-twice": "选择明显道路前，请再看一眼。", "new-connection": "新的连接可能带来新的动力。", "small-steps": "小步也能走向难忘结果。", "trust-process": "相信你的过程，而不是承诺。", "curious-chapter": "下一章可能从好奇开始。", "careful-attention": "今天会奖励细致的注意力。" } },
    footer: { ...en.footer, tagline: "Polygon 链上彩票", links: "链接", information: "信息", contract: "智能合约" },
  },
  hi: {
    langName: "हिन्दी",
    nav: { home: "होम", buy: "खरीदें", activity: "गतिविधि", how: "कैसे काम करता है", faq: "FAQ" },
    wallet: { connect: "वॉलेट कनेक्ट करें", connecting: "कनेक्ट हो रहा है", connected: "वॉलेट कनेक्ट है", switch: "Polygon पर स्विच करें", disconnect: "ऐप सत्र रीसेट करें", copied: "पता कॉपी हुआ", copy: "पता कॉपी करें", unavailable: "Web3 वॉलेट नहीं मिला। इसे वॉलेट ब्राउज़र में खोलें या injected wallet इंस्टॉल करें।", wrongNetwork: "लाइव डेटा देखने के लिए Polygon Mainnet पर स्विच करें।", selectProvider: "वॉलेट चुनें", browserWallet: "ब्राउज़र वॉलेट", walletConnect: "WalletConnect", walletConnectUnavailable: "इस ऐप के लिए WalletConnect कॉन्फ़िगर नहीं है।", menu: "मेनू खोलें", close: "मेनू बंद करें" },
    hero: { eyebrow: "ऑन-चेन लॉटरी · POLYGON", heading: "Seren Lottery Chain", body: "Polygon पर ऑन-चेन लॉटरी। कॉन्ट्रैक्ट डेटा केवल वॉलेट कनेक्शन के बाद दिखता है।", contract: "कॉन्ट्रैक्ट देखें", lucky: "लकी संदेश" },
    dashboard: { ...en.dashboard, title: "वर्तमान ड्रॉ", subtitleConnected: "वास्तविक मान आपके वॉलेट provider से लोड हुए।", subtitleLocked: "लाइव लॉटरी डेटा देखने के लिए वॉलेट कनेक्ट करें।", refresh: "डेटा रीफ्रेश करें", refreshing: "रीफ्रेश हो रहा है", locked: "वॉलेट कनेक्ट करें", prizePool: "प्राइज़ पूल", currentRound: "वर्तमान राउंड", ticketsInDraw: "कुल टिकट", yourTickets: "आपके टिकट", ticketPrice: "टिकट मूल्य", drawStatus: "ड्रॉ स्थिति", open: "खुला", closed: "बंद", emergency: "रुका हुआ", normal: "सामान्य", maxPerRound: "प्रति राउंड अधिकतम", maxPerAddress: "प्रति पता अधिकतम", contractReadable: "कॉन्ट्रैक्ट स्थिति पढ़ी गई" },
    purchase: { ...en.purchase, title: "एक टिकट खरीदें", oneTicket: "हर transaction में ठीक एक टिकट खरीदा जाता है।", gas: "नेटवर्क gas अलग से लगता है।", userTickets: "आपके टिकट", buy: "1 टिकट खरीदें", buyWithPrice: "1 टिकट खरीदें — {price}", connectFirst: "टिकट खरीदने के लिए वॉलेट कनेक्ट करें।", wrongNetwork: "खरीदने से पहले Polygon Mainnet पर स्विच करें।", readFirst: "खरीदने से पहले कॉन्ट्रैक्ट डेटा लोड करें।", closed: "ड्रॉ बंद होने पर entry उपलब्ध नहीं है।", emergency: "Entry अभी उपलब्ध नहीं है।", priceMismatch: "टिकट मूल्य methods अलग हैं। खरीद बंद है।", insufficientFunds: "टिकट और gas के लिए पर्याप्त POL चाहिए।", simulationFailed: "Transaction check विफल रहा, खरीद बंद है।", ready: "Transaction check पास हुआ।", confirmTitle: "टिकट खरीद की पुष्टि करें", confirmBody: "वॉलेट buyTicket() transaction पुष्टि करने को कहेगा।", contract: "कॉन्ट्रैक्ट", price: "टिकट मूल्य", risk: "भागीदारी जोखिम भरी है। आप टिकट के लिए इस्तेमाल POL खो सकते हैं।", cancel: "रद्द करें", continue: "वॉलेट पर जारी रखें", simulating: "Transaction जांच", awaitingWallet: "वॉलेट की प्रतीक्षा", pending: "Polygon पुष्टि की प्रतीक्षा", success: "टिकट खरीद पुष्टि हुई।", failed: "Transaction पूरी नहीं हुई।", viewTx: "Transaction देखें" },
    activity: { ...en.activity, title: "हाल की खरीद", subtitle: "TicketBought events आपके wallet provider से लोड हुए।", locked: "सत्यापित गतिविधि लोड करने के लिए वॉलेट कनेक्ट करें।", unavailable: "इस wallet provider से activity history उपलब्ध नहीं है। आप PolygonScan पर contract देख सकते हैं।", empty: "कोई ticket purchase record नहीं मिला।", buyer: "खरीदार", round: "राउंड", price: "मूल्य", tx: "Transaction", time: "समय" },
    winners: { ...en.winners, title: "पिछले विजेता", subtitle: "WinnerPicked events आपके wallet provider से लोड हुए।", locked: "पूरे हुए draws लोड करने के लिए वॉलेट कनेक्ट करें।", empty: "अभी कोई completed draw नहीं है।", winner: "विजेता", round: "राउंड", prize: "पुरस्कार", tx: "Transaction", time: "समय" },
    sections: { ...en.sections, howTitle: "कैसे काम करता है", howSteps: ["Polygon Mainnet पर वॉलेट कनेक्ट करें।", "उसी वॉलेट से वास्तविक contract state पढ़ें।", "Check पास होने पर buyTicket() से एक टिकट खरीदें।", "Activity और winner events on-chain देखें।"], transparencyTitle: "पारदर्शिता", transparencyItems: ["वॉलेट कनेक्ट होने से पहले live lottery data नहीं दिखता।", "Prize pool, round, tickets, status और price contract से आते हैं।", "Winner events contract द्वारा emit होने पर सार्वजनिक रूप से verified हैं।", "Activity PolygonScan पर देखी जा सकती है।"], riskTitle: "जोखिम सूचना", risk: "लॉटरी में भाग लेना जोखिम भरा है। आप टिकट खरीदने में इस्तेमाल POL खो सकते हैं। केवल वहां भाग लें जहां लागू कानून अनुमति देता है। यह वेबसाइट वित्तीय या कानूनी सलाह नहीं देती।", faqTitle: "FAQ", faq: [["Seren Lottery Chain क्या है?", "Polygon पर on-chain lottery।"], ["कनेक्शन से पहले data क्यों छिपा है?", "Site सिर्फ connected wallet provider का उपयोग करती है।"], ["एक टिकट कितने का है?", "Price और transaction value contract से आते हैं।"], ["क्या lucky message lottery से जुड़ा है?", "नहीं। यह केवल मनोरंजन है और result predict नहीं करता।"]] },
    lucky: { ...en.lucky, title: "लकी संदेश", label: "केवल मनोरंजन के लिए। यह lottery results की भविष्यवाणी नहीं करता।", close: "बंद करें", predictions: { "quiet-door": "एक शांत निर्णय अनपेक्षित दरवाजा खोल सकता है।", "patient-luck": "धैर्य भी किस्मत जैसा हो सकता है।", "look-twice": "स्पष्ट रास्ता चुनने से पहले दो बार देखें।", "new-connection": "नई connection नया momentum ला सकती है।", "small-steps": "छोटे कदम यादगार परिणाम दे सकते हैं।", "trust-process": "Promise पर नहीं, अपनी process पर भरोसा करें।", "curious-chapter": "अगला chapter curiosity से शुरू हो सकता है।", "careful-attention": "आज careful attention का reward मिलता है।" } },
    footer: { ...en.footer, tagline: "Polygon पर ऑन-चेन लॉटरी", links: "लिंक", information: "जानकारी", contract: "स्मार्ट कॉन्ट्रैक्ट" },
  },
  ar: {
    dir: "rtl",
    langName: "العربية",
    nav: { home: "الرئيسية", buy: "شراء", activity: "النشاط", how: "طريقة العمل", faq: "الأسئلة" },
    wallet: { connect: "ربط المحفظة", connecting: "جار الربط", connected: "المحفظة مرتبطة", switch: "التحويل إلى Polygon", disconnect: "إعادة ضبط الجلسة", copied: "تم نسخ العنوان", copy: "نسخ العنوان", unavailable: "لم يتم العثور على محفظة Web3. افتح الصفحة في متصفح محفظة أو ثبّت محفظة مدعومة.", wrongNetwork: "حوّل إلى Polygon Mainnet لعرض بيانات العقد.", selectProvider: "اختر محفظة", browserWallet: "محفظة المتصفح", walletConnect: "WalletConnect", walletConnectUnavailable: "WalletConnect غير مفعّل لهذا التطبيق.", menu: "فتح القائمة", close: "إغلاق القائمة" },
    hero: { eyebrow: "يانصيب على السلسلة · POLYGON", heading: "Seren Lottery Chain", body: "يانصيب على Polygon. تظهر بيانات العقد فقط بعد ربط المحفظة.", contract: "عرض العقد", lucky: "رسالة حظ" },
    dashboard: { ...en.dashboard, title: "السحب الحالي", subtitleConnected: "تم تحميل القيم الحقيقية عبر مزود محفظتك.", subtitleLocked: "اربط محفظتك لعرض بيانات اليانصيب الحية.", refresh: "تحديث البيانات", refreshing: "جار التحديث", locked: "اربط المحفظة", prizePool: "مجمع الجائزة", currentRound: "الجولة الحالية", ticketsInDraw: "إجمالي التذاكر", yourTickets: "تذاكرك", ticketPrice: "سعر التذكرة", drawStatus: "حالة السحب", open: "مفتوح", closed: "مغلق", emergency: "متوقف", normal: "طبيعي", maxPerRound: "الحد لكل جولة", maxPerAddress: "الحد لكل عنوان", contractReadable: "حالة العقد قابلة للقراءة" },
    purchase: { ...en.purchase, title: "شراء تذكرة واحدة", oneTicket: "يتم شراء تذكرة واحدة فقط في كل معاملة.", gas: "رسوم الشبكة تدفع بشكل منفصل.", userTickets: "تذاكرك", buy: "شراء تذكرة واحدة", buyWithPrice: "شراء تذكرة واحدة — {price}", connectFirst: "اربط محفظتك لشراء تذكرة.", wrongNetwork: "حوّل إلى Polygon Mainnet قبل الشراء.", readFirst: "حمّل بيانات العقد قبل الشراء.", closed: "المشاركة غير متاحة أثناء إغلاق السحب.", emergency: "المشاركة غير متاحة مؤقتا.", priceMismatch: "طرق سعر التذكرة غير متطابقة. تم تعطيل الشراء.", insufficientFunds: "تحتاج إلى POL كاف لسعر التذكرة والغاز.", simulationFailed: "فشل فحص المعاملة، لذلك تم تعطيل الشراء.", ready: "نجح فحص المعاملة.", confirmTitle: "تأكيد شراء التذكرة", confirmBody: "ستطلب محفظتك تأكيد معاملة buyTicket().", contract: "العقد", price: "سعر التذكرة", risk: "المشاركة تنطوي على مخاطر. قد تخسر POL المستخدم لشراء التذكرة.", cancel: "إلغاء", continue: "المتابعة إلى المحفظة", simulating: "فحص المعاملة", awaitingWallet: "انتظار المحفظة", pending: "انتظار تأكيد Polygon", success: "تم تأكيد شراء التذكرة.", failed: "تعذر إكمال المعاملة.", viewTx: "عرض المعاملة" },
    activity: { ...en.activity, title: "المشتريات الأخيرة", subtitle: "أحداث TicketBought محملة عبر مزود المحفظة.", locked: "اربط محفظتك لتحميل نشاط قابل للتحقق.", unavailable: "سجل النشاط غير متاح عبر مزود هذه المحفظة. يمكنك فحص العقد على PolygonScan.", empty: "لا توجد مشتريات تذاكر مسجلة.", buyer: "المشتري", round: "الجولة", price: "السعر", tx: "المعاملة", time: "الوقت" },
    winners: { ...en.winners, title: "الفائزون السابقون", subtitle: "أحداث WinnerPicked محملة عبر مزود المحفظة.", locked: "اربط محفظتك لتحميل السحوبات المكتملة.", empty: "لا توجد سحوبات مكتملة بعد.", winner: "الفائز", round: "الجولة", prize: "الجائزة", tx: "المعاملة", time: "الوقت" },
    sections: { ...en.sections, howTitle: "طريقة العمل", howSteps: ["اربط محفظة على Polygon Mainnet.", "اقرأ حالة العقد الحقيقية عبر تلك المحفظة.", "اشتر تذكرة واحدة عبر buyTicket() بعد نجاح الفحص.", "افحص النشاط وأحداث الفائزين على السلسلة."], transparencyTitle: "الشفافية", transparencyItems: ["لا تظهر بيانات اليانصيب قبل ربط المحفظة.", "مجمع الجائزة والجولة والتذاكر والحالة والسعر تأتي من العقد.", "أحداث الفائزين قابلة للتحقق عند إصدارها من العقد.", "يمكن فحص النشاط على PolygonScan."], riskTitle: "إشعار المخاطر", risk: "المشاركة في اليانصيب تنطوي على مخاطر. قد تخسر POL المستخدم لشراء التذكرة. شارك فقط حيث يسمح القانون. لا يقدم هذا الموقع نصائح مالية أو قانونية.", faqTitle: "الأسئلة الشائعة", faq: [["ما هو Seren Lottery Chain؟", "يانصيب على Polygon."], ["لماذا البيانات مخفية قبل الربط؟", "الموقع يستخدم مزود المحفظة المرتبطة فقط."], ["ما سعر التذكرة؟", "السعر وقيمة المعاملة تأتي من العقد."], ["هل رسالة الحظ مرتبطة بالنتائج؟", "لا. هي للترفيه فقط ولا تتنبأ بالنتائج."]] },
    lucky: { ...en.lucky, title: "رسالة حظ", label: "للترفيه فقط. هذا لا يتنبأ بنتائج اليانصيب.", close: "إغلاق", predictions: { "quiet-door": "قرار هادئ قد يفتح بابا غير متوقع.", "patient-luck": "الصبر قد يكون نوعا من الحظ.", "look-twice": "انظر مرتين قبل اختيار الطريق الواضح.", "new-connection": "اتصال جديد قد يجلب زخما جديدا.", "small-steps": "الخطوات الصغيرة قد تقود إلى نتائج لا تنسى.", "trust-process": "ثق بعمليتك لا بالوعد.", "curious-chapter": "الفصل القادم قد يبدأ بالفضول.", "careful-attention": "اليوم يكافئ الانتباه الدقيق." } },
    footer: { ...en.footer, tagline: "يانصيب على Polygon", links: "روابط", information: "معلومات", contract: "العقد الذكي" },
  },
  fr: {
    langName: "Français",
    nav: { home: "Accueil", buy: "Acheter", activity: "Activité", how: "Fonctionnement", faq: "FAQ" },
    wallet: { connect: "Connecter le wallet", connecting: "Connexion", connected: "Wallet connecté", switch: "Passer à Polygon", disconnect: "Réinitialiser la session", copied: "Adresse copiée", copy: "Copier l'adresse", unavailable: "Aucun wallet Web3 trouvé. Ouvrez cette page dans un wallet mobile ou installez un wallet injecté.", wrongNetwork: "Passez à Polygon Mainnet pour afficher les données du contrat.", selectProvider: "Choisir un wallet", browserWallet: "Wallet navigateur", walletConnect: "WalletConnect", walletConnectUnavailable: "WalletConnect n'est pas configuré pour cette app.", menu: "Ouvrir le menu", close: "Fermer le menu" },
    hero: { eyebrow: "LOTERIE ON-CHAIN · POLYGON", heading: "Seren Lottery Chain", body: "Loterie on-chain sur Polygon. Les données du contrat s'affichent seulement après connexion du wallet.", contract: "Voir le contrat", lucky: "Message chance" },
    dashboard: { ...en.dashboard, title: "Tirage actuel", subtitleConnected: "Valeurs réelles chargées via le provider de votre wallet.", subtitleLocked: "Connectez votre wallet pour révéler les données de loterie.", refresh: "Actualiser", refreshing: "Actualisation", locked: "Connecter", prizePool: "Cagnotte", currentRound: "Round actuel", ticketsInDraw: "Tickets totaux", yourTickets: "Vos tickets", ticketPrice: "Prix du ticket", drawStatus: "Statut", open: "Ouvert", closed: "Fermé", emergency: "En pause", normal: "Normal", maxPerRound: "Max par round", maxPerAddress: "Max par adresse", contractReadable: "État du contrat lisible" },
    purchase: { ...en.purchase, title: "Acheter un ticket", oneTicket: "Un seul ticket est acheté par transaction.", gas: "Le gas réseau est payé séparément.", userTickets: "Vos tickets", buy: "Acheter 1 ticket", buyWithPrice: "Acheter 1 ticket — {price}", connectFirst: "Connectez votre wallet pour acheter.", wrongNetwork: "Passez à Polygon Mainnet avant d'acheter.", readFirst: "Chargez les données du contrat avant d'acheter.", closed: "Les entrées sont indisponibles pendant la fermeture du tirage.", emergency: "Entrée temporairement indisponible.", priceMismatch: "Les méthodes de prix divergent. Achat désactivé.", insufficientFunds: "Votre wallet doit avoir assez de POL pour le ticket et le gas.", simulationFailed: "La vérification a échoué, achat désactivé.", ready: "Vérification réussie.", confirmTitle: "Confirmer l'achat", confirmBody: "Votre wallet demandera de confirmer une transaction buyTicket().", contract: "Contrat", price: "Prix du ticket", risk: "La participation comporte un risque. Vous pouvez perdre le POL utilisé.", cancel: "Annuler", continue: "Continuer vers le wallet", simulating: "Vérification", awaitingWallet: "Attente du wallet", pending: "Attente de Polygon", success: "Achat confirmé.", failed: "Transaction non terminée.", viewTx: "Voir la transaction" },
    activity: { ...en.activity, title: "Achats récents", subtitle: "Événements TicketBought chargés via votre wallet.", locked: "Connectez votre wallet pour charger l'activité vérifiable.", unavailable: "L'historique est indisponible via ce provider. Vous pouvez consulter le contrat sur PolygonScan.", empty: "Aucun achat de ticket enregistré.", buyer: "Acheteur", round: "Round", price: "Prix", tx: "Transaction", time: "Heure" },
    winners: { ...en.winners, title: "Anciens gagnants", subtitle: "Événements WinnerPicked chargés via votre wallet.", locked: "Connectez votre wallet pour charger les tirages terminés.", empty: "Aucun tirage terminé pour le moment.", winner: "Gagnant", round: "Round", prize: "Prix", tx: "Transaction", time: "Heure" },
    sections: { ...en.sections, howTitle: "Fonctionnement", howSteps: ["Connectez un wallet sur Polygon Mainnet.", "Lisez l'état réel du contrat via ce wallet.", "Achetez exactement un ticket avec buyTicket() si la vérification réussit.", "Consultez l'activité et les gagnants on-chain."], transparencyTitle: "Transparence", transparencyItems: ["Aucune donnée de loterie n'est affichée avant connexion.", "Cagnotte, round, tickets, statut et prix viennent du contrat.", "Les événements de gagnants sont vérifiables quand le contrat les émet.", "L'activité peut être consultée sur PolygonScan."], riskTitle: "Avis de risque", risk: "La participation à une loterie comporte un risque. Vous pouvez perdre le POL utilisé pour acheter un ticket. Participez uniquement là où la loi l'autorise. Ce site ne fournit aucun conseil financier ou juridique.", faqTitle: "FAQ", faq: [["Qu'est-ce que Seren Lottery Chain ?", "Une loterie on-chain sur Polygon."], ["Pourquoi les données sont-elles cachées ?", "Le site utilise seulement le provider du wallet connecté."], ["Combien coûte un ticket ?", "Le prix et la valeur de transaction viennent du contrat."], ["Le message chance prédit-il la loterie ?", "Non. C'est uniquement du divertissement."]] },
    lucky: { ...en.lucky, title: "Message chance", label: "Divertissement uniquement. Cela ne prédit pas les résultats.", close: "Fermer", predictions: { "quiet-door": "Une décision calme peut ouvrir une porte inattendue.", "patient-luck": "La patience peut être une forme de chance.", "look-twice": "Regardez deux fois avant de choisir l'évidence.", "new-connection": "Une nouvelle connexion peut apporter un nouvel élan.", "small-steps": "De petits pas peuvent mener à des moments mémorables.", "trust-process": "Faites confiance au processus, pas à une promesse.", "curious-chapter": "Le prochain chapitre peut commencer par la curiosité.", "careful-attention": "Aujourd'hui récompense l'attention." } },
    footer: { ...en.footer, tagline: "Loterie on-chain sur Polygon", links: "Liens", information: "Informations", contract: "Contrat intelligent" },
  },
  pt: {
    langName: "Português",
    nav: { home: "Início", buy: "Comprar", activity: "Atividade", how: "Como funciona", faq: "FAQ" },
    wallet: { connect: "Conectar carteira", connecting: "Conectando", connected: "Carteira conectada", switch: "Mudar para Polygon", disconnect: "Redefinir sessão", copied: "Endereço copiado", copy: "Copiar endereço", unavailable: "Nenhuma carteira Web3 foi encontrada. Abra em um navegador de carteira ou instale uma carteira injetada.", wrongNetwork: "Mude para Polygon Mainnet para ver dados do contrato.", selectProvider: "Escolha uma carteira", browserWallet: "Carteira do navegador", walletConnect: "WalletConnect", walletConnectUnavailable: "WalletConnect não está configurado para este app.", menu: "Abrir menu", close: "Fechar menu" },
    hero: { eyebrow: "LOTERIA ON-CHAIN · POLYGON", heading: "Seren Lottery Chain", body: "Loteria on-chain na Polygon. Os dados do contrato aparecem somente após conectar a carteira.", contract: "Ver contrato", lucky: "Mensagem da sorte" },
    dashboard: { ...en.dashboard, title: "Sorteio atual", subtitleConnected: "Valores reais carregados pelo provider da sua carteira.", subtitleLocked: "Conecte sua carteira para revelar dados da loteria.", refresh: "Atualizar dados", refreshing: "Atualizando", locked: "Conectar carteira", prizePool: "Prêmio acumulado", currentRound: "Rodada atual", ticketsInDraw: "Total de bilhetes", yourTickets: "Seus bilhetes", ticketPrice: "Preço do bilhete", drawStatus: "Status", open: "Aberto", closed: "Fechado", emergency: "Pausado", normal: "Normal", maxPerRound: "Máx. por rodada", maxPerAddress: "Máx. por endereço", contractReadable: "Estado do contrato legível" },
    purchase: { ...en.purchase, title: "Comprar um bilhete", oneTicket: "Exatamente um bilhete é comprado por transação.", gas: "O gas da rede é pago separadamente.", userTickets: "Seus bilhetes", buy: "Comprar 1 bilhete", buyWithPrice: "Comprar 1 bilhete — {price}", connectFirst: "Conecte sua carteira para comprar.", wrongNetwork: "Mude para Polygon Mainnet antes de comprar.", readFirst: "Carregue os dados do contrato antes de comprar.", closed: "Entradas indisponíveis enquanto o sorteio está fechado.", emergency: "Entrada temporariamente indisponível.", priceMismatch: "Os métodos de preço divergem. Compra desativada.", insufficientFunds: "Sua carteira precisa de POL suficiente para bilhete e gas.", simulationFailed: "A verificação falhou; compra desativada.", ready: "Verificação aprovada.", confirmTitle: "Confirmar compra", confirmBody: "Sua carteira pedirá confirmação de uma transação buyTicket().", contract: "Contrato", price: "Preço", risk: "Participar envolve risco. Você pode perder o POL usado.", cancel: "Cancelar", continue: "Continuar para carteira", simulating: "Verificando", awaitingWallet: "Aguardando carteira", pending: "Aguardando Polygon", success: "Compra confirmada.", failed: "Transação não concluída.", viewTx: "Ver transação" },
    activity: { ...en.activity, title: "Compras recentes", subtitle: "Eventos TicketBought carregados pela carteira.", locked: "Conecte sua carteira para carregar atividade verificável.", unavailable: "O histórico não está disponível por este provider. Você ainda pode ver o contrato no PolygonScan.", empty: "Nenhuma compra registrada.", buyer: "Comprador", round: "Rodada", price: "Preço", tx: "Transação", time: "Hora" },
    winners: { ...en.winners, title: "Vencedores anteriores", subtitle: "Eventos WinnerPicked carregados pela carteira.", locked: "Conecte sua carteira para carregar sorteios concluídos.", empty: "Nenhum sorteio concluído ainda.", winner: "Vencedor", round: "Rodada", prize: "Prêmio", tx: "Transação", time: "Hora" },
    sections: { ...en.sections, howTitle: "Como funciona", howSteps: ["Conecte uma carteira na Polygon Mainnet.", "Leia o estado real do contrato por essa carteira.", "Compre exatamente um bilhete com buyTicket() se a verificação passar.", "Confira atividade e vencedores on-chain."], transparencyTitle: "Transparência", transparencyItems: ["Nenhum dado da loteria aparece antes da conexão.", "Prêmio, rodada, bilhetes, status e preço vêm do contrato.", "Eventos de vencedores são verificáveis quando emitidos pelo contrato.", "A atividade pode ser vista no PolygonScan."], riskTitle: "Aviso de risco", risk: "Participar de loteria envolve risco. Você pode perder o POL usado para comprar um bilhete. Participe apenas onde permitido pela lei aplicável. Este site não oferece aconselhamento financeiro ou jurídico.", faqTitle: "FAQ", faq: [["O que é Seren Lottery Chain?", "Uma loteria on-chain na Polygon."], ["Por que os dados ficam ocultos?", "O site usa apenas o provider da carteira conectada."], ["Quanto custa um bilhete?", "O preço e o valor da transação vêm do contrato."], ["A mensagem da sorte prevê resultados?", "Não. É apenas entretenimento."]] },
    lucky: { ...en.lucky, title: "Mensagem da sorte", label: "Apenas entretenimento. Isto não prevê resultados da loteria.", close: "Fechar", predictions: { "quiet-door": "Uma decisão tranquila pode abrir uma porta inesperada.", "patient-luck": "Paciência também pode ser sorte.", "look-twice": "Olhe duas vezes antes de escolher o caminho óbvio.", "new-connection": "Uma nova conexão pode trazer impulso.", "small-steps": "Pequenos passos podem levar a bons momentos.", "trust-process": "Confie no processo, não em uma promessa.", "curious-chapter": "O próximo capítulo pode começar com curiosidade.", "careful-attention": "Hoje recompensa atenção cuidadosa." } },
    footer: { ...en.footer, tagline: "Loteria on-chain na Polygon", links: "Links", information: "Informações", contract: "Contrato inteligente" },
  },
};

function mergeTranslation(partial: Partial<Translation>): Translation {
  return {
    ...en,
    ...partial,
    nav: { ...en.nav, ...partial.nav },
    wallet: { ...en.wallet, ...partial.wallet },
    hero: { ...en.hero, ...partial.hero },
    dashboard: { ...en.dashboard, ...partial.dashboard },
    purchase: { ...en.purchase, ...partial.purchase },
    activity: { ...en.activity, ...partial.activity },
    winners: { ...en.winners, ...partial.winners },
    sections: { ...en.sections, ...partial.sections },
    lucky: {
      ...en.lucky,
      ...partial.lucky,
      predictions: { ...en.lucky.predictions, ...partial.lucky?.predictions },
    },
    footer: { ...en.footer, ...partial.footer },
    misc: { ...en.misc, ...partial.misc },
    errors: { ...en.errors, ...partial.errors },
  };
}

export const translations: Record<Language, Translation> = {
  en,
  ru: mergeTranslation(dictionaries.ru),
  es: mergeTranslation(dictionaries.es),
  "zh-CN": mergeTranslation(dictionaries["zh-CN"]),
  hi: mergeTranslation(dictionaries.hi),
  ar: mergeTranslation(dictionaries.ar),
  fr: mergeTranslation(dictionaries.fr),
  pt: mergeTranslation(dictionaries.pt),
};

export function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("seren.lang");
  if (stored && languages.includes(stored as Language)) return stored as Language;

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = browserLanguages
    .map((value) => value.toLowerCase())
    .map((value) => {
      if (value.startsWith("zh")) return "zh-CN";
      return languages.find((language) => value === language.toLowerCase() || value.startsWith(`${language.toLowerCase()}-`));
    })
    .find(Boolean);

  return (match as Language) || "en";
}
