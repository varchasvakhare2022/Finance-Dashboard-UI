import {
  Activity,
  ArrowRight,
  ChartPie,
  PiggyBank,
  ShieldCheck,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { cn } from "../../utils/finance";
import { Surface } from "../ui/Surface";

const ICONS = {
  activity: Activity,
  "chart-pie": ChartPie,
  "piggy-bank": PiggyBank,
  "shield-check": ShieldCheck,
  "triangle-alert": TriangleAlert,
  wallet: Wallet,
};

const TONES = {
  positive: {
    card: "border-line/50 bg-surface/72",
    icon: "bg-accent-soft/70 text-accent",
    button: "border-line/55 text-ink hover:border-accent/25 hover:bg-surface",
  },
  warning: {
    card: "border-warning/20 bg-warning-soft/18",
    icon: "bg-warning-soft/75 text-warning",
    button: "border-line/55 text-ink hover:border-warning/25 hover:bg-surface",
  },
  critical: {
    card: "border-danger/20 bg-danger-soft/16",
    icon: "bg-danger-soft/75 text-danger",
    button: "border-line/55 text-ink hover:border-danger/25 hover:bg-surface",
  },
};

export function AlertRail({ alerts, onAction }) {
  return (
    <Surface className="px-5 py-5 animate-fade-up lg:px-6 lg:py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <div className="min-w-[240px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Analysis Pulse</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">What looks off right now</h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted/80">
          Start here if you want the quickest explanation for what needs a closer look.
        </p>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => {
          const Icon = ICONS[alert.icon] ?? TriangleAlert;
          const tone = TONES[alert.tone] ?? TONES.warning;

          return (
            <div
              key={alert.id}
              className={cn(
                "group hover-lift flex h-full flex-col justify-between rounded-[28px] border p-5 transition duration-300",
                tone.card,
              )}
            >
              <div className="flex items-start gap-4">
                <span className={cn("mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-105", tone.icon)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink leading-tight">{alert.title}</p>
                  <p className="mt-3 text-[13px] leading-6 text-muted/90">{alert.detail}</p>
                </div>
              </div>

              {alert.actionLabel ? (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => onAction(alert)}
                    className={cn(
                      "pressable inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                      tone.button,
                    )}
                  >
                    {alert.actionLabel}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

