import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { getSettings } from '@/lib/settings';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://softgen.ge';

/**
 * Per build-prompt §"Definition of done": per-page <title>, <meta description>,
 * OG image, canonical, hreflang alternates.
 *
 * Defaults come from the runtime `pages.settings` blob (editable in
 * `/admin/settings`), so the admin can change site-wide title / description
 * / OG image without a redeploy. Page-supplied `title` / `description`
 * always win.
 */
export async function pageMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Locale;
  path: string; // path *inside* the locale, e.g. "/about" or "/projects/tbc-corporate-portal"
  title?: string;
  description?: string;
}): Promise<Metadata> {
  const settings = await getSettings();
  const defaultTitle = settings.seo.defaultTitle[lang] || settings.seo.defaultTitle.en;
  const defaultDesc = settings.seo.defaultDescription[lang] || settings.seo.defaultDescription.en;
  const fullTitle = title ? `${title} — ${settings.general.companyName}` : defaultTitle;
  const desc = description ?? defaultDesc;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  const ogImage = settings.seo.defaultOgImageUrl;

  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/${lang}${path}`,
      languages,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${lang}${path}`,
      title: fullTitle,
      description: desc,
      siteName: settings.general.companyName,
      locale: lang === 'en' ? 'en_US' : 'ka_GE',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
