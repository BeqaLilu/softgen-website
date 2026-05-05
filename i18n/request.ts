import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'ka')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    // Messages are managed via content/static.ts (CONTENT object) — next-intl
    // is used here for routing only; we don't ship a messages JSON because
    // every visible string is bilingual-by-key in CONTENT.
    messages: {},
  };
});
