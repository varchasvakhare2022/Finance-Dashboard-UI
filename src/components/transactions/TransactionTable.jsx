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
    "rounded-[14px] bg-surface-strong/60 p-2 text-muted opacity-60 cursor-not-allowed";

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
    <div className="flex items-center justify-end gap-2 transition md:opacity-0 md:group-hover:opacity-100">
      <button
        type="button"
        onClick={onEdit}
        className="pressable rounded-[14px] bg-surface-strong/60 p-2 text-muted transition hover:bg-surface hover:text-ink"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="pressable rounded-[14px] bg-surface-strong/60 p-2 text-muted transition hover:bg-surface hover:text-danger"
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
      <div className="hidden max-h-[68vh] overflow-auto rounded-[24px] bg-surface-strong/35 md:block">
        <table className="min-w-full divide-y divide-line/50">
          <thead className="sticky top-0 z-10 bg-surface/92 backdrop-blur">
            <tr>
              {[
                { id: "date", label: "Date" },
                { id: "description", label: "Description" },
                { id: "category", label: "Category" },
                { id: "amount", label: "Amount" },
              ].map((column) => (
                <th key={column.id} className="px-4 py-4 text-left text-sm font-medium text-muted">
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
              <th className="px-4 py-4 text-right text-sm font-medium text-muted">Type</th>
              <th className="px-4 py-4 text-right text-sm font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/45 bg-surface/70">
            {transactions.map((transaction) => {
              const badge =
                CATEGORY_META[transaction.category]?.badge ??
                "bg-surface-strong/90 text-ink";

              return (
                <tr key={transaction.id} className="group odd:bg-surface/70 even:bg-surface-strong/30 transition hover:bg-surface">
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
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", transaction.type === "income" ? "bg-accent-soft/60 text-accent" : "bg-danger-soft/70 text-danger")}>
                      {transaction.type === "income" ? "In" : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <ActionButtons
                      canManage={canManage}
                      onEdit={() => onEdit(transaction)}
                      onDelete={() => onDelete(transaction)}
                      reason="Switch to edit mode if you want to change this row."
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction, index) => {
          const badge =
            CATEGORY_META[transaction.category]?.badge ??
            "bg-surface-strong/90 text-ink";

          return (
            <div key={transaction.id} className={cn("rounded-[22px] p-4 transition hover:-translate-y-0.5 hover:shadow-panel", index % 2 === 0 ? "bg-surface-strong/45" : "bg-surface-strong/6") }>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{transaction.description}</p>
                  <p className="mt-1 text-sm text-muted">{formatLongDate(transaction.date)}</p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", transaction.type === "income" ? "bg-accent-soft/60 text-accent" : "bg-danger-soft/70 text-danger")}>
                  {transaction.type === "income" ? "In" : "Out"}
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
                  reason="Switch to edit mode if you want to change this row."
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
