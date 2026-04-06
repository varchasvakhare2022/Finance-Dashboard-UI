import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/finance";

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

export function AnimatedNumber({
  value,
  formatter = (next) => String(Math.round(next)),
  className,
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = Number.isFinite(value) ? value : 0;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return undefined;
    }

    let frameId = 0;
    const startTime = performance.now();
    const duration = 700;

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const nextValue = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      } else {
        previousValueRef.current = endValue;
      }
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {formatter(displayValue)}
    </span>
  );
}
