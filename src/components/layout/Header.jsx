import {
  LayoutDashboard,
  ReceiptText,
  LineChart,
  Search,
  User,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { cn, ROLE_OPTIONS } from "../../utils/finance";
import { Surface } from "../ui/Surface";
import { Tooltip } from "../ui/Tooltip";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ReceiptText },
  { id: "insights", label: "Insights", icon: LineChart },
];

export function Header() {
  const activeView = useFinanceStore((state) => state.activeView);
  const setActiveView = useFinanceStore((state) => state.setActiveView);
  const selectedRole = useFinanceStore((state) => state.selectedRole);
  const setRole = useFinanceStore((state) => state.setRole);
  const search = useFinanceStore((state) => state.filters.search);
  const setSearch = useFinanceStore((state) => state.setSearch);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 lg:px-8 lg:py-6">
      <Surface
        strong
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8 border-accent/10 shadow-[0_0_20px_rgba(20,184,166,0.05)]"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 animate-float items-center justify-center rounded-2xl bg-gradient-to-tr from-accent to-accent-soft text-white shadow-lg shadow-accent/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="hidden font-display text-xl font-bold tracking-tight text-ink md:block">
              Northstar
            </span>
          </div>

          <nav className="hidden items-center gap-1.5 lg:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-xl px-4 py-2 transition-all duration-300",
                    isActive 
                      ? "bg-accent/5 text-accent" 
                      : "text-muted hover:bg-surface-strong/50 hover:text-ink"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-accent" : "text-muted")} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative hidden max-w-xs md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Quick search..."
              className="h-10 w-48 rounded-xl bg-surface-strong/40 pl-11 pr-4 text-xs font-medium text-ink outline-none transition-all placeholder:text-muted/50 focus:w-64 focus:bg-surface-strong/60 focus:ring-1 focus:ring-accent/30 lg:w-56 lg:focus:w-64 border border-transparent focus:border-accent/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl bg-surface-strong/40 p-1 border border-line/50">
              {ROLE_OPTIONS.map((role) => {
                const isSelected = selectedRole === role.value;
                return (
                  <button
                    key={role.value}
                    onClick={() => setRole(role.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
                      isSelected
                        ? "bg-surface text-accent shadow-sm border border-accent/20"
                        : "text-muted hover:text-ink"
                    )}
                  >
                    {role.value === 'admin' ? <ShieldAlert className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {role.label}
                  </button>
                );
              })}
            </div>

            <Tooltip label="Account Settings">
              <button className="pressable flex h-10 w-10 items-center justify-center rounded-xl bg-surface-strong/40 text-muted transition hover:bg-surface hover:text-ink border border-line/50">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-surface-strong to-line flex items-center justify-center">
                   <User className="h-4 w-4" />
                </div>
              </button>
            </Tooltip>
          </div>
        </div>
      </Surface>

      {/* Mobile Nav */}
      <nav className="mt-4 flex items-center justify-center gap-2 lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "group nav-item px-3 py-2",
                isActive ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted")} />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
