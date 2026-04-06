import {
  Activity,
  ChartPie,
  PiggyBank,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatCurrency, getInsights } from "../../utils/finance";
import { InsightsSkeleton } from "../ui/LoadingSkeletons";
import { Surface } from "../ui/Surface";

const ICONS = {
  activity: Activity,
  "chart-pie": ChartPie,
  "piggy-bank": PiggyBank,
  "shield-check": ShieldCheck,
  "triangle-alert": TriangleAlert,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  wallet: Wallet,
};

const TONE_CLASSES = {
  violet: "bg-surface-strong/60 text-ink",
  rose: "bg-danger-soft/35 text-danger",
  emerald: "bg-accent-soft/55 text-accent",
  amber: "bg-warning-soft/50 text-warning",
};

const ALERT_TONES = {
  positive: "border-line/50 bg-surface/72",
  warning: "border-warning/20 bg-warning-soft/18",
  critical: "border-danger/20 bg-danger-soft/16",
};

function InsightCard({ card }) {
  const Icon = ICONS[card.icon] ?? Activity;
  const toneClass = TONE_CLASSES[card.tone] ?? TONE_CLASSES.emerald;

  return (
    <Surface className="hover-lift h-full px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-5 space-y-2">
        <p className="text-sm font-medium text-muted">{card.title}</p>
        <p className="font-display text-2xl font-bold tracking-tight text-ink">{card.value}</p>
        <p className="text-sm leading-7 text-muted">{card.detail}</p>
      </div>
    </Surface>
  );
}

function MetricBars({ item, maxValue }) {
  const currentWidth = maxValue === 0 ? 0 : (Math.abs(item.current) / maxValue) * 100;
  const previousWidth = maxValue === 0 ? 0 : (Math.abs(item.previous) / maxValue) * 100;

  return (
    <div className="space-y-3 rounded-[22px] border border-line/50 bg-surface/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{item.label}</p>
        <p className={`text-sm font-semibold ${item.change >= 0 ? "text-accent" : "text-danger"}`}>
          {item.change >= 0 ? "+" : ""}
          {item.change.toFixed(1)}%
        </p>
      </div>

      <div className="space-y-2">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>Now</span>
            <span>{formatCurrency(item.current)}</span>
          </div>
          <div className="h-2 rounded-full bg-line/45">
            <div className="h-2 rounded-full bg-ink dark:bg-white" style={{ width: `${currentWidth}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>Last period</span>
            <span>{formatCurrency(item.previous)}</span>
          </div>
          <div className="h-2 rounded-full bg-line/45">
            <div className="h-2 rounded-full bg-accent/70" style={{ width: `${previousWidth}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightsView({ isLoading }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const dashboardMode = useFinanceStore((state) => state.dashboardMode);

  if (isLoading) {
    return <InsightsSkeleton />;
  }

  const insights = getInsights(transactions, dateRange, dashboardMode);
  const maxBarValue = Math.max(
    ...insights.monthlyBars.flatMap((item) => [Math.abs(item.current), Math.abs(item.previous)]),
    1,
  );

  return (
    <div className="space-y-5">
      <Surface strong className="overflow-hidden px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] xl:items-start">
          <div>
            <p className="text-sm font-medium text-muted">Why it moved</p>
            <h3 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-ink">
              {insights.heroTitle}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-muted">{insights.heroText}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {insights.observations.map((observation) => (
                <div key={observation} className="rounded-[22px] border border-line/50 bg-surface/72 p-4 text-sm leading-7 text-ink">
                  {observation}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {insights.alerts.map((alert) => {
              const Icon = ICONS[alert.icon] ?? TriangleAlert;

              return (
                <div key={alert.id} className={`rounded-[22px] border p-4 ${ALERT_TONES[alert.tone] ?? ALERT_TONES.warning}`}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-surface text-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{alert.title}</p>
                      <p className="mt-1 text-sm leading-7 text-muted">{alert.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insights.cards.map((card) => (
          <InsightCard key={card.id} card={card} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <Surface className="space-y-4 px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
          <div>
            <p className="text-sm font-medium text-muted">This month vs last month</p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">Money in, money out, what stayed behind</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              A side-by-side view of this stretch and the one right before it.
            </p>
          </div>

          <div className="space-y-4">
            {insights.monthlyBars.map((item) => (
              <MetricBars key={item.label} item={item} maxValue={maxBarValue} />
            ))}
          </div>
        </Surface>

        <Surface className="space-y-4 px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
          <div>
            <p className="text-sm font-medium text-muted">Where the pressure is</p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">The categories doing the most damage</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              This is where most of the outgoing money is clustering right now.
            </p>
          </div>

          <div className="space-y-3">
            {insights.topCategories.map((item) => (
              <div key={item.category} className="rounded-[22px] border border-line/50 bg-surface/72 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    <p className="text-sm text-muted">
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(1)}% vs last period
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatCurrency(item.current)}</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-line/45">
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
