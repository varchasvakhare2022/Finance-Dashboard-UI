import { cn } from "../../utils/finance";

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex rounded-2xl border border-line/80 bg-surface/70 p-1 shadow-sm backdrop-blur",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition duration-200",
              active
                ? "bg-ink text-white shadow-sm dark:bg-white dark:text-slate-900"
                : "text-muted hover:text-ink dark:hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
