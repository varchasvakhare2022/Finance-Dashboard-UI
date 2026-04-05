import { cn } from "../../utils/finance";

export function Tooltip({ children, label, className }) {
  if (!label) {
    return children;
  }

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max -translate-x-1/2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover/tooltip:opacity-100 dark:bg-slate-100 dark:text-slate-900">
        {label}
      </span>
    </span>
  );
}
