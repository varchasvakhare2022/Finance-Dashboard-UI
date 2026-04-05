export const DATE_RANGE_OPTIONS = [
  { label: "7d", value: "7d", days: 7 },
  { label: "30d", value: "30d", days: 30 },
  { label: "90d", value: "90d", days: 90 },
];

export const ROLE_OPTIONS = [
  { label: "Viewer", value: "viewer" },
  { label: "Admin", value: "admin" },
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

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
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

function getPercentChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
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
      runningBalance += netByDay.get(key) ?? 0;
      days.push({
        date: key,
        label: formatDayMonth(cursor),
        value: runningBalance,
      });
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
    days.push({
      date: key,
      label: formatDayMonth(cursor),
      value: totalsByDay.get(key) ?? 0,
    });
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
  const expenses = filterTransactionsByDateRange(transactions, range, referenceDate).filter(
    (transaction) => transaction.type === "expense",
  );

  const totals = new Map();
  expenses.forEach((transaction) => {
    totals.set(
      transaction.category,
      (totals.get(transaction.category) ?? 0) + transaction.amount,
    );
  });

  const total = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  return Array.from(totals.entries())
    .map(([category, value]) => ({
      category,
      value,
      share: total === 0 ? 0 : value / total,
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
  const previousMonthEnd = addDays(currentMonthStart, -1);

  const currentMonthTransactions = filterTransactionsByWindow(
    transactions,
    currentMonthStart,
    currentDate,
  );
  const previousMonthTransactions = filterTransactionsByWindow(
    transactions,
    previousMonthStart,
    previousMonthEnd,
  );

  const currentIncome = getTypeTotal(currentMonthTransactions, "income");
  const previousIncome = getTypeTotal(previousMonthTransactions, "income");
  const currentExpenses = getTypeTotal(currentMonthTransactions, "expense");
  const previousExpenses = getTypeTotal(previousMonthTransactions, "expense");

  return {
    currentLabel: formatMonth(currentDate),
    previousLabel: formatMonth(previousMonthStart),
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

export function getInsights(transactions, referenceDate = new Date()) {
  const comparison = getMonthlyComparison(transactions, referenceDate);

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

  const allCategories = [...new Set([...currentExpenseMap.keys(), ...previousExpenseMap.keys()])];
  const categoryDiffs = allCategories
    .map((category) => {
      const current = currentExpenseMap.get(category) ?? 0;
      const previous = previousExpenseMap.get(category) ?? 0;
      return {
        category,
        current,
        previous,
        change: getPercentChange(current, previous),
      };
    })
    .sort((left, right) => right.current - left.current);

  const highestSpend = categoryDiffs[0] ?? {
    category: "No spending",
    current: 0,
    previous: 0,
    change: 0,
  };
  const notableIncrease =
    [...categoryDiffs]
      .filter((item) => item.current > 0)
      .sort((left, right) => right.change - left.change)[0] ?? highestSpend;

  const weekendSpendCurrent = comparison.currentTransactions
    .filter((transaction) => transaction.type === "expense" && isWeekend(transaction.date))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const weekendSpendPrevious = comparison.previousTransactions
    .filter((transaction) => transaction.type === "expense" && isWeekend(transaction.date))
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const topExpenseShare =
    comparison.current.expenses === 0
      ? 0
      : (highestSpend.current / comparison.current.expenses) * 100;

  const savingsRate =
    comparison.current.income === 0
      ? 0
      : (comparison.current.net / comparison.current.income) * 100;

  return {
    heroTitle:
      comparison.current.net >= 0
        ? "Cash flow stayed comfortably ahead of spend"
        : "Expenses briefly outpaced income this month",
    heroText:
      comparison.current.net >= 0
        ? `${formatCurrency(comparison.current.net)} net retained in ${comparison.currentLabel}, keeping savings rate at ${formatPercent(Math.abs(savingsRate))}.`
        : `${formatCurrency(Math.abs(comparison.current.net))} more went out than came in during ${comparison.currentLabel}.`,
    cards: [
      {
        id: "highest-spend",
        icon: "landmark",
        title: "Highest spending category",
        value: highestSpend.category,
        detail: `${formatCurrency(highestSpend.current)} spent, representing ${formatPercent(topExpenseShare)} of this month's outflow.`,
        tone: "violet",
      },
      {
        id: "monthly-shift",
        icon: comparison.changes.expenses > 0 ? "trending-up" : "trending-down",
        title: "Monthly comparison",
        value: `${comparison.changes.expenses > 0 ? "+" : ""}${formatPercent(comparison.changes.expenses)}`,
        detail: `Expenses ${comparison.changes.expenses > 0 ? "increased" : "decreased"} versus ${comparison.previousLabel}.`,
        tone: comparison.changes.expenses > 0 ? "rose" : "emerald",
      },
      {
        id: "smart-observation",
        icon: "sparkles",
        title: "Smart observation",
        value: notableIncrease.category,
        detail: `${notableIncrease.category} spending ${notableIncrease.change >= 0 ? "rose" : "fell"} ${formatPercent(Math.abs(notableIncrease.change))} vs last month.`,
        tone: "amber",
      },
      {
        id: "weekend-pulse",
        icon: "calendar",
        title: "Weekend pulse",
        value: formatCurrency(weekendSpendCurrent),
        detail: `Weekend spending ${weekendSpendCurrent >= weekendSpendPrevious ? "ran hotter" : "cooled down"} by ${formatPercent(Math.abs(getPercentChange(weekendSpendCurrent, weekendSpendPrevious)))}.`,
        tone: "sky",
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
      `${highestSpend.category} remains the largest cost center in ${comparison.currentLabel}.`,
      comparison.current.net >= 0
        ? "Recurring income is still more than enough to absorb fixed costs."
        : "The current spend pace should be moderated to protect monthly runway.",
      weekendSpendCurrent > weekendSpendPrevious
        ? "Weekend discretionary spend is worth watching if you want to tighten savings."
        : "Weekend spending is improving and leaving more room for savings.",
    ],
  };
}
