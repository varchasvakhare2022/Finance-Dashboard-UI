import { useEffect, useState } from "react";
import { DashboardView } from "./components/dashboard/DashboardView";
import { InsightsView } from "./components/insights/InsightsView";
import { Header } from "./components/layout/Header";
import { TransactionsView } from "./components/transactions/TransactionsView";
import { useFinanceStore } from "./store/useFinanceStore";

const VIEW_COMPONENTS = {
  dashboard: DashboardView,
  transactions: TransactionsView,
  insights: InsightsView,
};

export default function App() {
  const activeView = useFinanceStore((state) => state.activeView);
  const hydrated = useFinanceStore((state) => state.hydrated);
  const setHydrated = useFinanceStore((state) => state.setHydrated);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    document.title = "Northstar Finance";
  }, []);

  useEffect(() => {
    if (useFinanceStore.persist.hasHydrated()) {
      setHydrated(true);
    }
  }, [setHydrated]);

  useEffect(() => {
    if (!hydrated) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setBooting(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [hydrated]);

  const ActiveView = VIEW_COMPONENTS[activeView] ?? DashboardView;
  const isLoading = !hydrated || booting;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 lg:px-8">
        <div key={activeView} className="h-full animate-fade-up">
          <ActiveView isLoading={isLoading} />
        </div>
      </main>

      {/* Modern Backdrop Gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-warning/5 blur-[140px]" />
        <div className="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-accent-soft/10 blur-[100px]" />
      </div>
    </div>
  );
}

