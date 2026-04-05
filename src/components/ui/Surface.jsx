import { cn } from "../../utils/finance";

export function Surface({ children, className, strong = false, ...props }) {
  return (
    <section className={cn(strong ? "panel-strong" : "panel", className)} {...props}>
      {children}
    </section>
  );
}
