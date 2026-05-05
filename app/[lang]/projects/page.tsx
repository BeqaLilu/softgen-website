import { setRequestLocale } from 'next-intl/server';
import { ProjectsList } from '@/sections/projects/ProjectsList';
import { FinalCTA } from '@/sections/common/FinalCTA';
import { t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getProjects } from '@/lib/dbContent';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

async function nestedCopy() {
  const c = await mergedPageCopy('projects');
  return c ? { projectsPage: c } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await nestedCopy();
  return pageMetadata({
    lang: l,
    path: '/projects',
    title: t(l, 'projectsPage.headline', copy),
    description: t(l, 'projectsPage.intro', copy),
  });
}

export default async function ProjectsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;
  const [projects, copy] = await Promise.all([getProjects(), nestedCopy()]);

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 168, paddingBottom: 0 }}>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            {t(l, 'projectsPage.eyebrow', copy)}
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 1100, marginBottom: 28, fontSize: 'clamp(44px, 5.5vw, 76px)' }}
          >
            {t(l, 'projectsPage.headline', copy)}
          </h1>
          <p className="lead" style={{ maxWidth: 720, marginBottom: 48 }}>
            {t(l, 'projectsPage.intro', copy)}
          </p>
        </div>
      </section>

      <ProjectsList lang={l} projects={projects} />

      <FinalCTA lang={l} />
    </div>
  );
}
