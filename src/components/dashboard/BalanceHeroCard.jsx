import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn, formatCurrency, formatPercent, formatSignedCurrency } from "../../utils/finance";
import { Surface } from "../ui/Surface";
import { AnimatedNumber } from "../ui/AnimatedNumber";

export function BalanceHeroCard({
  balanceMetric,
  incomeMetric,
  expenseMetric,
  dashboardMode,
  onOpenTransactions,
  onOpenInsights,
}) {
  const positiveTrend = balanceMetric.trend.tone === "positive";
  const TrendIcon = balanceMetric.trend.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const netValue = incomeMetric.value - expenseMetric.value;

  return (
    <Surface strong className="relative flex h-full flex-col overflow-hidden px-5 py-5 animate-fade-up lg:px-8 lg:py-8 lg:min-h-[460px]">
      {/* Premium SVG Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1.5px 1.5px, hsl(var(--muted)) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col h-full">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)] lg:items-start flex-1">
          <div className="min-w-0 flex flex-col h-full">
            <div className="flex items-center gap-3">
               <div className="inline-flex rounded-lg bg-accent-soft/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent border border-accent/20">
                {dashboardMode === "spending" ? "Active Spending" : "Savings Engine"}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-line/50 to-transparent" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted/80">Net Position</p>
                <h3 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl xl:text-5xl tabular-nums">
                  <AnimatedNumber
                    value={balanceMetric.value}
                    formatter={(value) => formatCurrency(Math.round(value))}
                  />
                </h3>
              </div>
              <div className="mb-1 self-end">
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg",
                    positiveTrend ? "bg-accent-soft/70 text-accent ring-1 ring-accent/20" : "bg-danger-soft/70 text-danger ring-1 ring-danger/20",
                  )}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  {formatPercent(balanceMetric.trend.percentage)}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-[13px] leading-7 text-muted font-medium">
              {balanceMetric.detail}. Use this as your primary pulse before drilling into specific categories.
            </p>

            <div className="mt-auto pt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-2xl border border-line/40 bg-surface/40 p-5 transition-all hover:bg-surface/60 hover:border-accent/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Inflow</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-ink tabular-nums whitespace-nowrap">
                  <AnimatedNumber
                    value={incomeMetric.value}
                    formatter={(value) => formatCurrency(Math.round(value))}
                  />
                </p>
                <p className={cn("mt-1.5 text-[10px] font-bold", incomeMetric.trend.direction === "up" ? "text-accent" : "text-danger")}>
                  {incomeMetric.trend.direction === "up" ? "▲" : "▼"} {formatPercent(incomeMetric.trend.percentage)}
                </p>
              </div>

              <div className="group rounded-2xl border border-line/40 bg-surface/40 p-5 transition-all hover:bg-surface/60 hover:border-accent/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Outflow</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-ink tabular-nums whitespace-nowrap">
                  <AnimatedNumber
                    value={expenseMetric.value}
                    formatter={(value) => formatCurrency(Math.round(value))}
                  />
                </p>
                <p className={cn("mt-1.5 text-[10px] font-bold", expenseMetric.trend.direction === "up" ? "text-danger" : "text-accent")}>
                  {expenseMetric.trend.direction === "up" ? "▲" : "▼"} {formatPercent(expenseMetric.trend.percentage)}
                </p>
              </div>

              <div className="group rounded-2xl border border-line/40 bg-surface/40 p-5 transition-all hover:bg-surface/60 hover:border-accent/20 sm:col-span-2 lg:col-span-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Velocity</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-ink tabular-nums whitespace-nowrap">
                  <AnimatedNumber
                    value={netValue}
                    formatter={(value) => formatSignedCurrency(Math.round(value), true)}
                  />
                </p>
                <p className="mt-1.5 text-[10px] font-bold text-muted/60 lowercase italic">
                  net window delta
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 h-full flex flex-col">
            <div className="flex-1 rounded-[28px] border border-line/40 bg-surface/40 p-5 shadow-panel backdrop-blur-md flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Range Dynamics</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted/70 line-clamp-2">
                    Movement across the selected window.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                  <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] font-bold uppercase text-accent tracking-tighter">Live</span>
                </div>
              </div>

              <div className="mt-auto h-[180px] w-full lg:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceMetric.sparkline}>
                    <defs>
                      <linearGradient id="hero-balance-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      fill="url(#hero-balance-gradient)"
                      fillOpacity={1}
                      isAnimationActive
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenTransactions}
            className="pressable group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-accent/20 hover:scale-[1.02]"
          >
            Open Ledger
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={onOpenInsights}
            className="pressable inline-flex items-center gap-2 rounded-xl border border-line/50 bg-surface/50 px-6 py-3 text-xs font-bold text-ink transition-all hover:bg-surface"
          >
            Analysis insights
          </button>
        </div>
      </div>
    </Surface>



  );
}
