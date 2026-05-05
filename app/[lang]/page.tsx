import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/sections/home/Hero';
import { StatsBand } from '@/sections/home/StatsBand';
import { ServicesSection } from '@/sections/home/ServicesSection';
import { FeaturedProjects } from '@/sections/home/FeaturedProjects';
import { PartnerMarquee } from '@/sections/home/PartnerMarquee';
import { NewsTeaser } from '@/sections/home/NewsTeaser';
import { FinalCTA } from '@/sections/common/FinalCTA';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/content/static';
import { getProjects, getArticles, getServices, getPartners } from '@/lib/dbContent';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await mergedPageCopy('home');
  return pageMetadata({ lang: l, path: '', description: t(l, 'hero.subtext', copy) });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;

  // One round-trip: lists below the fold + the home-page copy overrides.
  const [projects, articles, services, partners, copy] = await Promise.all([
    getProjects(),
    getArticles(),
    getServices(),
    getPartners(),
    mergedPageCopy('home'),
  ]);

  return (
    <div className="page-enter">
      <Hero lang={l} pageContent={copy} />
      <StatsBand lang={l} pageContent={copy} />
      <ServicesSection lang={l} services={services} pageContent={copy} />
      <FeaturedProjects lang={l} projects={projects} pageContent={copy} />
      <PartnerMarquee lang={l} partners={partners} pageContent={copy} />
      <NewsTeaser lang={l} articles={articles} pageContent={copy} />
      <FinalCTA lang={l} pageContent={copy} />
    </div>
  );
}
