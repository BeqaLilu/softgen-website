'use client';

import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 → target over `duration` ms, eased on
 * (1 − (1 − p)^3) — a heavy ease-out matching the prototype.
 * Returns the live integer; only runs when `trigger` becomes true.
 */
export function useCountUp(target: number, duration = 1500, trigger: boolean): number {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);

  return v;
}
