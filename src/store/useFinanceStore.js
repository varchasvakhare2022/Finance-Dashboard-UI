import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { buildMockTransactions } from "../data/mockTransactions";

const defaultFilters = {
  search: "",
  category: "All",
  day: "All",
  sortBy: "date",
  sortDirection: "desc",
};

function sortByDate(transactions) {
  return [...transactions].sort((left, right) => left.date.localeCompare(right.date));
}

function withUpdatedAt(partial) {
  return {
    ...partial,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: sortByDate(buildMockTransactions()),
      filters: defaultFilters,
      dateRange: "30d",
      chartMode: "net",
      activeView: "dashboard",
      dashboardMode: "savings",
      lastUpdatedAt: new Date().toISOString(),
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      setDateRange: (dateRange) => set({ dateRange }),
      setChartMode: (chartMode) => set({ chartMode }),
      setActiveView: (activeView) => set({ activeView }),
      setDashboardMode: (dashboardMode) => set({ dashboardMode }),
      setSearch: (search) =>
        set((state) => ({
          filters: {
            ...state.filters,
            search,
          },
        })),
      setCategoryFilter: (category) =>
        set((state) => ({
          filters: {
            ...state.filters,
            category,
          },
        })),
      setDayFilter: (day) =>
        set((state) => ({
          filters: {
            ...state.filters,
            day,
          },
        })),
      clearCategoryFilter: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            category: "All",
          },
        })),
      clearDayFilter: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            day: "All",
          },
        })),
      toggleSort: (sortBy) =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortBy,
            sortDirection:
              state.filters.sortBy === sortBy && state.filters.sortDirection === "desc"
                ? "asc"
                : "desc",
          },
        })),
      clearFilters: () => set({ filters: defaultFilters }),
      addTransaction: (transaction) =>
        set((state) =>
          withUpdatedAt({
            transactions: sortByDate([...state.transactions, transaction]),
          }),
        ),
      updateTransaction: (id, updates) =>
        set((state) =>
          withUpdatedAt({
            transactions: sortByDate(
              state.transactions.map((transaction) =>
                transaction.id === id ? { ...transaction, ...updates } : transaction,
              ),
            ),
          }),
        ),
      deleteTransaction: (id) =>
        set((state) =>
          withUpdatedAt({
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
          }),
        ),
    }),
    {
      name: "northstar-finance-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        filters: state.filters,
        dateRange: state.dateRange,
        chartMode: state.chartMode,
        activeView: state.activeView,
        dashboardMode: state.dashboardMode,
        lastUpdatedAt: state.lastUpdatedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
