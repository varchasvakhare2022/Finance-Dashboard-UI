import { startTransition } from "react";
import {
  ArrowUpRight,
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  cn,
  DATE_RANGE_OPTIONS,
  filterTransactionsByDateRange,
  formatSignedCurrency,
  getNetTotal,
} from "../../utils/finance";
import { Surface } from "../ui/Surface";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ReceiptText },
  { id: "insights", label: "Insights", icon: Sparkles },
];

export function Sidebar() {
  const activeView = useFinanceStore((state) => state.activeView);
  const setActiveView = useFinanceStore((state) => state.setActiveView);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const selectedRole = useFinanceStore((state) => state.selectedRole);
  const transactions = useFinanceStore((state) => state.transactions);

  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const netFlow = getNetTotal(filteredTransactions);
  const rangeLabel = DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.label;

  return (
    <aside className="w-full lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[290px] lg:flex-shrink-0">
      <Surface className="flex h-full flex-col gap-5 p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <CircleDollarSign className="h-3.5 w-3.5" />
              Northstar
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">Finance cockpit</h1>
              <p className="text-sm leading-6 text-muted">
                A clear, investor-grade view of cash flow, spend quality, and momentum.
              </p>
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeView;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => startTransition(() => setActiveView(item.id))}
                className={cn(
                  "group flex min-w-[160px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 lg:min-w-0",
                  active
                    ? "border-transparent bg-ink text-white shadow-lg dark:bg-white dark:text-slate-900"
                    : "border-line/80 bg-surface-strong/70 text-muted hover:border-accent/40 hover:text-ink dark:hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl transition duration-200",
                    active
                      ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900"
                      : "bg-accent-soft/60 text-accent",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span
                    className={cn(
                      "block text-xs",
                      active ? "text-white/70 dark:text-slate-700" : "text-muted",
                    )}
                  >
                    {item.id === "dashboard"
                      ? "Snapshot and category flow"
                      : item.id === "transactions"
                        ? "Search, sort, and act"
                        : "Patterns worth attention"}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="grid gap-4 lg:mt-auto">
          <div className="rounded-[24px] border border-accent/15 bg-gradient-to-br from-accent-soft/80 via-surface to-surface p-4 dark:from-accent-soft/30 dark:via-surface dark:to-surface-strong">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Net flow {rangeLabel}
              </span>
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-display text-3xl font-bold text-ink">
                {formatSignedCurrency(netFlow, true)}
              </p>
              <p className="text-sm leading-6 text-muted">
                {netFlow >= 0
                  ? "Income is comfortably covering outflows in the current window."
                  : "Outflows are running ahead of inflows in the current window."}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-line/80 bg-surface-strong/70 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warning-soft/80 text-warning">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Access mode</p>
                <p className="text-sm text-muted">
                  {selectedRole === "admin" ? "Admin can add, edit, delete, and export." : "Viewer is read-only with guarded controls."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Surface>
    </aside>
  );
}
