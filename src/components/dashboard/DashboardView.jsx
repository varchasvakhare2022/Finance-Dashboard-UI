import { ArrowRight, ReceiptIndianRupee, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  filterTransactionsByDateRange,
  formatCurrency,
  formatLongDate,
  formatSignedCurrency,
  getCategoryBreakdown,
  getCategoryDrilldown,
  getDailySeries,
  getHealthScore,
  getInsights,
  getNetTotal,
  getOverviewMetrics,
} from "../../utils/finance";
import { DashboardSkeleton } from "../ui/LoadingSkeletons";
import { Surface } from "../ui/Surface";
import { AlertRail } from "./AlertRail";
import { BalanceChart } from "./BalanceChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { CategoryDrilldownModal } from "./CategoryDrilldownModal";
import { FinancialHealthCard } from "./FinancialHealthCard";
import { SummaryCard } from "./SummaryCard";

export function DashboardView({ isLoading }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const setDateRange = useFinanceStore((state) => state.setDateRange);
  const selectedCategory = useFinanceStore((state) => state.filters.category);
  const dashboardMode = useFinanceStore((state) => state.dashboardMode);
  const setCategoryFilter = useFinanceStore((state) => state.setCategoryFilter);
  const setDayFilter = useFinanceStore((state) => state.setDayFilter);
  const setActiveView = useFinanceStore((state) => state.setActiveView);
  const [drilldownCategory, setDrilldownCategory] = useState(null);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const overviewMetrics = getOverviewMetrics(transactions, dateRange);
  const balanceSeries = getDailySeries(transactions, dateRange, "balance");
  const categoryBreakdown = getCategoryBreakdown(transactions, dateRange);
  const rangeTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const insights = getInsights(transactions, dateRange, dashboardMode);
  const health = getHealthScore(transactions, dateRange);
  const netFlow = getNetTotal(rangeTransactions);
  const largestExpense = [...rangeTransactions]
    .filter((transaction) => transaction.type === "expense")
    .sort((left, right) => right.amount - left.amount)[0];
  const largestIncome = [...rangeTransactions]
    .filter((transaction) => transaction.type === "income")
    .sort((left, right) => right.amount - left.amount)[0];

  const drilldownData = drilldownCategory
    ? getCategoryDrilldown(transactions, dateRange, drilldownCategory)
    : null;

  const handleOpenCategory = (category) => {
    setCategoryFilter(category);
    setDrilldownCategory(category);
  };

  const handleAlertAction = (alert) => {
    if (!alert?.target) {
      return;
    }

    if (alert.target.type === "day") {
      setDayFilter(alert.target.value);
      setActiveView("transactions");
      return;
    }

    if (alert.target.type === "category") {
      handleOpenCategory(alert.target.value);
      return;
    }

    if (alert.target.type === "view") {
      setActiveView(alert.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Surface strong className="overflow-hidden px-5 py-5 animate-fade-up">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{dashboardMode === "spending" ? "Spending focus" : "Savings focus"}</p>
              <h3 className="mt-2 font-display text-4xl font-bold leading-tight text-ink">
                {insights.heroTitle}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{insights.heroText}</p>
            </div>

            <div className="rounded-[24px] border border-line/80 bg-surface/70 px-4 py-3 xl:max-w-[240px]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Current net flow</p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">{formatSignedCurrency(netFlow, true)}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {dashboardMode === "spending"
                  ? "Use this mode to isolate categories and days where spend is running hot."
                  : "Use this mode to watch how much room is left for healthy savings."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {insights.observations.map((observation) => (
              <div key={observation} className="rounded-[24px] border border-line/80 bg-surface/75 p-4 text-sm leading-6 text-ink">
                {observation}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveView("insights")}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Open insights
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView("transactions")}
              className="inline-flex items-center gap-2 rounded-full border border-line/80 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent/30 hover:text-accent"
            >
              Open ledger
            </button>
          </div>
        </Surface>

        <FinancialHealthCard
          health={health}
          dashboardMode={dashboardMode}
          onOpenInsights={() => setActiveView("insights")}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {overviewMetrics.map((metric) => (
          <SummaryCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <BalanceChart
          data={balanceSeries}
          dateRange={dateRange}
          onRangeChange={setDateRange}
          netFlow={netFlow}
          onPointSelect={(day) => {
            setDayFilter(day);
            setActiveView("transactions");
          }}
        />
        <AlertRail alerts={insights.alerts} onAction={handleAlertAction} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <CategoryBreakdown
          categories={categoryBreakdown}
          selectedCategory={selectedCategory}
          onSelectCategory={handleOpenCategory}
        />

        <Surface className="space-y-4 px-5 py-5 animate-fade-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Decision support</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Fastest paths to action</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep the biggest inflow, outflow, and active ledger focus in view while you investigate patterns.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] border border-line/80 bg-surface-strong/75 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-soft/80 text-danger">
                  <TrendingDown className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Largest outflow</p>
                  <p className="text-sm text-muted">
                    {largestExpense
                      ? `${formatCurrency(largestExpense.amount)} on ${formatLongDate(largestExpense.date)}`
                      : "No expense in the selected range."}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base font-semibold text-ink">{largestExpense?.description ?? "Expand the range to inspect activity."}</p>
            </div>

            <div className="rounded-[24px] border border-line/80 bg-surface-strong/75 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft/80 text-accent">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Strongest inflow</p>
                  <p className="text-sm text-muted">
                    {largestIncome
                      ? `${formatCurrency(largestIncome.amount)} on ${formatLongDate(largestIncome.date)}`
                      : "No income in the selected range."}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base font-semibold text-ink">{largestIncome?.description ?? "Try a wider range for better context."}</p>
            </div>

            <div className="rounded-[24px] border border-line/80 bg-surface-strong/75 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning-soft/80 text-warning">
                  <ReceiptIndianRupee className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Active ledger focus</p>
                  <p className="text-sm text-muted">
                    {selectedCategory === "All"
                      ? "No category filter is currently pinned."
                      : `${selectedCategory} is pinned for transaction filtering.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveView("transactions")}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
              >
                Open ledger
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Surface>
      </div>

      <CategoryDrilldownModal
        open={Boolean(drilldownData)}
        data={drilldownData}
        onClose={() => setDrilldownCategory(null)}
        onOpenTransactions={() => {
          setActiveView("transactions");
          setDrilldownCategory(null);
        }}
      />
    </div>
  );
}

