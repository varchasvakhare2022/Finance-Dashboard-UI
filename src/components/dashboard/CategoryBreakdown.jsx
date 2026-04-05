import { ArrowRight } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, formatPercent } from "../../utils/finance";
import { Surface } from "../ui/Surface";

function BreakdownTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface px-4 py-3 shadow-lg backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.category}</p>
      <p className="mt-2 text-base font-bold text-ink">{formatCurrency(item.value)}</p>
      <div className="mt-2 flex items-center gap-2 text-sm text-muted">
        <span>{formatPercent(item.share * 100)} of expenses</span>
        <span>
          {item.change >= 0 ? "+" : ""}
          {formatPercent(item.change)} vs previous range
        </span>
      </div>
    </div>
  );
}

export function CategoryBreakdown({ categories, selectedCategory, onSelectCategory }) {
  if (!categories.length) {
    return (
      <Surface className="flex h-full flex-col items-center justify-center px-5 py-5 text-center animate-fade-up">
        <div className="rounded-2xl bg-accent-soft/70 px-4 py-3 text-sm font-semibold text-accent">
          Category mix unavailable
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink">No expense data in this range</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
          Widen the date range or add an expense transaction to see how spending is distributed.
        </p>
      </Surface>
    );
  }

  const total = categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <Surface className="flex h-full flex-col px-5 py-5 animate-fade-up">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Category mix</p>
        <h3 className="font-display text-2xl font-bold text-ink">Where the money went</h3>
        <p className="text-sm leading-6 text-muted">
          Click the chart or any row to inspect the category in a drill-down modal.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
        <div className="h-[220px] w-full lg:h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<BreakdownTooltip />} />
              <Pie
                data={categories}
                dataKey="value"
                nameKey="category"
                innerRadius={56}
                outerRadius={80}
                paddingAngle={4}
                onClick={(entry) => onSelectCategory(entry.category)}
              >
                {categories.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} style={{ cursor: "pointer" }} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {categories.map((item) => {
            const active = selectedCategory === item.category;

            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onSelectCategory(item.category)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${active ? "border-accent/30 bg-accent-soft/40" : "border-line/70 bg-surface-strong/70 hover:border-accent/20 hover:bg-surface"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    <p className="text-xs text-muted">{formatPercent(item.share * 100)} of spend</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">{formatCurrency(item.value)}</p>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-muted">
                    Inspect
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line/70 bg-surface-strong/70 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Total filtered spend</p>
        <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(total)}</p>
      </div>
    </Surface>
  );
}
