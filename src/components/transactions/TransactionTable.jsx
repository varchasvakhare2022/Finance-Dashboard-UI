import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { CATEGORY_META, cn, formatCurrency, formatLongDate } from "../../utils/finance";
import { Tooltip } from "../ui/Tooltip";

function SortIndicator({ active, direction }) {
  if (!active) {
    return <ArrowUpDown className="h-4 w-4 text-muted" />;
  }

  return direction === "asc" ? (
    <ArrowUp className="h-4 w-4 text-accent" />
  ) : (
    <ArrowDown className="h-4 w-4 text-accent" />
  );
}

function ActionButtons({ canManage, onEdit, onDelete, reason }) {
  const disabledButtonClass =
    "rounded-xl border border-line/80 p-2 text-muted opacity-60 cursor-not-allowed";

  if (!canManage) {
    return (
      <div className="flex items-center justify-end gap-2">
        <Tooltip label={reason}>
          <span>
            <button type="button" disabled className={disabledButtonClass}>
              <Pencil className="h-4 w-4" />
            </button>
          </span>
        </Tooltip>
        <Tooltip label={reason}>
          <span>
            <button type="button" disabled className={disabledButtonClass}>
              <Trash2 className="h-4 w-4" />
            </button>
          </span>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-xl border border-line/80 p-2 text-muted transition hover:border-accent/30 hover:text-accent"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-xl border border-line/80 p-2 text-muted transition hover:border-danger/30 hover:text-danger"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function TransactionTable({
  transactions,
  canManage,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortDirection,
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[24px] border border-line/80 md:block">
        <table className="min-w-full divide-y divide-line/80">
          <thead className="bg-surface-strong/80">
            <tr>
              {[
                { id: "date", label: "Date" },
                { id: "description", label: "Description" },
                { id: "category", label: "Category" },
                { id: "amount", label: "Amount" },
              ].map((column) => (
                <th key={column.id} className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  <button
                    type="button"
                    onClick={() => onSort(column.id)}
                    className="inline-flex items-center gap-2 transition hover:text-ink"
                  >
                    {column.label}
                    <SortIndicator active={sortBy === column.id} direction={sortDirection} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted">Type</th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70 bg-surface/75">
            {transactions.map((transaction) => {
              const badge = CATEGORY_META[transaction.category]?.badge ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

              return (
                <tr key={transaction.id} className="transition hover:bg-surface-strong/80">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-ink">
                    {formatLongDate(transaction.date)}
                  </td>
                  <td className="px-4 py-4 text-sm text-ink">{transaction.description}</td>
                  <td className="px-4 py-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", badge)}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={cn("px-4 py-4 text-sm font-semibold", transaction.type === "income" ? "text-accent" : "text-danger")}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", transaction.type === "income" ? "bg-accent-soft/70 text-accent" : "bg-danger-soft/80 text-danger")}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <ActionButtons
                      canManage={canManage}
                      onEdit={() => onEdit(transaction)}
                      onDelete={() => onDelete(transaction)}
                      reason="Viewer mode keeps transaction actions read-only."
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => {
          const badge = CATEGORY_META[transaction.category]?.badge ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

          return (
            <div key={transaction.id} className="rounded-[24px] border border-line/80 bg-surface/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{transaction.description}</p>
                  <p className="mt-1 text-sm text-muted">{formatLongDate(transaction.date)}</p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", transaction.type === "income" ? "bg-accent-soft/70 text-accent" : "bg-danger-soft/80 text-danger")}>
                  {transaction.type}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", badge)}>
                  {transaction.category}
                </span>
                <p className={cn("text-sm font-bold", transaction.type === "income" ? "text-accent" : "text-danger")}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>

              <div className="mt-4">
                <ActionButtons
                  canManage={canManage}
                  onEdit={() => onEdit(transaction)}
                  onDelete={() => onDelete(transaction)}
                  reason="Viewer mode keeps transaction actions read-only."
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
