import { ArrowRight, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import { DASHBOARD_MODE_OPTIONS, cn } from "../../utils/finance";
import { Surface } from "../ui/Surface";

const TONE_MAP = {
  positive: {
    ring: "#0f766e",
    chip: "bg-accent-soft/80 text-accent",
    icon: ShieldCheck,
  },
  warning: {
    ring: "#d97706",
    chip: "bg-warning-soft/80 text-warning",
    icon: TriangleAlert,
  },
  critical: {
    ring: "#dc2626",
    chip: "bg-danger-soft/80 text-danger",
    icon: ShieldAlert,
  },
};

export function FinancialHealthCard({ health, dashboardMode, onOpenInsights }) {
  const tone = TONE_MAP[health.tone] ?? TONE_MAP.warning;
  const Icon = tone.icon;
  const circumference = 2 * Math.PI * 42;
  const strokeOffset = circumference - (health.score / 100) * circumference;
  const activeMode = DASHBOARD_MODE_OPTIONS.find((option) => option.value === dashboardMode);

  return (
    <Surface strong className="h-full px-5 py-5 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Financial health</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">Decision confidence score</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Weighted across income coverage, savings rate, and unusual spending spikes.
          </p>
        </div>
        <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold", tone.chip)}>
          <Icon className="h-4 w-4" />
          {health.label}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center self-center lg:self-auto">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={tone.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
            />
          </svg>
          <div className="absolute text-center">
            <p className="font-display text-4xl font-bold text-ink">{health.score}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">out of 100</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="rounded-[24px] border border-line/80 bg-surface/75 p-4">
            <p className="text-sm font-semibold text-ink">{health.summary}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{health.recommendation}</p>
            <div className="mt-4 inline-flex rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {activeMode?.label ?? "Savings Focus"} active
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {health.factors.map((factor) => (
              <div key={factor.id} className="rounded-[22px] border border-line/80 bg-surface-strong/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{factor.title}</p>
                <p className="mt-2 text-xl font-bold text-ink">{factor.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{factor.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onOpenInsights}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          Deep dive insights
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Surface>
  );
}
