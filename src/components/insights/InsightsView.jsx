import {
  CalendarRange,
  Landmark,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatCurrency, getInsights } from "../../utils/finance";
import { InsightsSkeleton } from "../ui/LoadingSkeletons";
import { Surface } from "../ui/Surface";

const ICONS = {
  landmark: Landmark,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  sparkles: Sparkles,
  calendar: CalendarRange,
};

const TONE_CLASSES = {
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  emerald: "bg-accent-soft/70 text-accent",
  amber: "bg-warning-soft/80 text-warning",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

function InsightCard({ card }) {
  const Icon = ICONS[card.icon] ?? Sparkles;
  const toneClass = TONE_CLASSES[card.tone] ?? TONE_CLASSES.emerald;

  return (
    <Surface className="hover-lift h-full px-5 py-5 animate-fade-up">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-5 space-y-2">
        <p className="text-sm font-semibold text-muted">{card.title}</p>
        <p className="font-display text-2xl font-bold text-ink">{card.value}</p>
        <p className="text-sm leading-6 text-muted">{card.detail}</p>
      </div>
    </Surface>
  );
}

function MetricBars({ item, maxValue }) {
  const currentWidth = maxValue === 0 ? 0 : (Math.abs(item.current) / maxValue) * 100;
  const previousWidth = maxValue === 0 ? 0 : (Math.abs(item.previous) / maxValue) * 100;

  return (
    <div className="space-y-3 rounded-[24px] border border-line/80 bg-surface-strong/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{item.label}</p>
        <p className={`text-sm font-semibold ${item.change >= 0 ? "text-accent" : "text-danger"}`}>
          {item.change >= 0 ? "+" : ""}
          {item.change.toFixed(1)}%
        </p>
      </div>

      <div className="space-y-2">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <span>This month</span>
            <span>{formatCurrency(item.current)}</span>
          </div>
          <div className="h-2 rounded-full bg-line/60">
            <div className="h-2 rounded-full bg-ink dark:bg-white" style={{ width: `${currentWidth}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <span>Last month</span>
            <span>{formatCurrency(item.previous)}</span>
          </div>
          <div className="h-2 rounded-full bg-line/60">
            <div className="h-2 rounded-full bg-accent/70" style={{ width: `${previousWidth}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightsView({ isLoading }) {
  const transactions = useFinanceStore((state) => state.transactions);

  if (isLoading) {
    return <InsightsSkeleton />;
  }

  const insights = getInsights(transactions);
  const maxBarValue = Math.max(
    ...insights.monthlyBars.flatMap((item) => [Math.abs(item.current), Math.abs(item.previous)]),
    1,
  );

  return (
    <div className="space-y-4">
      <Surface strong className="overflow-hidden px-5 py-5 animate-fade-up">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">What changed</p>
            <h3 className="mt-3 font-display text-4xl font-bold leading-tight text-ink">
              {insights.heroTitle}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{insights.heroText}</p>
          </div>

          <div className="rounded-[24px] border border-line/80 bg-surface/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Analyst notes</p>
            <div className="mt-4 space-y-3">
              {insights.observations.map((observation) => (
                <div key={observation} className="rounded-2xl bg-surface-strong/70 px-4 py-3 text-sm leading-6 text-ink">
                  {observation}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insights.cards.map((card) => (
          <InsightCard key={card.id} card={card} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Surface className="space-y-4 px-5 py-5 animate-fade-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Monthly comparison</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Income, expenses, and net</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Compare the current month against the previous month to see where movement is accelerating.
            </p>
          </div>

          <div className="space-y-4">
            {insights.monthlyBars.map((item) => (
              <MetricBars key={item.label} item={item} maxValue={maxBarValue} />
            ))}
          </div>
        </Surface>

        <Surface className="space-y-4 px-5 py-5 animate-fade-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Spending ladder</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Largest categories this month</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              A quick view of where most expense pressure is currently concentrated.
            </p>
          </div>

          <div className="space-y-3">
            {insights.topCategories.map((item) => (
              <div key={item.category} className="rounded-[24px] border border-line/80 bg-surface-strong/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    <p className="text-sm text-muted">
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(1)}% vs last month
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatCurrency(item.current)}</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-line/60">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-accent to-warning"
                    style={{ width: `${maxBarValue === 0 ? 0 : (item.current / maxBarValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}
