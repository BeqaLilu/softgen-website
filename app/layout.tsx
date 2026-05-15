import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { themeBootstrapScript } from '@/components/theme/ThemeProvider';
import { splashBootstrapScript } from '@/components/visual/BrandSplash';
import './globals.css';

/* Inter Tight handles Latin display/body copy; Georgian text falls through to
 * the system Georgian stack declared in globals.css. */
const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter-tight',
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
    <html lang="en" className={`${interTight.variable} ${jbmono.variable}`} suppressHydrationWarning>
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
