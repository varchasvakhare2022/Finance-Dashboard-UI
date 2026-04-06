import { useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { formatCurrency, formatLongDate, formatPercent } from "../../utils/finance";

export function CategoryDrilldownModal({ open, data, onClose, onOpenTransactions }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !data) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[28px] border border-line/55 bg-surface p-6 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Category details</p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">{data.category}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              {data.count} entries in this window, or {formatPercent(data.share * 100)} of all {data.type === "income" ? "money coming in" : "money going out"}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pressable rounded-2xl border border-line/55 bg-surface-strong/55 p-3 text-muted transition hover:bg-surface hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-[22px] border border-line/50 bg-surface/72 p-4">
            <p className="text-sm font-medium text-muted">Total</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(data.total)}</p>
          </div>
          <div className="rounded-[22px] border border-line/50 bg-surface/72 p-4">
            <p className="text-sm font-medium text-muted">Average</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(data.average)}</p>
          </div>
          <div className="rounded-[22px] border border-line/50 bg-surface/72 p-4">
            <p className="text-sm font-medium text-muted">Largest</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(data.largest?.amount ?? 0)}</p>
          </div>
          <div className="rounded-[22px] border border-line/50 bg-surface/72 p-4">
            <p className="text-sm font-medium text-muted">Vs last period</p>
            <p className={`mt-2 text-2xl font-bold ${data.change >= 0 ? "text-accent" : "text-danger"}`}>
              {data.change >= 0 ? "+" : ""}
              {formatPercent(data.change)}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-line/50 bg-surface-strong/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Recent transactions</p>
              <p className="text-sm text-muted">The newest entries in this category.</p>
            </div>
            <button
              type="button"
              onClick={onOpenTransactions}
              className="pressable inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Open in transactions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 max-h-[320px] space-y-3 overflow-auto pr-1">
            {data.transactions.map((transaction, index) => (
              <div key={transaction.id} className={`flex items-center justify-between gap-4 rounded-[18px] border border-line/45 px-4 py-3 ${index % 2 === 0 ? "bg-surface" : "bg-surface-strong/45"}`}>
                <div>
                  <p className="text-sm font-semibold text-ink">{transaction.description}</p>
                  <p className="mt-1 text-sm text-muted">{formatLongDate(transaction.date)}</p>
                </div>
                <p className={`text-sm font-bold ${transaction.type === "income" ? "text-accent" : "text-danger"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
