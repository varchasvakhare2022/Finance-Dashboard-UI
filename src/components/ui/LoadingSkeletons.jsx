import { Surface } from "./Surface";

function Block({ className }) {
  return <div className={`shimmer animate-shimmer rounded-2xl ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-fade-up">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {[1, 2].map((item) => (
          <Surface key={item} className="space-y-4 px-5 py-5">
            <Block className="h-5 w-32" />
            <Block className="h-16 w-2/3" />
            <Block className="h-24 w-full" />
            <Block className="h-24 w-full" />
          </Surface>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Surface key={item} className="space-y-4 px-5 py-5">
            <Block className="h-4 w-24" />
            <Block className="h-10 w-40" />
            <Block className="h-20 w-full" />
          </Surface>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,1fr)]">
        <Surface className="space-y-4 px-5 py-5">
          <Block className="h-5 w-48" />
          <Block className="h-[320px] w-full" />
        </Surface>
        <Surface className="space-y-4 px-5 py-5">
          <Block className="h-5 w-40" />
          <Block className="h-[320px] w-full" />
        </Surface>
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-4 animate-fade-up">
      <Surface className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap gap-3">
          <Block className="h-12 w-72" />
          <Block className="h-12 w-32" />
          <Block className="h-12 w-32" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Block key={index} className="h-10 w-28" />
          ))}
        </div>
      </Surface>
      <Surface className="space-y-3 px-5 py-5">
        {Array.from({ length: 7 }).map((_, index) => (
          <Block key={index} className="h-14 w-full" />
        ))}
      </Surface>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-4 animate-fade-up">
      <Surface className="space-y-4 px-5 py-5">
        <Block className="h-5 w-48" />
        <Block className="h-14 w-2/3" />
        <Block className="h-4 w-full" />
        <Block className="h-4 w-4/5" />
      </Surface>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Surface key={index} className="space-y-4 px-5 py-5">
            <Block className="h-10 w-10 rounded-2xl" />
            <Block className="h-6 w-36" />
            <Block className="h-4 w-full" />
          </Surface>
        ))}
      </div>
    </div>
  );
}
