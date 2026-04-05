import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { formatCurrency, formatPercent } from "../../utils/finance";
import { Surface } from "../ui/Surface";

const ACCENT_MAP = {
  emerald: {
    line: "#0f766e",
    fill: "rgba(15, 118, 110, 0.16)",
    chip: "bg-accent-soft/80 text-accent",
  },
  cyan: {
    line: "#0891b2",
    fill: "rgba(8, 145, 178, 0.16)",
    chip: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
  rose: {
    line: "#e11d48",
    fill: "rgba(225, 29, 72, 0.16)",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  },
};

export function SummaryCard({ metric }) {
  const accent = ACCENT_MAP[metric.accent] ?? ACCENT_MAP.emerald;
  const positiveTrend = metric.trend.tone === "positive";
  const TrendIcon = metric.trend.direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Surface className="hover-lift flex h-full flex-col justify-between px-5 py-5 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">{metric.title}</p>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
            {formatCurrency(metric.value)}
          </p>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${accent.chip}`}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent.line }} />
          Live
        </span>
      </div>

      <div className="mt-5 h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.sparkline}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent.line} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accent.line} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={accent.line}
              strokeWidth={2.5}
              fill={`url(#gradient-${metric.id})`}
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${positiveTrend ? "bg-accent-soft/80 text-accent" : "bg-danger-soft/80 text-danger"}`}
        >
          <TrendIcon className="h-4 w-4" />
          {formatPercent(metric.trend.percentage)}
        </div>
        <p className="text-right text-sm text-muted">{metric.detail}</p>
      </div>
    </Surface>
  );
}
