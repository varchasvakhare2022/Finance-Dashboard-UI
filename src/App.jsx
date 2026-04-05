import { useEffect, useState } from "react";
import { DashboardView } from "./components/dashboard/DashboardView";
import { InsightsView } from "./components/insights/InsightsView";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { TransactionsView } from "./components/transactions/TransactionsView";
import { useFinanceStore } from "./store/useFinanceStore";
import { cn } from "./utils/finance";

const VIEW_COMPONENTS = {
  dashboard: DashboardView,
  transactions: TransactionsView,
  insights: InsightsView,
};

export default function App() {
  const activeView = useFinanceStore((state) => state.activeView);
  const darkMode = useFinanceStore((state) => state.darkMode);
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
    <div className={cn(darkMode && "dark")}>
      <div className="min-h-screen bg-canvas text-ink transition-colors duration-500">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
          <Sidebar />
          <div className="flex min-h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col gap-4">
            <Topbar />
            <main className="flex-1">
              <ActiveView isLoading={isLoading} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
