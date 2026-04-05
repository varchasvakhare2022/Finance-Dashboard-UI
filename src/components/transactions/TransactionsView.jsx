import { startTransition, useDeferredValue, useState } from "react";
import { Download, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";
import { TransactionsSkeleton } from "../ui/LoadingSkeletons";
import { Surface } from "../ui/Surface";
import { Tooltip } from "../ui/Tooltip";
import { TransactionFormModal } from "./TransactionFormModal";
import { TransactionTable } from "./TransactionTable";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  cn,
  filterAndSortTransactions,
  filterTransactionsByDateRange,
  formatSignedCurrency,
  getCategories,
  getNetTotal,
} from "../../utils/finance";

export function TransactionsView({ isLoading }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const filters = useFinanceStore((state) => state.filters);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const selectedRole = useFinanceStore((state) => state.selectedRole);
  const setSearch = useFinanceStore((state) => state.setSearch);
  const setCategoryFilter = useFinanceStore((state) => state.setCategoryFilter);
  const clearCategoryFilter = useFinanceStore((state) => state.clearCategoryFilter);
  const toggleSort = useFinanceStore((state) => state.toggleSort);
  const clearFilters = useFinanceStore((state) => state.clearFilters);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const deferredSearch = useDeferredValue(filters.search);
  const visibleFilters = { ...filters, search: deferredSearch };

  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  const rangeTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const categories = getCategories(rangeTransactions.length ? rangeTransactions : transactions);
  const filteredTransactions = filterAndSortTransactions(transactions, visibleFilters, dateRange);
  const canManage = selectedRole === "admin";
  const visibleNet = getNetTotal(filteredTransactions);

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const openCreate = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleSave = (transaction) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    closeModal();
  };

  const handleDelete = (transaction) => {
    const confirmed = window.confirm(`Delete ${transaction.description}? This action cannot be undone.`);
    if (confirmed) {
      deleteTransaction(transaction.id);
    }
  };

  const handleExport = () => {
    if (!filteredTransactions.length) {
      return;
    }

    const rows = [
      ["Date", "Description", "Category", "Amount", "Type"],
      ...filteredTransactions.map((transaction) => [
        transaction.date,
        transaction.description,
        transaction.category,
        transaction.amount,
        transaction.type,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `northstar-transactions-${dateRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Surface className="space-y-4 px-5 py-5 animate-fade-up">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Filters and actions</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Ledger controls</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Showing {filteredTransactions.length} transactions with {formatSignedCurrency(visibleNet, true)} net flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl border border-line/80 bg-surface-strong/70 px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent/30 hover:text-accent"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            {canManage ? (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
            ) : (
              <Tooltip label="Switch to Admin to add, edit, or delete transactions.">
                <span>
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white opacity-60 cursor-not-allowed dark:bg-white dark:text-slate-900"
                  >
                    <Plus className="h-4 w-4" />
                    Add Transaction
                  </button>
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={filters.search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by description or category"
              className="w-full rounded-2xl border border-line/80 bg-surface-strong/70 py-3 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-accent/40"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "date", label: "Date" },
              { id: "amount", label: "Amount" },
              { id: "description", label: "Description" },
            ].map((option) => {
              const active = filters.sortBy === option.id;
              const directionLabel = filters.sortDirection === "asc" ? "ASC" : "DESC";

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSort(option.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "border-accent/30 bg-accent-soft/50 text-accent"
                      : "border-line/80 bg-surface-strong/70 text-muted hover:text-ink",
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {option.label}
                  {active ? directionLabel : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const active = filters.category === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  startTransition(() => {
                    if (category === "All") {
                      clearCategoryFilter();
                    } else {
                      setCategoryFilter(category);
                    }
                  })
                }
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-transparent bg-ink text-white dark:bg-white dark:text-slate-900"
                    : "border-line/80 bg-surface-strong/70 text-muted hover:border-accent/30 hover:text-ink dark:hover:text-white",
                )}
              >
                {category}
              </button>
            );
          })}

          {(filters.search || filters.category !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-full border border-line/80 px-4 py-2 text-sm font-semibold text-muted transition hover:text-ink"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>
      </Surface>

      {filteredTransactions.length ? (
        <Surface className="px-4 py-4 md:px-5 md:py-5 animate-fade-up">
          <TransactionTable
            transactions={filteredTransactions}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={handleDelete}
            onSort={toggleSort}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
          />
        </Surface>
      ) : (
        <EmptyState
          title="No transactions match these filters"
          description="Try widening the date range, removing the category chip, or searching for a different merchant or category."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Reset filters
            </button>
          }
        />
      )}

      <TransactionFormModal
        open={modalOpen}
        transaction={editingTransaction}
        categories={categories.filter((category) => category !== "All")}
        onClose={closeModal}
        onSubmit={handleSave}
      />
    </div>
  );
}
