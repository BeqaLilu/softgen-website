import { setRequestLocale } from 'next-intl/server';
import { JobsList } from '@/sections/careers/JobsList';
import { t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getJobs } from '@/lib/dbContent';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

async function nestedCopy() {
  const c = await mergedPageCopy('careers');
  return c ? { careers: c } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await nestedCopy();
  return pageMetadata({
    lang: l,
    path: '/careers',
    title: t(l, 'careers.headline', copy),
    description: t(l, 'careers.intro', copy),
  });
}

export default async function CareersIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;
  const [jobs, copy] = await Promise.all([getJobs(), nestedCopy()]);

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 168, paddingBottom: 56 }}>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            {t(l, 'careers.eyebrow', copy)}
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 1100, marginBottom: 28, fontSize: 'clamp(44px, 5.5vw, 76px)' }}
          >
            {t(l, 'careers.headline', copy)}
          </h1>
          <p className="lead" style={{ maxWidth: 720, marginBottom: 48 }}>
            {t(l, 'careers.intro', copy)}
          </p>
        </div>
      </section>

      <JobsList lang={l} jobs={jobs} />
    </div>
  );
}
