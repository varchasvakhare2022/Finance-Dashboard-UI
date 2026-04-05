import { ArrowRight, ReceiptIndianRupee, TrendingDown, TrendingUp } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  filterTransactionsByDateRange,
  formatCurrency,
  formatLongDate,
  formatSignedCurrency,
  getCategoryBreakdown,
  getDailySeries,
  getNetTotal,
  getOverviewMetrics,
} from "../../utils/finance";
import { DashboardSkeleton } from "../ui/LoadingSkeletons";
import { Surface } from "../ui/Surface";
import { BalanceChart } from "./BalanceChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { SummaryCard } from "./SummaryCard";

export function DashboardView({ isLoading }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const setDateRange = useFinanceStore((state) => state.setDateRange);
  const selectedCategory = useFinanceStore((state) => state.filters.category);
  const setCategoryFilter = useFinanceStore((state) => state.setCategoryFilter);
  const setActiveView = useFinanceStore((state) => state.setActiveView);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const overviewMetrics = getOverviewMetrics(transactions, dateRange);
  const balanceSeries = getDailySeries(transactions, dateRange, "balance");
  const categoryBreakdown = getCategoryBreakdown(transactions, dateRange);
  const rangeTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const netFlow = getNetTotal(rangeTransactions);
  const largestExpense = [...rangeTransactions]
    .filter((transaction) => transaction.type === "expense")
    .sort((left, right) => right.amount - left.amount)[0];
  const largestIncome = [...rangeTransactions]
    .filter((transaction) => transaction.type === "income")
    .sort((left, right) => right.amount - left.amount)[0];

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    setActiveView("transactions");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {overviewMetrics.map((metric) => (
          <SummaryCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
        <BalanceChart
          data={balanceSeries}
          dateRange={dateRange}
          onRangeChange={setDateRange}
          netFlow={netFlow}
        />
        <CategoryBreakdown
          categories={categoryBreakdown}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryClick}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Surface className="px-5 py-5 animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-soft/80 text-danger">
              <TrendingDown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Largest outflow</p>
              <p className="text-sm text-muted">Highest expense in the selected window</p>
            </div>
          </div>
          <div className="mt-5 space-y-1">
            <p className="text-xl font-bold text-ink">{largestExpense?.description ?? "No expense in range"}</p>
            <p className="text-sm text-muted">
              {largestExpense
                ? `${formatCurrency(largestExpense.amount)} on ${formatLongDate(largestExpense.date)}`
                : "Expand the range to inspect activity."}
            </p>
          </div>
        </Surface>

        <Surface className="px-5 py-5 animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft/80 text-accent">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Strongest inflow</p>
              <p className="text-sm text-muted">Largest income event in the selected window</p>
            </div>
          </div>
          <div className="mt-5 space-y-1">
            <p className="text-xl font-bold text-ink">{largestIncome?.description ?? "No income in range"}</p>
            <p className="text-sm text-muted">
              {largestIncome
                ? `${formatCurrency(largestIncome.amount)} on ${formatLongDate(largestIncome.date)}`
                : "Try switching to 30d or 90d to compare inflows."}
            </p>
          </div>
        </Surface>

        <Surface className="px-5 py-5 animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning-soft/80 text-warning">
              <ReceiptIndianRupee className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Active focus</p>
              <p className="text-sm text-muted">Quick jump into filtered transactions</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <p className="text-xl font-bold text-ink">
              {selectedCategory === "All" ? "All categories" : selectedCategory}
            </p>
            <p className="text-sm leading-6 text-muted">
              {selectedCategory === "All"
                ? `${formatSignedCurrency(netFlow, true)} net across the current range.`
                : `Transactions are ready to open with the ${selectedCategory} filter applied.`}
            </p>
            <button
              type="button"
              onClick={() => setActiveView("transactions")}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Open ledger
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Surface>
      </div>
    </div>
  );
}
