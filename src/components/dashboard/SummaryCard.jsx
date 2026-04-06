import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { formatCurrency, formatPercent } from "../../utils/finance";
import { Surface } from "../ui/Surface";
import { AnimatedNumber } from "../ui/AnimatedNumber";

const ACCENT_MAP = {
  emerald: {
    line: "#0f766e",
  },
  cyan: {
    line: "#0f766e",
  },
  rose: {
    line: "#dc2626",
  },
};

export function SummaryCard({ metric }) {
  const accent = ACCENT_MAP[metric.accent] ?? ACCENT_MAP.emerald;
  const positiveTrend = metric.trend.tone === "positive";
  const TrendIcon = metric.trend.direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Surface className="flex h-full flex-col justify-between px-5 py-5 animate-fade-up lg:px-7 lg:py-7">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{metric.title}</p>
        <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          <AnimatedNumber value={metric.value} formatter={(value) => formatCurrency(Math.round(value))} />
        </p>
        <div
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${positiveTrend ? "bg-accent-soft/65 text-accent" : "bg-danger-soft/70 text-danger"}`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {formatPercent(metric.trend.percentage)}
        </div>
      </div>

      <div className="mt-6 h-20 w-full rounded-[18px] border border-line/45 bg-surface-strong/45 p-1.5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.sparkline}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent.line} stopOpacity={0.16} />
                <stop offset="95%" stopColor={accent.line} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={accent.line}
              strokeWidth={2.2}
              fill={`url(#gradient-${metric.id})`}
              fillOpacity={1}
              isAnimationActive
              animationDuration={650}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 max-w-[240px] text-xs leading-6 text-muted">{metric.detail}</p>
    </Surface>
  );
}
