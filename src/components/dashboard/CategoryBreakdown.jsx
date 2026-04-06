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
    <div className="rounded-[18px] border border-line/55 bg-surface px-4 py-3 shadow-panel backdrop-blur">
      <p className="text-sm font-medium text-muted">{item.category}</p>
      <p className="mt-2 text-base font-bold text-ink">{formatCurrency(item.value)}</p>
      <div className="mt-2 flex items-center gap-2 text-sm text-muted">
        <span>{formatPercent(item.share * 100)} of spending</span>
        <span>
          {item.change >= 0 ? "+" : ""}
          {formatPercent(item.change)} vs last period
        </span>
      </div>
    </div>
  );
}

export function CategoryBreakdown({ categories, selectedCategory, onSelectCategory }) {
  if (!categories.length) {
    return (
      <Surface className="flex h-full flex-col items-center justify-center px-5 py-6 text-center animate-fade-up">
        <div className="rounded-full bg-accent-soft/60 px-4 py-2 text-sm font-semibold text-accent">
          Nothing to show yet
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink">No spending in this range</h3>
        <p className="mt-2 max-w-sm text-sm leading-7 text-muted">
          Try a wider time range, or add an expense and it will show up here.
        </p>
      </Surface>
    );
  }

  const total = categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <Surface className="flex h-full flex-col px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Why it changed</p>
        <h3 className="font-display text-lg font-bold tracking-tight text-ink">Spending by category</h3>
        <p className="text-xs leading-6 text-muted">
          Pick a slice or a row to drill into that category.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)] lg:items-center">
        <div className="h-[180px] w-full lg:h-[160px]">
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
                className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-left transition ${active ? "border-accent/20 bg-accent-soft/32" : "border-line/50 bg-surface/72 hover:border-line/65 hover:bg-surface"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    <p className="text-xs leading-5 text-muted">{formatPercent(item.share * 100)} of spend</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">{formatCurrency(item.value)}</p>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted">
                    Open
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-[20px] border border-line/45 bg-surface-strong/45 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Total going out</p>
        <p className="mt-1 text-xl font-bold text-ink">{formatCurrency(total)}</p>
      </div>
    </Surface>
  );
}
