import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_MODE_OPTIONS,
  DATE_RANGE_OPTIONS,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "../../utils/finance";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Surface } from "../ui/Surface";

const MODE_META = {
  income: {
    title: "Money coming in",
    description: "See which days carried the month.",
    stroke: "#14b8a6",
  },
  expense: {
    title: "Money going out",
    description: "Spot the days that pulled the hardest.",
    stroke: "#f87171",
  },
  net: {
    title: "What changed over time",
    description: "A day-by-day read on whether the period added to your balance or pulled it down.",
    stroke: "#14b8a6",
  },
};

function getAverageValue(data) {
  if (!data.length) {
    return 0;
  }

  return data.reduce((sum, item) => sum + item.value, 0) / data.length;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-[18px] border border-line/55 bg-surface/95 px-4 py-3 shadow-panel backdrop-blur">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-lg font-bold tracking-tight text-ink">{formatCurrency(point.value)}</p>
      <div className="mt-2 flex items-center gap-3 text-sm text-muted">
        <span>{formatSignedCurrency(point.delta)}</span>
        <span>
          {point.changePercent >= 0 ? "+" : ""}
          {formatPercent(point.changePercent)}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">Click to jump into that day in the ledger.</p>
    </div>
  );
}

export function BalanceChart({
  data,
  dateRange,
  onRangeChange,
  netFlow,
  chartMode,
  onChartModeChange,
  onPointSelect,
}) {
  const meta = MODE_META[chartMode] ?? MODE_META.net;
  const averageValue = getAverageValue(data);

  return (
    <Surface className="flex h-full flex-col px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">What changed</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">{meta.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-muted">{meta.description}</p>
        </div>

        <div className="space-y-3 lg:text-right">
          <div className="inline-flex rounded-full bg-accent-soft/55 px-4 py-2 text-sm font-semibold text-accent">
            Net this window {formatSignedCurrency(netFlow, true)}
          </div>
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <SegmentedControl options={CHART_MODE_OPTIONS} value={chartMode} onChange={onChartModeChange} />
            <SegmentedControl options={DATE_RANGE_OPTIONS} value={dateRange} onChange={onRangeChange} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-line/50 bg-surface-strong/50 p-3">
        <div className="h-[320px] w-full lg:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 12, left: -12, bottom: 0 }}
              onClick={(state) => {
                const point = state?.activePayload?.[0]?.payload;
                if (point) {
                  onPointSelect(point.date);
                }
              }}
            >
              <defs>
                <linearGradient id="hero-balance-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.14)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
                minTickGap={28}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
                width={86}
              />
              <Tooltip
                cursor={{ stroke: "rgba(148,163,184,0.22)", strokeDasharray: "3 3" }}
                content={<ChartTooltip />}
              />
              <ReferenceLine
                y={averageValue}
                stroke="rgba(100,116,139,0.35)"
                strokeDasharray="5 5"
                ifOverflow="extendDomain"
                label={{ value: "Average", position: "right", fill: "rgb(100 116 139)", fontSize: 11 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#14b8a6"
                strokeWidth={2.6}
                fill="url(#hero-balance-gradient)"
                fillOpacity={1}
                activeDot={{ r: 5, strokeWidth: 0, fill: meta.stroke, style: { cursor: "pointer" } }}
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Surface>
  );
}
