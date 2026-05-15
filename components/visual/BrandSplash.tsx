'use client';

/**
 * Brand splash — one-shot logo reveal that plays on first page load
 * (per browser session). After ~2.5 s it fades out and the underlying
 * page is visible.
 *
 * To avoid a brief flash of the page before the overlay mounts, the
 * splash is rendered server-side **unconditionally**. An inline boot
 * script (`splashBootstrapScript`, exported below; mounted in
 * app/layout.tsx <head>) sets `data-splash-shown="1"` on <html>
 * synchronously before paint when the user has already seen the splash
 * this session OR has prefers-reduced-motion. globals.css then hides
 * the overlay via that attribute — so return visitors and reduced-motion
 * users never see a frame of it.
 *
 * Trial component — easy to remove:
 *   1. Delete this file
 *   2. Remove the import + <BrandSplash /> mount from app/[lang]/layout.tsx
 *   3. Remove the import + <script /> for splashBootstrapScript from app/layout.tsx
 *   4. Remove the [data-splash-shown="1"] rule from app/globals.css
 *
 * No external animation deps — pure CSS keyframes.
 *
 * Tuning knobs:
 *   - SHOW_EVERY_TIME (false) — set true while iterating to skip the
 *     sessionStorage gate so you see the animation on every reload.
 *   - DURATION_MS — total time from mount to unmount.
 */

import { useEffect, useState } from 'react';

const SHOW_EVERY_TIME = false;
const SESSION_KEY = 'softgen-splash-shown';

const REVEAL_MS = 1800;       // laser scan + logo clip-path reveal
const HOLD_MS = 600;          // logo fully visible
const FADE_OUT_MS = 500;      // backdrop fade out
const DURATION_MS = REVEAL_MS + HOLD_MS + FADE_OUT_MS;

/** Inlined into <head> by app/layout.tsx — runs synchronously before paint. */
export const splashBootstrapScript = `
(function () {
  try {
    if (${SHOW_EVERY_TIME ? 'false' : "sessionStorage.getItem('" + SESSION_KEY + "')"}) {
      document.documentElement.dataset.splashShown = '1';
      return;
    }
  } catch (e) {}
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.dataset.splashShown = '1';
    }
  } catch (e) {}
})();
`;

export function BrandSplash() {
  // Always render on first paint — the boot script + globals.css hides the
  // overlay synchronously for return visitors / reduced-motion, so nobody
  // sees a flash either way.
  const [mounted, setMounted] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    let alreadyShown = false;
    if (!SHOW_EVERY_TIME) {
      try {
        alreadyShown = !!sessionStorage.getItem(SESSION_KEY);
      } catch {
        // sessionStorage disabled (private mode, strict CSP) — show it.
      }
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadyShown || reducedMotion) {
      // Boot script already hid us via CSS; unmount cleanly so React doesn't
      // hold the overlay tree in memory.
      setMounted(false);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* noop */ }
      return;
    }

    const tFade = window.setTimeout(() => setFadingOut(true), REVEAL_MS + HOLD_MS);
    const tDone = window.setTimeout(() => {
      setMounted(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
        document.documentElement.dataset.splashShown = '1';
      } catch { /* noop */ }
    }, DURATION_MS);

    return () => {
      window.clearTimeout(tFade);
      window.clearTimeout(tDone);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      role="presentation"
      aria-hidden
      className={`brand-splash ${fadingOut ? 'is-out' : ''}`}
    >
      {/* Radial backdrop glow */}
      <div className="brand-splash__bg-glow" />

      {/* Subtle floating particles — small primary-color dots */}
      <span className="brand-splash__particle" style={{ left: '25%', top: '30%', animationDelay: '0ms' }} />
      <span className="brand-splash__particle" style={{ left: '70%', top: '35%', animationDelay: '400ms' }} />
      <span className="brand-splash__particle" style={{ left: '50%', top: '65%', animationDelay: '800ms' }} />
      <span className="brand-splash__particle" style={{ left: '20%', top: '70%', animationDelay: '600ms' }} />
      <span className="brand-splash__particle" style={{ left: '80%', top: '60%', animationDelay: '200ms' }} />

      {/* Logo composition: glow halo + laser sweep + clip-path reveal */}
      <div className="brand-splash__logo-wrap">
        <div className="brand-splash__halo" />
        <div className="brand-splash__laser" />
        <div className="brand-splash__logo">
          {/* Save your logo to public/logo.png — that file is served at /logo.png.
              Plain <img> rather than next/image because the splash is one-shot,
              so the optimizer's lazy-loading + srcset machinery is overhead we
              don't need. width/height set to prevent CLS on the splash itself. */}
          <img
            src="/logo.webp"
            alt="Softgen"
            width={160}
            height={160}
            decoding="sync"
          />
        </div>
      </div>

      {/* Wordmark fades in after the laser passes */}
      <div className="brand-splash__wordmark">
        Softgen<span style={{ color: 'var(--primary)' }}>.</span>
      </div>

      <style>{`
        .brand-splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--bg-deep);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 36px;
          opacity: 1;
          transition: opacity ${FADE_OUT_MS}ms var(--ease-out);
        }
        .brand-splash.is-out {
          opacity: 0;
          pointer-events: none;
        }

        .brand-splash__bg-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(closest-side at 50% 50%,
              color-mix(in oklab, var(--primary) 35%, transparent) 0%,
              transparent 65%);
          opacity: 0;
          animation: bs-bg-fade 800ms 200ms var(--ease-out) forwards;
        }

        .brand-splash__particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary), 0 0 16px var(--primary);
          opacity: 0;
          animation: bs-particle 1600ms ease-in-out infinite;
        }

        .brand-splash__logo-wrap {
          position: relative;
          width: 160px;
          height: 160px;
        }

        .brand-splash__halo {
          position: absolute;
          inset: -36px;
          border-radius: 50%;
          background: var(--primary);
          filter: blur(40px);
          opacity: 0;
          animation: bs-halo ${REVEAL_MS}ms 200ms var(--ease-out) forwards;
        }

        .brand-splash__laser {
          position: absolute;
          left: -16px;
          right: -16px;
          top: 0;
          height: 3px;
          background: linear-gradient(90deg,
            transparent,
            color-mix(in oklab, var(--primary) 70%, white) 50%,
            transparent);
          filter: blur(2px) drop-shadow(0 0 6px var(--primary));
          opacity: 0;
          z-index: 2;
          animation: bs-laser ${REVEAL_MS}ms 200ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .brand-splash__logo {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          clip-path: inset(100% 0 0 0);
          opacity: 0;
          animation: bs-logo ${REVEAL_MS}ms 200ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .brand-splash__wordmark {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 28px;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          opacity: 0;
          transform: translateY(8px);
          animation: bs-wordmark 600ms ${REVEAL_MS - 200}ms var(--ease-out) forwards;
        }

        @keyframes bs-bg-fade {
          to { opacity: 0.6; }
        }
        @keyframes bs-particle {
          0%, 100% { transform: scale(0.6); opacity: 0.2; }
          50%      { transform: scale(1.4); opacity: 0.9; }
        }
        @keyframes bs-halo {
          0%   { opacity: 0; }
          50%  { opacity: 0.5; }
          100% { opacity: 0.35; }
        }
        @keyframes bs-laser {
          0%   { top: 0;    opacity: 0; }
          10%  {            opacity: 1; }
          90%  {            opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes bs-logo {
          0%   { clip-path: inset(100% 0 0 0); opacity: 0; }
          5%   {                                opacity: 1; }
          100% { clip-path: inset(0 0 0 0);    opacity: 1; }
        }
        @keyframes bs-wordmark {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
