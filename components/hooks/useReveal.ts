'use client';

import { useEffect, useRef } from 'react';

/**
 * Adds the `.in` class to the element when it scrolls into view.
 * Pair with the `.reveal` class in globals.css.
 *
 * Disconnects after first activation (`one-shot`) so the animation
 * doesn't replay on scroll-back.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
