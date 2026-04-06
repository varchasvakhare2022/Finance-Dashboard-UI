import { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  filterTransactionsByDateRange,
  getCategoryBreakdown,
  getCategoryDrilldown,
  getDailySeries,
  getHealthScore,
  getInsights,
  getNetTotal,
  getOverviewMetrics,
  getPreviousWindow,
} from "../../utils/finance";
import { DashboardSkeleton } from "../ui/LoadingSkeletons";
import { AlertRail } from "./AlertRail";
import { BalanceChart } from "./BalanceChart";
import { BalanceHeroCard } from "./BalanceHeroCard";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { CategoryDrilldownModal } from "./CategoryDrilldownModal";
import { FinancialHealthCard } from "./FinancialHealthCard";
import { SummaryCard } from "./SummaryCard";

function buildNetSeries(incomeSeries, expenseSeries) {
  return incomeSeries.map((point, index) => {
    const expensePoint = expenseSeries[index];
    const value = point.value - expensePoint.value;
    const previousValue = index > 0 ? incomeSeries[index - 1].value - expenseSeries[index - 1].value : 0;

    return {
      ...point,
      value,
      delta: value - previousValue,
      changePercent:
        previousValue === 0
          ? value === 0
            ? 0
            : 100
          : ((value - previousValue) / Math.abs(previousValue)) * 100,
    };
  });
}

export function DashboardView({ isLoading }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const setDateRange = useFinanceStore((state) => state.setDateRange);
  const chartMode = useFinanceStore((state) => state.chartMode);
  const setChartMode = useFinanceStore((state) => state.setChartMode);
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
  const balanceMetric = overviewMetrics.find((metric) => metric.id === "balance");
  const incomeMetric = overviewMetrics.find((metric) => metric.id === "income");
  const expenseMetric = overviewMetrics.find((metric) => metric.id === "expenses");

  const incomeSeries = getDailySeries(transactions, dateRange, "income");
  const expenseSeries = getDailySeries(transactions, dateRange, "expense");
  const netSeries = buildNetSeries(incomeSeries, expenseSeries);
  const chartSeries = chartMode === "income" ? incomeSeries : chartMode === "expense" ? expenseSeries : netSeries;

  const categoryBreakdown = getCategoryBreakdown(transactions, dateRange);
  const rangeTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const insights = getInsights(transactions, dateRange, dashboardMode);
  const health = getHealthScore(transactions, dateRange);
  const previousWindow = getPreviousWindow(dateRange);
  const previousHealth = getHealthScore(transactions, dateRange, previousWindow.end);
  const healthDelta = health.score - previousHealth.score;
  const netFlow = getNetTotal(rangeTransactions);

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
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <BalanceHeroCard
          balanceMetric={balanceMetric}
          incomeMetric={incomeMetric}
          expenseMetric={expenseMetric}
          dashboardMode={dashboardMode}
          onOpenTransactions={() => setActiveView("transactions")}
          onOpenInsights={() => setActiveView("insights")}
        />
        <FinancialHealthCard
          health={health}
          dashboardMode={dashboardMode}
          healthDelta={healthDelta}
          onOpenInsights={() => setActiveView("insights")}
        />
      </div>

      <AlertRail alerts={insights.alerts} onAction={handleAlertAction} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
        <BalanceChart
          data={chartSeries}
          dateRange={dateRange}
          onRangeChange={setDateRange}
          netFlow={netFlow}
          chartMode={chartMode}
          onChartModeChange={setChartMode}
          onPointSelect={(day) => {
            setDayFilter(day);
            setActiveView("transactions");
          }}
        />
        <CategoryBreakdown
          categories={categoryBreakdown}
          selectedCategory={selectedCategory}
          onSelectCategory={handleOpenCategory}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SummaryCard metric={incomeMetric} />
        <SummaryCard metric={expenseMetric} />
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
