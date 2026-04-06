import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { DASHBOARD_MODE_OPTIONS, cn } from "../../utils/finance";
import { Surface } from "../ui/Surface";
import { AnimatedNumber } from "../ui/AnimatedNumber";

const TONE_MAP = {
  positive: {
    ring: "#0f766e",
    chip: "bg-accent-soft/70 text-accent",
    icon: ShieldCheck,
  },
  warning: {
    ring: "#d97706",
    chip: "bg-warning-soft/75 text-warning",
    icon: TriangleAlert,
  },
  critical: {
    ring: "#dc2626",
    chip: "bg-danger-soft/75 text-danger",
    icon: ShieldAlert,
  },
};

export function FinancialHealthCard({ health, dashboardMode, healthDelta, onOpenInsights }) {
  const tone = TONE_MAP[health.tone] ?? TONE_MAP.warning;
  const Icon = tone.icon;
  const TrendIcon = healthDelta >= 0 ? ArrowUpRight : ArrowDownRight;
  const circumference = 2 * Math.PI * 42;
  const strokeOffset = circumference - (health.score / 100) * circumference;
  const activeMode = DASHBOARD_MODE_OPTIONS.find((option) => option.value === dashboardMode);

  return (
    <Surface strong className="relative flex h-full flex-col overflow-hidden px-5 py-5 animate-fade-up lg:px-7 lg:py-7">
      {/* Decorative Aurora Backdrop */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative mb-8 flex items-start justify-between gap-6">
        <div className="max-w-[20rem]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Performance Signal</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink lg:text-3xl">
            Overall wellbeing
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            Computed from income cover, savings rate, and spend volatility.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={tone.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <p className="font-display text-3xl font-bold tracking-tighter text-ink leading-none">
                <AnimatedNumber value={health.score} formatter={(value) => String(Math.round(value))} />
              </p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-muted">pts</p>
            </div>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              healthDelta >= 0 ? "bg-accent-soft/70 text-accent" : "bg-danger-soft/70 text-danger",
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {healthDelta >= 0 ? "+" : ""}
            {healthDelta}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {/* Summary Bento Box */}
        <div className="rounded-[22px] border border-line/40 bg-surface/50 p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <span className={cn("inline-flex h-2 w-2 rounded-full", tone.chip.split(' ')[0])} />
             <p className="text-xs font-bold uppercase tracking-wider text-muted">{health.label} Standing</p>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-ink">{health.summary}</p>
          <p className="mt-1 text-[13px] leading-6 text-muted">{health.recommendation}</p>
        </div>

        {/* Factors Grid - Auto Stack for clarity */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {health.factors.map((factor) => (
            <div
              key={factor.id}
              className="group rounded-[20px] border border-line/40 bg-surface/40 p-4 transition-all duration-300 hover:border-accent/30 hover:bg-surface/60"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{factor.title}</p>
                <div className="h-1.5 w-1.5 rounded-full bg-accent/40" />
              </div>
              <p className="mt-2 text-xl font-bold tracking-tight text-ink">{factor.value}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted line-clamp-2 group-hover:line-clamp-none">
                {factor.detail}
              </p>
              
              {/* Subtle visual progress nudge */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line/20">
                <div 
                  className="h-full bg-accent/40 transition-all duration-1000"
                  style={{ width: factor.id === 'burn' ? '30%' : factor.id === 'savings' ? '65%' : '80%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onOpenInsights}
          className="pressable group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent/10 py-3 text-xs font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white"
        >
          View Full Breakdown
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Surface>


  );
}
