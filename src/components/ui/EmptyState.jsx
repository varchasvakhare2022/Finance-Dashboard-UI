import { Surface } from "./Surface";

export function EmptyState({ title, description, action }) {
  return (
    <Surface className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft/55 text-accent">
        <span className="font-display text-xl">•</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-ink">{title}</h3>
        <p className="max-w-md text-sm leading-7 text-muted">{description}</p>
      </div>
      {action}
    </Surface>
  );
}
