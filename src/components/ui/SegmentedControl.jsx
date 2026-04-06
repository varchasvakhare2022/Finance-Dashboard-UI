import { cn } from "../../utils/finance";

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex rounded-[18px] border border-line/60 bg-surface-strong/72 p-1 shadow-sm backdrop-blur",
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
              "pressable rounded-[14px] px-3.5 py-2 text-sm font-semibold transition duration-200",
              active
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:bg-surface hover:text-ink dark:hover:bg-surface dark:hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
