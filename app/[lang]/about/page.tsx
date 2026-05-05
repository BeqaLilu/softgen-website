import { setRequestLocale } from 'next-intl/server';
import { AboutHero } from '@/sections/about/AboutHero';
import { Timeline } from '@/sections/about/Timeline';
import { Values } from '@/sections/about/Values';
import { TeamGrid } from '@/sections/about/TeamGrid';
import { FinalCTA } from '@/sections/common/FinalCTA';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/content/static';
import { getTeam } from '@/lib/dbContent';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await mergedPageCopy('about');
  return pageMetadata({
    lang: l,
    path: '/about',
    title: t(l, 'about.headline', copy ? { about: copy } : undefined),
    description: t(l, 'about.intro', copy ? { about: copy } : undefined),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;
  const [team, copy] = await Promise.all([getTeam(), mergedPageCopy('about')]);
  // The about row stores the inner CONTENT.about object; nest under `about.`
  // so `t(lang, "about.headline", pageContent)` resolves correctly.
  const pageContent = copy ? { about: copy } : undefined;
  return (
    <div className="page-enter">
      <AboutHero lang={l} pageContent={pageContent} />
      <Timeline lang={l} pageContent={pageContent} />
      <Values lang={l} pageContent={pageContent} />
      <TeamGrid lang={l} team={team} pageContent={pageContent} />
      <FinalCTA lang={l} />
    </div>
  );
}
