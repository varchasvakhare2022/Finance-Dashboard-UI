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
  positive: "bg-accent-soft/70 text-accent",
  warning: "bg-warning-soft/80 text-warning",
  critical: "bg-danger-soft/80 text-danger",
};

export function AlertRail({ alerts, onAction }) {
  return (
    <Surface className="h-full px-5 py-5 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Smart alerts</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">What needs attention now</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Alerts are ranked by risk so you can prioritize what to inspect next.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.map((alert) => {
          const Icon = ICONS[alert.icon] ?? TriangleAlert;

          return (
            <div key={alert.id} className="rounded-[24px] border border-line/80 bg-surface-strong/75 p-4 transition hover:border-accent/20 hover:bg-surface">
              <div className="flex items-start gap-4">
                <span className={cn("mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl", TONES[alert.tone] ?? TONES.warning)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{alert.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{alert.detail}</p>
                    </div>
                    {alert.actionLabel ? (
                      <button
                        type="button"
                        onClick={() => onAction(alert)}
                        className="inline-flex flex-shrink-0 rounded-full border border-line/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-accent/30 hover:text-accent"
                      >
                        {alert.actionLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
