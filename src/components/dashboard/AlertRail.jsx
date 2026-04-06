import {
  Activity,
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
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Needs attention</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">What looks off right now</h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted">
          Start here if you want the quickest explanation for what needs a closer look.
        </p>
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-3">
        {alerts.map((alert) => {
          const Icon = ICONS[alert.icon] ?? TriangleAlert;
          const tone = TONES[alert.tone] ?? TONES.warning;

          return (
            <div
              key={alert.id}
              className={cn(
                "hover-lift flex h-full flex-col justify-between rounded-[24px] border p-4 transition duration-200",
                tone.card,
              )}
            >
              <div className="flex items-start gap-4">
                <span className={cn("mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl", tone.icon)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{alert.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{alert.detail}</p>
                </div>
              </div>

              {alert.actionLabel ? (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => onAction(alert)}
                    className={cn(
                      "pressable inline-flex rounded-full border px-3 py-2 text-xs font-semibold transition duration-200",
                      tone.button,
                    )}
                  >
                    {alert.actionLabel}
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
