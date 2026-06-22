import { cn } from "../../utils/finance";

export function Surface({ children, className, strong = false, ...props }) {
  return (
    <section className={cn(strong ? "panel-strong bg-accent-soft/10" : "panel bg-accent-soft/5", className)} {...props}>
      {children}
    </section>
  );
}
