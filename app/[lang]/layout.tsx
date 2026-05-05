import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
// TRIAL: brand splash on first session load. Remove this import + the <BrandSplash />
// mount below to revert.
import { BrandSplash } from '@/components/visual/BrandSplash';
import { routing, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(routing.locales as readonly string[]).includes(lang)) notFound();
  setRequestLocale(lang);

  return (
    <ThemeProvider>
      <BrandSplash />
      <Navbar lang={lang as Locale} />
      <main>{children}</main>
      <Footer lang={lang as Locale} />
    </ThemeProvider>
  );
}
