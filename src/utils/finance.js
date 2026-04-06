export const DATE_RANGE_OPTIONS = [
  { label: "7d", value: "7d", days: 7 },
  { label: "30d", value: "30d", days: 30 },
  { label: "90d", value: "90d", days: 90 },
];

export const ROLE_OPTIONS = [
  { label: "View only", value: "viewer" },
  { label: "Can edit", value: "admin" },
];

export const DASHBOARD_MODE_OPTIONS = [
  { label: "Save more", value: "savings" },
  { label: "Watch spending", value: "spending" },
];

export const CHART_MODE_OPTIONS = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
  { label: "Net", value: "net" },
];

export const CATEGORY_META = {
  Salary: {
    dot: "#0f766e",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Freelance: {
    dot: "#14b8a6",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Housing: {
    dot: "#7c3aed",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Food: {
    dot: "#f97316",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Groceries: {
    dot: "#84cc16",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Transport: {
    dot: "#0284c7",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Utilities: {
    dot: "#eab308",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Subscriptions: {
    dot: "#ef4444",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Travel: {
    dot: "#2563eb",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
  Entertainment: {
    dot: "#db2777",
    badge: "border border-line/70 bg-surface-strong/90 text-ink",
  },
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 1,
});

const ratioFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 1,
});

const fullDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  year: "numeric",
});

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatCurrency(value, compact = false) {
  const formatter = compact ? compactCurrencyFormatter : currencyFormatter;
  return formatter.format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value) {
  return `${percentFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

export function formatFactor(value) {
  return `${ratioFormatter.format(Number.isFinite(value) ? value : 0)}x`;
}

export function formatSignedCurrency(value, compact = false) {
  const absolute = formatCurrency(Math.abs(value), compact);
  return `${value >= 0 ? "+" : "-"}${absolute}`;
}

export function stripTime(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function parseDate(value) {
  if (value instanceof Date) {
    return stripTime(value);
  }

  const [year, month, day] = String(value).split("-").map(Number);
  return stripTime(new Date(year, month - 1, day));
}

export function addDays(date, days) {
  const next = stripTime(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toDateKey(date) {
  const parsed = stripTime(date);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

export function formatLongDate(value) {
  return fullDateFormatter.format(parseDate(value));
}

export function formatDayMonth(value) {
  return shortDateFormatter.format(parseDate(value));
}

export function formatMonth(value) {
  return monthFormatter.format(parseDate(value));
}

export function formatRelativeTime(value, referenceDate = new Date()) {
  if (!value) {
    return "just now";
  }

  const diffMs = referenceDate.getTime() - new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function getRangeDays(range) {
  return DATE_RANGE_OPTIONS.find((option) => option.value === range)?.days ?? 30;
}

export function getRangeWindow(range, referenceDate = new Date()) {
  const end = stripTime(referenceDate);
  const days = getRangeDays(range);
  const start = addDays(end, -(days - 1));
  return { start, end };
}

export function getPreviousWindow(range, referenceDate = new Date()) {
  const { start } = getRangeWindow(range, referenceDate);
  const days = getRangeDays(range);
  return {
    start: addDays(start, -days),
    end: addDays(start, -1),
  };
}

export function isWeekend(dateValue) {
  const day = parseDate(dateValue).getDay();
  return day === 0 || day === 6;
}

export function filterTransactionsByWindow(transactions, start, end) {
  return transactions.filter((transaction) => {
    const date = parseDate(transaction.date);
    return date >= start && date <= end;
  });
}

export function filterTransactionsByDateRange(
  transactions,
  range,
  referenceDate = new Date(),
) {
  const { start, end } = getRangeWindow(range, referenceDate);
  return filterTransactionsByWindow(transactions, start, end);
}

export function sortTransactions(
  transactions,
  sortBy = "date",
  sortDirection = "desc",
) {
  const multiplier = sortDirection === "asc" ? 1 : -1;

  return [...transactions].sort((left, right) => {
    if (sortBy === "amount") {
      return (left.amount - right.amount) * multiplier;
    }

    if (sortBy === "description") {
      return left.description.localeCompare(right.description) * multiplier;
    }

    if (sortBy === "category") {
      return left.category.localeCompare(right.category) * multiplier;
    }

    return (parseDate(left.date) - parseDate(right.date)) * multiplier;
  });
}

export function filterAndSortTransactions(
  transactions,
  filters,
  range,
  referenceDate = new Date(),
) {
  let next = filterTransactionsByDateRange(transactions, range, referenceDate);
  const query = filters.search.trim().toLowerCase();

  if (query) {
    next = next.filter((transaction) =>
      `${transaction.description} ${transaction.category}`
        .toLowerCase()
        .includes(query),
    );
  }

  if (filters.category && filters.category !== "All") {
    next = next.filter((transaction) => transaction.category === filters.category);
  }

  if (filters.day && filters.day !== "All") {
    next = next.filter((transaction) => transaction.date === filters.day);
  }

  return sortTransactions(next, filters.sortBy, filters.sortDirection);
}

export function getSignedAmount(transaction) {
  return transaction.type === "income" ? transaction.amount : -transaction.amount;
}

export function getNetTotal(transactions) {
  return transactions.reduce((sum, transaction) => sum + getSignedAmount(transaction), 0);
}

export function getTypeTotal(transactions, type) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getPercentChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

function buildSeriesPoint(dateKey, label, value, previousValue) {
  return {
    date: dateKey,
    label,
    value,
    delta: value - previousValue,
    changePercent: getPercentChange(value, previousValue),
  };
}

function describeTrend(current, previous, kind) {
  const delta = current - previous;
  const direction = delta >= 0 ? "up" : "down";
  const percentage = Math.abs(getPercentChange(current, previous));
  const tone =
    kind === "expense"
      ? delta <= 0
        ? "positive"
        : "negative"
      : delta >= 0
        ? "positive"
        : "negative";

  return {
    delta,
    direction,
    percentage,
    tone,
  };
}

export function getDailySeries(transactions, range, metric, referenceDate = new Date()) {
  const { start, end } = getRangeWindow(range, referenceDate);
  const days = [];

  if (metric === "balance") {
    const openingBalance = transactions
      .filter((transaction) => parseDate(transaction.date) < start)
      .reduce((sum, transaction) => sum + getSignedAmount(transaction), 0);

    const netByDay = new Map();
    transactions.forEach((transaction) => {
      const date = parseDate(transaction.date);
      if (date < start || date > end) {
        return;
      }

      const key = toDateKey(date);
      netByDay.set(key, (netByDay.get(key) ?? 0) + getSignedAmount(transaction));
    });

    let runningBalance = openingBalance;
    for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
      const key = toDateKey(cursor);
      const previousValue = days.length ? days[days.length - 1].value : openingBalance;
      runningBalance += netByDay.get(key) ?? 0;
      days.push(buildSeriesPoint(key, formatDayMonth(cursor), runningBalance, previousValue));
    }

    return days;
  }

  const totalsByDay = new Map();
  transactions.forEach((transaction) => {
    const date = parseDate(transaction.date);
    if (date < start || date > end) {
      return;
    }

    const matchesMetric =
      (metric === "income" && transaction.type === "income") ||
      (metric === "expense" && transaction.type === "expense");

    if (!matchesMetric) {
      return;
    }

    const key = toDateKey(date);
    totalsByDay.set(key, (totalsByDay.get(key) ?? 0) + transaction.amount);
  });

  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    const key = toDateKey(cursor);
    const value = totalsByDay.get(key) ?? 0;
    const previousValue = days.length ? days[days.length - 1].value : 0;
    days.push(buildSeriesPoint(key, formatDayMonth(cursor), value, previousValue));
  }

  return days;
}

export function getOverviewMetrics(transactions, range, referenceDate = new Date()) {
  const currentWindow = getRangeWindow(range, referenceDate);
  const previousWindow = getPreviousWindow(range, referenceDate);

  const currentTransactions = filterTransactionsByWindow(
    transactions,
    currentWindow.start,
    currentWindow.end,
  );
  const previousTransactions = filterTransactionsByWindow(
    transactions,
    previousWindow.start,
    previousWindow.end,
  );

  const currentIncome = getTypeTotal(currentTransactions, "income");
  const previousIncome = getTypeTotal(previousTransactions, "income");
  const currentExpenses = getTypeTotal(currentTransactions, "expense");
  const previousExpenses = getTypeTotal(previousTransactions, "expense");

  const currentBalance = transactions
    .filter((transaction) => parseDate(transaction.date) <= currentWindow.end)
    .reduce((sum, transaction) => sum + getSignedAmount(transaction), 0);
  const previousBalance = transactions
    .filter((transaction) => parseDate(transaction.date) <= previousWindow.end)
    .reduce((sum, transaction) => sum + getSignedAmount(transaction), 0);

  return [
    {
      id: "balance",
      title: "Balance",
      value: currentBalance,
      trend: describeTrend(currentBalance, previousBalance, "balance"),
      sparkline: getDailySeries(transactions, range, "balance", referenceDate).slice(-12),
      accent: "emerald",
      detail: `${formatSignedCurrency(getNetTotal(currentTransactions), true)} left after everything`,
    },
    {
      id: "income",
      title: "Money coming in",
      value: currentIncome,
      trend: describeTrend(currentIncome, previousIncome, "income"),
      sparkline: getDailySeries(transactions, range, "income", referenceDate).slice(-12),
      accent: "cyan",
      detail: "Paychecks and other incoming money",
    },
    {
      id: "expenses",
      title: "Money going out",
      value: currentExpenses,
      trend: describeTrend(currentExpenses, previousExpenses, "expense"),
      sparkline: getDailySeries(transactions, range, "expense", referenceDate).slice(-12),
      accent: "rose",
      detail: "Bills, food, travel, and everything else",
    },
  ];
}

export function getCategoryBreakdown(transactions, range, referenceDate = new Date()) {
  const currentWindow = getRangeWindow(range, referenceDate);
  const previousWindow = getPreviousWindow(range, referenceDate);

  const currentExpenses = filterTransactionsByWindow(
    transactions,
    currentWindow.start,
    currentWindow.end,
  ).filter((transaction) => transaction.type === "expense");
  const previousExpenses = filterTransactionsByWindow(
    transactions,
    previousWindow.start,
    previousWindow.end,
  ).filter((transaction) => transaction.type === "expense");

  const currentTotals = new Map();
  const previousTotals = new Map();

  currentExpenses.forEach((transaction) => {
    currentTotals.set(
      transaction.category,
      (currentTotals.get(transaction.category) ?? 0) + transaction.amount,
    );
  });

  previousExpenses.forEach((transaction) => {
    previousTotals.set(
      transaction.category,
      (previousTotals.get(transaction.category) ?? 0) + transaction.amount,
    );
  });

  const total = Array.from(currentTotals.values()).reduce((sum, value) => sum + value, 0);

  return Array.from(currentTotals.entries())
    .map(([category, value]) => ({
      category,
      value,
      share: total === 0 ? 0 : value / total,
      change: getPercentChange(value, previousTotals.get(category) ?? 0),
      color: CATEGORY_META[category]?.dot ?? "#64748b",
    }))
    .sort((left, right) => right.value - left.value);
}

export function getCategories(transactions) {
  return ["All", ...new Set(transactions.map((transaction) => transaction.category))];
}

export function getMonthlyComparison(transactions, referenceDate = new Date()) {
  const currentDate = parseDate(referenceDate);
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const previousMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );
  const currentDaysElapsed = currentDate.getDate();
  const previousMonthLength = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  ).getDate();
  const previousComparisonEnd = new Date(
    previousMonthStart.getFullYear(),
    previousMonthStart.getMonth(),
    Math.min(currentDaysElapsed, previousMonthLength),
  );

  const currentMonthTransactions = filterTransactionsByWindow(
    transactions,
    currentMonthStart,
    currentDate,
  );
  const previousMonthTransactions = filterTransactionsByWindow(
    transactions,
    previousMonthStart,
    previousComparisonEnd,
  );

  const currentIncome = getTypeTotal(currentMonthTransactions, "income");
  const previousIncome = getTypeTotal(previousMonthTransactions, "income");
  const currentExpenses = getTypeTotal(currentMonthTransactions, "expense");
  const previousExpenses = getTypeTotal(previousMonthTransactions, "expense");

  return {
    currentLabel: `${formatMonth(currentDate)} MTD`,
    previousLabel: `${formatMonth(previousMonthStart)} MTD`,
    current: {
      income: currentIncome,
      expenses: currentExpenses,
      net: currentIncome - currentExpenses,
    },
    previous: {
      income: previousIncome,
      expenses: previousExpenses,
      net: previousIncome - previousExpenses,
    },
    changes: {
      income: getPercentChange(currentIncome, previousIncome),
      expenses: getPercentChange(currentExpenses, previousExpenses),
      net: getPercentChange(currentIncome - currentExpenses, previousIncome - previousExpenses),
    },
    currentTransactions: currentMonthTransactions,
    previousTransactions: previousMonthTransactions,
  };
}

export function getHealthScore(transactions, range, referenceDate = new Date()) {
  const currentTransactions = filterTransactionsByDateRange(transactions, range, referenceDate);
  const income = getTypeTotal(currentTransactions, "income");
  const expenses = getTypeTotal(currentTransactions, "expense");
  const net = income - expenses;
  const savingsRate = income === 0 ? 0 : (net / income) * 100;
  const expenseCoverage = expenses === 0 ? (income > 0 ? 2 : 0) : income / expenses;
  const expenseSeries = getDailySeries(transactions, range, "expense", referenceDate);
  const nonZeroExpenseDays = expenseSeries.filter((item) => item.value > 0);
  const averageExpenseDay = average(nonZeroExpenseDays.map((item) => item.value));
  const spikes = nonZeroExpenseDays
    .map((item) => ({
      ...item,
      intensity: averageExpenseDay === 0 ? 0 : item.value / averageExpenseDay,
    }))
    .filter((item) => item.intensity >= 2.3)
    .sort((left, right) => right.intensity - left.intensity);

  const ratioScore = clamp(Math.round((Math.min(expenseCoverage, 2) / 2) * 40), 0, 40);
  const savingsScore = clamp(Math.round((Math.min(Math.max(savingsRate, 0), 25) / 25) * 35), 0, 35);
  const spikePenalty = spikes.slice(0, 3).reduce((sum, item) => sum + Math.min(8, (item.intensity - 2) * 6), 0);
  const stabilityScore = clamp(Math.round(25 - spikePenalty), 0, 25);
  const score = clamp(Math.round(ratioScore + savingsScore + stabilityScore), 0, 100);

  let label = "Critical";
  let tone = "critical";
  let summary = "Things feel a little tight right now.";

  if (score >= 78) {
    label = "Good";
    tone = "positive";
    summary = "You are in a healthy spot right now.";
  } else if (score >= 55) {
    label = "Warning";
    tone = "warning";
    summary = "Mostly okay, but a couple of habits are dragging this down.";
  }

  const currentBalance = getDailySeries(transactions, range, "balance", referenceDate).at(-1)?.value ?? 0;

  return {
    score,
    label,
    tone,
    summary,
    savingsRate,
    expenseCoverage,
    spikes,
    currentBalance,
    factors: [
      {
        id: "coverage",
        title: "Income vs spend",
        value: formatFactor(expenseCoverage),
        detail: "How comfortably your income is covering what goes out.",
        tone: expenseCoverage >= 1.2 ? "positive" : "warning",
      },
      {
        id: "savings",
        title: "What you keep",
        value: formatPercent(savingsRate),
        detail:
          savingsRate >= 20
            ? "You are keeping more than the 20% goal."
            : "You are keeping less than the 20% goal.",
        tone: savingsRate >= 20 ? "positive" : "warning",
      },
      {
        id: "stability",
        title: "Big spend days",
        value: spikes.length ? `${spikes.length} flagged` : "Steady",
        detail: spikes.length
          ? "A few heavy days are doing most of the damage."
          : "Nothing unusually sharp showed up in this window.",
        tone: spikes.length ? "warning" : "positive",
      },
    ],
    recommendation:
      savingsRate < 20
        ? "Try to keep more than 20% of your income untouched."
        : spikes.length
          ? "A few large spend days are swinging the month more than they should."
          : "You have a decent buffer right now, so nothing looks urgent.",
  };
}

export function getAlertFeed(transactions, range, referenceDate = new Date()) {
  const currentTransactions = filterTransactionsByDateRange(transactions, range, referenceDate);
  const currentExpenses = getTypeTotal(currentTransactions, "expense");
  const health = getHealthScore(transactions, range, referenceDate);
  const comparison = getMonthlyComparison(transactions, referenceDate);
  const breakdown = getCategoryBreakdown(transactions, range, referenceDate);
  const topCategory = breakdown[0];
  const alerts = [];

  if (health.spikes.length) {
    const spike = health.spikes[0];
    alerts.push({
      id: "spike",
      tone: "warning",
      icon: "triangle-alert",
      title: "One day of spending jumped",
      detail: `${formatLongDate(spike.date)} came in at ${formatCurrency(spike.value)}, which is ${formatPercent((spike.intensity - 1) * 100)} above a usual spend day.`,
      actionLabel: "See that day",
      target: { type: "day", value: spike.date },
    });
  }

  if (health.savingsRate < 20) {
    alerts.push({
      id: "savings-rate",
      tone: "warning",
      icon: "piggy-bank",
      title: "You are keeping less than planned",
      detail: `Right now you are keeping ${formatPercent(health.savingsRate)} of income, below the 20% goal.`,
      actionLabel: "See why",
      target: { type: "view", value: "insights" },
    });
  }

  if (comparison.changes.expenses > 14) {
    alerts.push({
      id: "expense-velocity",
      tone: "critical",
      icon: "activity",
      title: "Spending is running hotter than last month",
      detail: `You have spent ${formatPercent(comparison.changes.expenses)} more than this point last month.`,
      actionLabel: "See insights",
      target: { type: "view", value: "insights" },
    });
  }

  if (topCategory && topCategory.share >= 0.3) {
    alerts.push({
      id: "category-concentration",
      tone: "warning",
      icon: "chart-pie",
      title: `${topCategory.category} is taking the biggest bite`,
      detail: `${topCategory.category} makes up ${formatPercent(topCategory.share * 100)} of what is going out right now.`,
      actionLabel: "Open category",
      target: { type: "category", value: topCategory.category },
    });
  }

  const reserveThreshold = Math.max(100000, currentExpenses * 1.3);
  if (health.currentBalance < reserveThreshold) {
    alerts.push({
      id: "balance-threshold",
      tone: "critical",
      icon: "wallet",
      title: "Your buffer is getting a bit tight",
      detail: `You are at ${formatCurrency(health.currentBalance)} against a comfort line of ${formatCurrency(reserveThreshold)}.`,
      actionLabel: "Open transactions",
      target: { type: "view", value: "transactions" },
    });
  }

  if (!alerts.length) {
    alerts.push({
      id: "all-clear",
      tone: "positive",
      icon: "shield-check",
      title: "Nothing urgent right now",
      detail: "No unusual swings or obvious pressure points showed up in this range.",
      actionLabel: "See insights",
      target: { type: "view", value: "insights" },
    });
  }

  const severity = {
    critical: 3,
    warning: 2,
    positive: 1,
  };

  return alerts
    .sort((left, right) => severity[right.tone] - severity[left.tone])
    .slice(0, 3);
}

export function getCategoryDrilldown(
  transactions,
  range,
  category,
  referenceDate = new Date(),
) {
  const currentWindow = getRangeWindow(range, referenceDate);
  const previousWindow = getPreviousWindow(range, referenceDate);
  const currentTransactions = filterTransactionsByWindow(
    transactions,
    currentWindow.start,
    currentWindow.end,
  ).filter((transaction) => transaction.category === category);
  const previousTransactions = filterTransactionsByWindow(
    transactions,
    previousWindow.start,
    previousWindow.end,
  ).filter((transaction) => transaction.category === category);

  const sortedTransactions = sortTransactions(currentTransactions, "date", "desc");
  const total = sortedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const previousTotal = previousTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const type = sortedTransactions[0]?.type ?? "expense";
  const peerTotal = filterTransactionsByWindow(transactions, currentWindow.start, currentWindow.end)
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    category,
    type,
    transactions: sortedTransactions,
    total,
    count: sortedTransactions.length,
    average: sortedTransactions.length ? total / sortedTransactions.length : 0,
    share: peerTotal === 0 ? 0 : total / peerTotal,
    change: getPercentChange(total, previousTotal),
    largest: [...sortedTransactions].sort((left, right) => right.amount - left.amount)[0],
    latest: sortedTransactions[0],
  };
}

export function getInsights(
  transactions,
  range = "30d",
  dashboardMode = "savings",
  referenceDate = new Date(),
) {
  const comparison = getMonthlyComparison(transactions, referenceDate);
  const rangeBreakdown = getCategoryBreakdown(transactions, range, referenceDate);
  const health = getHealthScore(transactions, range, referenceDate);
  const alerts = getAlertFeed(transactions, range, referenceDate);
  const topCategory = rangeBreakdown[0] ?? {
    category: "No spending",
    value: 0,
    share: 0,
    change: 0,
  };
  const foodCategory = rangeBreakdown.find((item) => item.category === "Food");

  const currentExpenseMap = new Map();
  const previousExpenseMap = new Map();
  comparison.currentTransactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      currentExpenseMap.set(
        transaction.category,
        (currentExpenseMap.get(transaction.category) ?? 0) + transaction.amount,
      );
    });
  comparison.previousTransactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      previousExpenseMap.set(
        transaction.category,
        (previousExpenseMap.get(transaction.category) ?? 0) + transaction.amount,
      );
    });

  const categoryDiffs = [...new Set([...currentExpenseMap.keys(), ...previousExpenseMap.keys()])]
    .map((category) => ({
      category,
      current: currentExpenseMap.get(category) ?? 0,
      previous: previousExpenseMap.get(category) ?? 0,
      change: getPercentChange(
        currentExpenseMap.get(category) ?? 0,
        previousExpenseMap.get(category) ?? 0,
      ),
    }))
    .sort((left, right) => right.current - left.current);

  const heroTitle =
    dashboardMode === "spending"
      ? `${topCategory.category} is doing most of the damage right now`
      : health.savingsRate >= 20
        ? "You are still keeping a healthy buffer"
        : "You are keeping less than you probably expect";

  const heroText =
    dashboardMode === "spending"
      ? `${topCategory.category} is ${formatPercent(topCategory.share * 100)} of spending in this window, and overall spend is ${comparison.changes.expenses >= 0 ? "up" : "down"} ${formatPercent(Math.abs(comparison.changes.expenses))} from the same point last month.`
      : `Your health score is ${health.score}/100, and you are keeping ${formatPercent(health.savingsRate)} of income. ${health.recommendation}`;

  return {
    heroTitle,
    heroText,
    health,
    alerts,
    cards: [
      {
        id: "expenses-change",
        icon: comparison.changes.expenses >= 0 ? "trending-up" : "trending-down",
        title: "Vs last month",
        value: `${comparison.changes.expenses >= 0 ? "+" : ""}${formatPercent(comparison.changes.expenses)}`,
        detail: "A quick read on whether spending is picking up or easing off.",
        tone: comparison.changes.expenses >= 0 ? "rose" : "emerald",
      },
      {
        id: "category-share",
        icon: "chart-pie",
        title: "Biggest category",
        value: `${topCategory.category} ${formatPercent(topCategory.share * 100)}`,
        detail: `${topCategory.category} is taking the biggest share of spending right now.`,
        tone: "violet",
      },
      {
        id: "savings-target",
        icon: health.savingsRate >= 20 ? "shield-check" : "piggy-bank",
        title: "Saved this month",
        value: formatPercent(health.savingsRate),
        detail:
          health.savingsRate >= 20
            ? "You are above the 20% goal."
            : `You are ${formatPercent(20 - health.savingsRate)} short of the 20% goal.`,
        tone: health.savingsRate >= 20 ? "emerald" : "amber",
      },
      {
        id: "health-score",
        icon: "activity",
        title: "Health score",
        value: `${health.score}/100`,
        detail: `${health.label} based on income cover, money kept, and how spiky spending feels.`,
        tone: health.tone === "positive" ? "emerald" : health.tone === "warning" ? "amber" : "rose",
      },
    ],
    monthlyBars: [
      {
        label: "Income",
        current: comparison.current.income,
        previous: comparison.previous.income,
        change: comparison.changes.income,
      },
      {
        label: "Expenses",
        current: comparison.current.expenses,
        previous: comparison.previous.expenses,
        change: comparison.changes.expenses,
      },
      {
        label: "Net",
        current: comparison.current.net,
        previous: comparison.previous.net,
        change: comparison.changes.net,
      },
    ],
    topCategories: categoryDiffs.slice(0, 4),
    observations: [
      `Spending is ${comparison.changes.expenses >= 0 ? "up" : "down"} ${formatPercent(Math.abs(comparison.changes.expenses))} from last month.`,
      foodCategory
        ? `Food is ${formatPercent(foodCategory.share * 100)} of what is going out in this window.`
        : `${topCategory.category} is the biggest line item at ${formatPercent(topCategory.share * 100)} of spend.`,
      health.savingsRate >= 20
        ? `You are still keeping more than the 20% goal at ${formatPercent(health.savingsRate)}.`
        : `You are keeping ${formatPercent(health.savingsRate)}, which is below the 20% goal.`,
    ],
  };
}




