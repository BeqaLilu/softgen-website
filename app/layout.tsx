import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { themeBootstrapScript } from '@/components/theme/ThemeProvider';
import { splashBootstrapScript } from '@/components/visual/BrandSplash';
import './globals.css';

/* Per build-prompt §"Build order" Phase 1.3: Plus Jakarta Sans (display),
 * Inter (body), JetBrains Mono (numerics), Latin + Georgian subsets. The
 * spec asks for next/font/local with the prototype's woff2 files; that
 * swap is documented in NEXT_STEPS.md and is a drop-in replacement —
 * the CSS variable names below stay identical. */
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jbmono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jbmono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Softgen — Enterprise software, built in Tbilisi since 2008',
  description:
    'Softgen builds the systems Georgian banks, government agencies and enterprises rely on every day.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${jbmono.variable}`} suppressHydrationWarning>
      <head>
        {/* Set data-theme before paint to avoid a flash of light theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        {/* Mark <html> with data-splash-shown=1 for return visitors / reduced
            motion, so globals.css hides the splash overlay before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: splashBootstrapScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
