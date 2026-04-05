export const DATE_RANGE_OPTIONS = [
  { label: "7d", value: "7d", days: 7 },
  { label: "30d", value: "30d", days: 30 },
  { label: "90d", value: "90d", days: 90 },
];

export const ROLE_OPTIONS = [
  { label: "Viewer", value: "viewer" },
  { label: "Admin", value: "admin" },
];

export const DASHBOARD_MODE_OPTIONS = [
  { label: "Savings Focus", value: "savings" },
  { label: "Spending Focus", value: "spending" },
];

export const CATEGORY_META = {
  Salary: {
    dot: "#0f766e",
    badge: "bg-accent-soft/80 text-accent",
  },
  Freelance: {
    dot: "#14b8a6",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  },
  Housing: {
    dot: "#7c3aed",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  Food: {
    dot: "#f97316",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  Groceries: {
    dot: "#84cc16",
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  },
  Transport: {
    dot: "#0284c7",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  },
  Utilities: {
    dot: "#eab308",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  Subscriptions: {
    dot: "#ef4444",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  },
  Travel: {
    dot: "#2563eb",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  Entertainment: {
    dot: "#db2777",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
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
      title: "Total Balance",
      value: currentBalance,
      trend: describeTrend(currentBalance, previousBalance, "balance"),
      sparkline: getDailySeries(transactions, range, "balance", referenceDate).slice(-12),
      accent: "emerald",
      detail: `${formatSignedCurrency(getNetTotal(currentTransactions), true)} net this period`,
    },
    {
      id: "income",
      title: "Income",
      value: currentIncome,
      trend: describeTrend(currentIncome, previousIncome, "income"),
      sparkline: getDailySeries(transactions, range, "income", referenceDate).slice(-12),
      accent: "cyan",
      detail: "Salary, bonus, and freelance inflows",
    },
    {
      id: "expenses",
      title: "Expenses",
      value: currentExpenses,
      trend: describeTrend(currentExpenses, previousExpenses, "expense"),
      sparkline: getDailySeries(transactions, range, "expense", referenceDate).slice(-12),
      accent: "rose",
      detail: "Operating spend across daily categories",
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
  let summary = "Expense pressure is crowding out savings and weakening resilience.";

  if (score >= 78) {
    label = "Good";
    tone = "positive";
    summary = "Income coverage and savings discipline are keeping the dashboard in a healthy zone.";
  } else if (score >= 55) {
    label = "Warning";
    tone = "warning";
    summary = "The overall picture is workable, but a few spending behaviors need closer attention.";
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
        title: "Income coverage",
        value: formatFactor(expenseCoverage),
        detail: "How comfortably income absorbs expense run rate.",
        tone: expenseCoverage >= 1.2 ? "positive" : "warning",
      },
      {
        id: "savings",
        title: "Savings rate",
        value: formatPercent(savingsRate),
        detail:
          savingsRate >= 20
            ? "Above the recommended 20% savings threshold."
            : "Below the recommended 20% savings threshold.",
        tone: savingsRate >= 20 ? "positive" : "warning",
      },
      {
        id: "stability",
        title: "Spending spikes",
        value: spikes.length ? `${spikes.length} flagged` : "Stable",
        detail: spikes.length
          ? "Lumpy expense days are pulling the score down."
          : "No unusual spikes were detected in this window.",
        tone: spikes.length ? "warning" : "positive",
      },
    ],
    recommendation:
      savingsRate < 20
        ? "Push savings above 20% to restore healthy monthly slack."
        : spikes.length
          ? "Smooth out large spend days to reduce volatility in the score."
          : "The current cash profile is stable enough to keep investing in longer-term goals.",
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
      title: "Unusual spending spike detected",
      detail: `${formatLongDate(spike.date)} recorded ${formatCurrency(spike.value)}, or ${formatPercent((spike.intensity - 1) * 100)} above a typical expense day.`,
      actionLabel: "Review day",
      target: { type: "day", value: spike.date },
    });
  }

  if (health.savingsRate < 20) {
    alerts.push({
      id: "savings-rate",
      tone: "warning",
      icon: "piggy-bank",
      title: "You are saving less than recommended",
      detail: `Savings rate is ${formatPercent(health.savingsRate)} against the recommended 20% benchmark.`,
      actionLabel: "Review spending",
      target: { type: "view", value: "insights" },
    });
  }

  if (comparison.changes.expenses > 14) {
    alerts.push({
      id: "expense-velocity",
      tone: "critical",
      icon: "activity",
      title: "Expense run-rate is accelerating",
      detail: `Spending is ${formatPercent(comparison.changes.expenses)} above the same point last month.`,
      actionLabel: "Open insights",
      target: { type: "view", value: "insights" },
    });
  }

  if (topCategory && topCategory.share >= 0.3) {
    alerts.push({
      id: "category-concentration",
      tone: "warning",
      icon: "chart-pie",
      title: `${topCategory.category} is dominating spend`,
      detail: `${topCategory.category} accounts for ${formatPercent(topCategory.share * 100)} of current expenses.`,
      actionLabel: "Inspect category",
      target: { type: "category", value: topCategory.category },
    });
  }

  const reserveThreshold = Math.max(100000, currentExpenses * 1.3);
  if (health.currentBalance < reserveThreshold) {
    alerts.push({
      id: "balance-threshold",
      tone: "critical",
      icon: "wallet",
      title: "Balance dropped below comfort threshold",
      detail: `Current balance is ${formatCurrency(health.currentBalance)} against a comfort threshold of ${formatCurrency(reserveThreshold)}.`,
      actionLabel: "Review ledger",
      target: { type: "view", value: "transactions" },
    });
  }

  if (!alerts.length) {
    alerts.push({
      id: "all-clear",
      tone: "positive",
      icon: "shield-check",
      title: "Cash position looks stable",
      detail: "No balance stress or unusual spending spikes were detected in the selected range.",
      actionLabel: "Open insights",
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
      ? `${topCategory.category} is the largest pressure point right now`
      : health.savingsRate >= 20
        ? "Savings momentum is holding above the healthy zone"
        : "Savings discipline needs attention before spend grows further";

  const heroText =
    dashboardMode === "spending"
      ? `${topCategory.category} represents ${formatPercent(topCategory.share * 100)} of expense outflow in the selected range, while overall spend is ${comparison.changes.expenses >= 0 ? "up" : "down"} ${formatPercent(Math.abs(comparison.changes.expenses))} versus the same point last month.`
      : `Financial health is ${health.score}/100 with a ${formatPercent(health.savingsRate)} savings rate. ${health.recommendation}`;

  return {
    heroTitle,
    heroText,
    health,
    alerts,
    cards: [
      {
        id: "expenses-change",
        icon: comparison.changes.expenses >= 0 ? "trending-up" : "trending-down",
        title: "Spending vs last month",
        value: `${comparison.changes.expenses >= 0 ? "+" : ""}${formatPercent(comparison.changes.expenses)}`,
        detail: `Spending ${comparison.changes.expenses >= 0 ? "increased" : "decreased"} compared to the same point last month.`,
        tone: comparison.changes.expenses >= 0 ? "rose" : "emerald",
      },
      {
        id: "category-share",
        icon: "chart-pie",
        title: "Category concentration",
        value: `${topCategory.category} ${formatPercent(topCategory.share * 100)}`,
        detail: `${topCategory.category} is ${formatPercent(topCategory.share * 100)} of total expenses in the selected range.`,
        tone: "violet",
      },
      {
        id: "savings-target",
        icon: health.savingsRate >= 20 ? "shield-check" : "piggy-bank",
        title: "Savings target",
        value: formatPercent(health.savingsRate),
        detail:
          health.savingsRate >= 20
            ? "Savings is running above the recommended 20% threshold."
            : `You are saving ${formatPercent(20 - health.savingsRate)} below the recommended 20% threshold.`,
        tone: health.savingsRate >= 20 ? "emerald" : "amber",
      },
      {
        id: "health-score",
        icon: "activity",
        title: "Financial health score",
        value: `${health.score}/100`,
        detail: `${health.label} status based on coverage, savings, and spending stability.`,
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
      `Spending changed ${comparison.changes.expenses >= 0 ? "up" : "down"} ${formatPercent(Math.abs(comparison.changes.expenses))} compared to last month.`,
      foodCategory
        ? `Food category is ${formatPercent(foodCategory.share * 100)} of total expenses in the selected range.`
        : `${topCategory.category} is the single largest category at ${formatPercent(topCategory.share * 100)} of expenses.`,
      health.savingsRate >= 20
        ? `Savings rate is holding above the recommended 20% floor at ${formatPercent(health.savingsRate)}.`
        : `You are saving less than recommended at ${formatPercent(health.savingsRate)} versus the 20% goal.`,
    ],
  };
}
