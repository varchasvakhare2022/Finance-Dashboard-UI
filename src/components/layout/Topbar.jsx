import { MoonStar, SunMedium } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { DATE_RANGE_OPTIONS, ROLE_OPTIONS } from "../../utils/finance";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Surface } from "../ui/Surface";

const TITLES = {
  dashboard: {
    title: "Portfolio overview",
    subtitle: "Track the balance, spend mix, and movement across your selected horizon.",
  },
  transactions: {
    title: "Transaction command center",
    subtitle: "Filter quickly, inspect details, and manage ledger entries with confidence.",
  },
  insights: {
    title: "Decision-ready insights",
    subtitle: "Surface spend signals and month-over-month shifts that deserve a closer look.",
  },
};

export function Topbar() {
  const activeView = useFinanceStore((state) => state.activeView);
  const selectedRole = useFinanceStore((state) => state.selectedRole);
  const setRole = useFinanceStore((state) => state.setRole);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const setDateRange = useFinanceStore((state) => state.setDateRange);
  const darkMode = useFinanceStore((state) => state.darkMode);
  const toggleDarkMode = useFinanceStore((state) => state.toggleDarkMode);

  const meta = TITLES[activeView] ?? TITLES.dashboard;
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <Surface className="px-4 py-4 lg:px-5 lg:py-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{today}</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">{meta.title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted">{meta.subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Role</p>
            <SegmentedControl options={ROLE_OPTIONS} value={selectedRole} onChange={setRole} />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Date range</p>
            <SegmentedControl
              options={DATE_RANGE_OPTIONS}
              value={dateRange}
              onChange={setDateRange}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Theme</p>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex h-[50px] items-center gap-3 rounded-2xl border border-line/80 bg-surface/70 px-4 text-sm font-semibold text-ink transition hover:border-accent/40 hover:text-accent"
            >
              {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </div>
    </Surface>
  );
}
