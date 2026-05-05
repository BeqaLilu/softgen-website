import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LinkUnderline } from '@/components/ui/LinkUnderline';
import { Chip } from '@/components/ui/Chip';
import { ApplyForm } from '@/sections/careers/ApplyForm';
import { CONTENT, t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getJobs, getJob } from '@/lib/dbContent';

export async function generateStaticParams() {
  const jobs = await getJobs();
  return routing.locales.flatMap((lang) => jobs.map((j) => ({ lang, slug: j.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Locale;
  const j = await getJob(slug);
  if (!j) return pageMetadata({ lang: l, path: `/careers/${slug}` });
  return pageMetadata({ lang: l, path: `/careers/${slug}`, title: j.title[l], description: j.description[l] });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;

  const j = await getJob(slug);
  if (!j) notFound();

  const expectations =
    l === 'en'
      ? [
          '5+ years of relevant experience',
          'Strong written communication',
          'Comfort with on-call rotation',
          'Ability to read documentation in English',
        ]
      : [
          '5+ წლის შესაბამისი გამოცდილება',
          'ძლიერი წერილობითი კომუნიკაცია',
          'On-call როტაციის მიღება',
          'ინგლისური ენის ცოდნა',
        ];

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 144, paddingBottom: 56 }}>
        <div className="container-x">
          <LinkUnderline href={`/${l}/careers`} arrow="left" style={{ marginBottom: 32 }}>
            {l === 'en' ? 'All openings' : 'ყველა პოზიცია'}
          </LinkUnderline>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <Chip>{j.department}</Chip>
            <Chip variant="outline">{CONTENT.careers.types[j.type][l]}</Chip>
            <Chip variant="outline">{j.location}</Chip>
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 1100, marginBottom: 24, fontSize: 'clamp(36px, 4.4vw, 56px)' }}
          >
            {j.title[l]}
          </h1>
          <p className="lead" style={{ maxWidth: 720 }}>
            {j.description[l]}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div
          className="container-x"
          style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'start' }}
        >
          <div>
            <h3 className="h3" style={{ marginBottom: 16 }}>
              {l === 'en' ? 'About the role' : 'პოზიციის შესახებ'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              {l === 'en'
                ? "You'll join an existing team of senior engineers working on production systems used by hundreds of thousands of people daily. We don't move people between projects on whims; expect to own one system end-to-end for at least 18 months."
                : 'თქვენ შეუერთდებით სენიორ ინჟინერთა გუნდს, რომელიც მუშაობს რეალურ სისტემებზე, საიდანაც სარგებლობენ ასობით ათასი ადამიანი ყოველდღე.'}
            </p>
            <h4 className="h4" style={{ marginTop: 32, marginBottom: 12 }}>
              {l === 'en' ? 'What we expect' : 'რას მოველით'}
            </h4>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expectations.map((x, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--primary)' }}>—</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: 32, position: 'sticky', top: 100 }}>
            <h4 className="h4" style={{ marginBottom: 20 }}>
              {t(l, 'careers.apply.title')}
            </h4>
            <ApplyForm lang={l} jobSlug={slug} />
          </div>
        </div>
      </section>
    </div>
  );
}
