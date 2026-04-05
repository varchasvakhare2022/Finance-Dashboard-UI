import { Surface } from "./Surface";

export function EmptyState({ title, description, action }) {
  return (
    <Surface className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft/70 text-accent">
        <span className="font-display text-2xl">?</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </Surface>
  );
}
