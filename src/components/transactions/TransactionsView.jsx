import { startTransition, useEffect, useState } from "react";
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
  formatDayMonth,
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
  const setDayFilter = useFinanceStore((state) => state.setDayFilter);
  const clearCategoryFilter = useFinanceStore((state) => state.clearCategoryFilter);
  const clearDayFilter = useFinanceStore((state) => state.clearDayFilter);
  const toggleSort = useFinanceStore((state) => state.toggleSort);
  const clearFilters = useFinanceStore((state) => state.clearFilters);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput !== filters.search) {
        setSearch(searchInput);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [filters.search, searchInput, setSearch]);

  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  const rangeTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const categories = getCategories(rangeTransactions.length ? rangeTransactions : transactions);
  const filteredTransactions = filterAndSortTransactions(transactions, filters, dateRange);
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
    const confirmed = window.confirm(`Delete ${transaction.description}? This cannot be undone.`);
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

  const resetFilters = () => {
    clearFilters();
    setSearchInput("");
  };

  return (
    <div className="space-y-5">
      <Surface className="space-y-5 px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Find anything fast</p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">Your transaction list</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              Showing {filteredTransactions.length} entries. Net in this view: {formatSignedCurrency(visibleNet, true)}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="pressable inline-flex items-center gap-2 rounded-[18px] border border-line/45 bg-surface-strong/60 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>
            <div className="rounded-[18px] bg-surface-strong/55 px-4 py-3 text-sm text-muted">
              {canManage
                ? "You can edit from here."
                : "You’re in view-only mode."}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search description or category"
              className="w-full rounded-[18px] border border-line/45 bg-surface-strong/55 py-3 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-accent/30"
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
                    "pressable inline-flex items-center gap-2 rounded-[18px] px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-surface text-ink shadow-panel"
                      : "bg-surface-strong/55 text-muted hover:bg-surface hover:text-ink",
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
                  "pressable rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-surface text-ink shadow-panel"
                    : "bg-surface-strong/50 text-muted hover:bg-surface hover:text-ink",
                )}
              >
                {category}
              </button>
            );
          })}

          {filters.day !== "All" && (
            <button
              type="button"
              onClick={clearDayFilter}
              className="pressable inline-flex items-center gap-2 rounded-full bg-accent-soft/40 px-4 py-2 text-sm font-semibold text-accent"
            >
              {formatDayMonth(filters.day)}
              <X className="h-4 w-4" />
            </button>
          )}

          {(filters.search || filters.category !== "All" || filters.day !== "All") && (
            <button
              type="button"
              onClick={resetFilters}
              className="pressable inline-flex items-center gap-2 rounded-full bg-surface-strong/55 px-4 py-2 text-sm font-semibold text-muted transition hover:bg-surface hover:text-ink"
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
          title="Nothing matches that yet"
          description="Try clearing a filter, searching for something broader, or widening the time window."
          action={
            canManage ? (
              <button
                type="button"
                onClick={openCreate}
                className="pressable rounded-[18px] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Add a transaction
              </button>
            ) : (
              <button
                type="button"
                onClick={resetFilters}
                className="pressable rounded-[18px] bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Clear filters
              </button>
            )
          }
        />
      )}

      {canManage ? (
        <button
          type="button"
          onClick={openCreate}
          className="pressable fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full bg-accent px-5 py-4 text-sm font-semibold text-white shadow-panel transition hover:-translate-y-0.5 hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          New transaction
        </button>
      ) : (
        <Tooltip label="Switch to edit mode to add or change transactions.">
          <span className="fixed bottom-6 right-6 z-30">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-3 rounded-full bg-accent px-5 py-4 text-sm font-semibold text-white opacity-50 shadow-panel"
            >
              <Plus className="h-4 w-4" />
              New transaction
            </button>
          </span>
        </Tooltip>
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
