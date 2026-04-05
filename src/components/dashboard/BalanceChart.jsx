import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DATE_RANGE_OPTIONS,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "../../utils/finance";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Surface } from "../ui/Surface";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface px-4 py-3 shadow-lg backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-base font-bold text-ink">{formatCurrency(point.value)}</p>
      <div className="mt-2 flex items-center gap-2 text-sm text-muted">
        <span>{formatSignedCurrency(point.delta)}</span>
        <span>
          {point.changePercent >= 0 ? "+" : ""}
          {formatPercent(point.changePercent)}
        </span>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        Click to inspect this day in the ledger
      </p>
    </div>
  );
}

export function BalanceChart({ data, dateRange, onRangeChange, netFlow, onPointSelect }) {
  return (
    <Surface className="flex h-full flex-col px-5 py-5 animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Balance trend</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">Cash trajectory over time</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Hover for value and change. Click any point to open that day in Transactions.
          </p>
        </div>

        <div className="space-y-3 lg:text-right">
          <div className="inline-flex rounded-full bg-accent-soft/70 px-4 py-2 text-sm font-semibold text-accent">
            Net flow {formatSignedCurrency(netFlow, true)}
          </div>
          <div>
            <SegmentedControl
              options={DATE_RANGE_OPTIONS}
              value={dateRange}
              onChange={onRangeChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 h-[320px] w-full lg:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
            onClick={(state) => {
              const point = state?.activePayload?.[0]?.payload;
              if (point) {
                onPointSelect(point.date);
              }
            }}
          >
            <defs>
              <linearGradient id="balanceChartStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
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
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#balanceChartStroke)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: "#0f766e", style: { cursor: "pointer" } }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Surface>
  );
}
