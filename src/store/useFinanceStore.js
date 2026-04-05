import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { buildMockTransactions } from "../data/mockTransactions";

const defaultFilters = {
  search: "",
  category: "All",
  sortBy: "date",
  sortDirection: "desc",
};

function sortByDate(transactions) {
  return [...transactions].sort((left, right) => left.date.localeCompare(right.date));
}

export const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: sortByDate(buildMockTransactions()),
      filters: defaultFilters,
      selectedRole: "admin",
      dateRange: "30d",
      activeView: "dashboard",
      darkMode: false,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      setRole: (selectedRole) => set({ selectedRole }),
      setDateRange: (dateRange) => set({ dateRange }),
      setActiveView: (activeView) => set({ activeView }),
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
      clearCategoryFilter: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            category: "All",
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
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: sortByDate([...state.transactions, transaction]),
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: sortByDate(
            state.transactions.map((transaction) =>
              transaction.id === id ? { ...transaction, ...updates } : transaction,
            ),
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        })),
    }),
    {
      name: "northstar-finance-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        filters: state.filters,
        selectedRole: state.selectedRole,
        dateRange: state.dateRange,
        activeView: state.activeView,
        darkMode: state.darkMode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
