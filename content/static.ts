/**
 * Bilingual static content for the public site.
 *
 * Source of truth: handoff/copywriting.md (audited against
 * prototype's content.jsx). Until the database lands (Phase 3 of
 * build-prompt.md), every page reads from CONTENT.
 *
 * Shape: every visible string is `{ en: "...", ka: "..." }`.
 * Use `t(lang, "nav.home")` to resolve.
 */

import type { Locale } from '@/i18n/routing';

export type Bi = { en: string; ka: string };
export type BiArr = { en: string[]; ka: string[] };
export type ProjectCoverStyle = 'dashboard' | 'network' | 'ledger' | 'identity' | 'workflow';
export type TrustMetricIcon = 'building' | 'clock' | 'ship' | 'shield' | 'server' | 'users';
export type TrustMetric = { value: string; label: Bi; suffix?: Bi; icon?: TrustMetricIcon };

export type Article = {
  slug: string;
  category: 'engineering' | 'company' | 'security' | 'case';
  date: string;
  readTime: number;
  author: string;
  title: Bi;
  excerpt: Bi;
  accent: 'indigo' | 'violet' | 'plum';
  featured?: boolean;
};

export type Project = {
  slug: string;
  title: Bi;
  category: Bi;
  year: string;
  coverUrl?: string | null;
  accent: 'indigo' | 'violet' | 'plum';
  coverStyle?: ProjectCoverStyle;
};

export type Job = {
  slug: string;
  title: Bi;
  department: 'Engineering' | 'Design' | 'Operations';
  type: 'full_time' | 'part_time' | 'contract';
  location: string;
  description: Bi;
};

export type Office = {
  city: Bi;
  role: Bi;
  address: Bi;
  phone: string;
};

export type BodyBlock = { type: 'p' | 'h2'; text: string };

export const CONTENT = {
  brand: {
    name: 'Softgen',
    tagline: { en: 'Software for serious business', ka: 'სერიოზული ბიზნესის პროგრამები' } as Bi,
  },

  nav: {
    home:     { en: 'Home',     ka: 'მთავარი' } as Bi,
    about:    { en: 'About',    ka: 'ჩვენ შესახებ' } as Bi,
    services: { en: 'Services', ka: 'სერვისები' } as Bi,
    projects: { en: 'Projects', ka: 'პროექტები' } as Bi,
    news:     { en: 'News',     ka: 'სიახლეები' } as Bi,
    careers:  { en: 'Careers',  ka: 'კარიერა' } as Bi,
    contact:  { en: 'Contact',  ka: 'კონტაქტი' } as Bi,
  },

  cta: {
    talk:       { en: 'Start a project', ka: 'დაიწყე პროექტი' } as Bi,
    explore:    { en: 'Explore work',    ka: 'ნახე პროექტები' } as Bi,
    learnMore:  { en: 'Learn more',      ka: 'გაიგე მეტი' } as Bi,
    readMore:   { en: 'Read article',    ka: 'წაიკითხე სრულად' } as Bi,
    backToNews: { en: 'All articles',    ka: 'ყველა სტატია' } as Bi,
    viewAll:    { en: 'View all',        ka: 'ყველა' } as Bi,
  },

  hero: {
    eyebrow: {
      en: 'Enterprise software, since 2008',
      ka: 'საწარმოო პროგრამები, 2008-დან',
    } as Bi,
    headline: {
      en: ['Software', 'that runs', 'the business.'],
      ka: ['პროგრამები,', 'რომლებიც მართავენ', 'ბიზნესს.'],
    } as BiArr,
    subtext: {
      en: 'Softgen builds the systems Georgian banks, government agencies and enterprises rely on every day — from core platforms to mission-critical integrations.',
      ka: 'Softgen აშენებს იმ სისტემებს, რომლებზეც ყოველდღე ეყრდნობიან ქართული ბანკები, სახელმწიფო უწყებები და კომპანიები — ფუძემდებლური პლატფორმებიდან კრიტიკულ ინტეგრაციებამდე.',
    } as Bi,
    proofPoints: {
      en: [
        '17 years shipping critical systems',
        'Banking, government, telecom',
        'Maintained after launch',
      ],
      ka: [
        '17 წელი კრიტიკულ სისტემებზე',
        'ბანკები, სახელმწიფო, ტელეკომი',
        'მხარდაჭერა გაშვების შემდეგ',
      ],
    } as BiArr,
    health: {
      eyebrow: { en: 'live ops · 24/7', ka: 'live ops · 24/7' } as Bi,
      title: { en: 'System health', ka: 'სისტემის სტატუსი' } as Bi,
      rowLabels: {
        en: ['Banking core', 'Gov portal', 'ID platform', 'Billing'],
        ka: ['საბანკო ბირთვი', 'სახელმწიფო', 'იდენტიფიკაცია', 'ბილინგი'],
      } as BiArr,
      footerLeft: { en: 'last 30 days', ka: 'ბოლო 30 დღე' } as Bi,
      footerRight: { en: 'updated · UTC', ka: 'განახლდა · UTC' } as Bi,
    },
  },

  stats: [
    { value: '150+', label: { en: 'Companies served',   ka: 'მომსახურებული კომპანია' } as Bi, icon: 'building' },
    { value: '17',   label: { en: 'Years in business',  ka: 'წლის გამოცდილება' } as Bi, suffix: { en: 'yr', ka: 'წ' } as Bi, icon: 'clock' },
    { value: '50+',  label: { en: 'Products shipped',   ka: 'გამოშვებული პროდუქტი' } as Bi, icon: 'ship' },
    { value: '24/7', label: { en: 'Operations support', ka: 'უწყვეტი მხარდაჭერა' } as Bi, icon: 'shield' },
  ] as TrustMetric[],

  services: {
    eyebrow: { en: 'What we do', ka: 'რას ვაკეთებთ' } as Bi,
    title:   { en: 'Four practices, one engineering team.', ka: 'ოთხი მიმართულება, ერთი საინჟინრო გუნდი.' } as Bi,
    items: [
      {
        slug: 'core-platforms',
        num: '01',
        visualIcon: 'cube',
        title: { en: 'Core platforms', ka: 'ძირითადი პლატფორმები' } as Bi,
        body:  {
          en: 'Banking cores, ERP, CRM and back-office systems built for scale and the next decade of regulation.',
          ka: 'საბანკო ბირთვები, ERP, CRM და back-office სისტემები მასშტაბისა და მომავალი ათწლეულის რეგულაციებისთვის.',
        } as Bi,
        capabilities: [
          { en: 'Core banking systems with full ledger + reconciliation', ka: 'საბანკო ბირთვი სრული ledger-ით და შედარებით' },
          { en: 'ERP and inventory for retail, distribution, logistics',  ka: 'ERP და მარაგი — საცალო, დისტრიბუცია, ლოჯისტიკა' },
        ] as Bi[],
      },
      {
        slug: 'government-services',
        num: '02',
        visualIcon: 'portal',
        title: { en: 'Government services', ka: 'სახელმწიფო სერვისები' } as Bi,
        body:  {
          en: 'Citizen-facing portals, document workflows and inter-agency integrations that hold up under load.',
          ka: 'მოქალაქეებზე ორიენტირებული პორტალები, დოკუმენტბრუნვა და უწყებათაშორისი ინტეგრაციები.',
        } as Bi,
        capabilities: [
          { en: 'Citizen portals with bilingual support', ka: 'მოქალაქის პორტალი ორენოვანი მხარდაჭერით' },
          { en: 'Document workflow + e-signature',         ka: 'დოკუმენტბრუნვა და e-signature' },
        ] as Bi[],
      },
      {
        slug: 'security-identity',
        num: '03',
        visualIcon: 'shield',
        title: { en: 'Security & identity', ka: 'უსაფრთხოება და იდენტიფიკაცია' } as Bi,
        body:  {
          en: 'Authentication, fraud monitoring and compliance tooling. Audited annually, 24/7 on-call.',
          ka: 'ავთენტიფიკაცია, თაღლითობის მონიტორინგი და compliance. ყოველწლიური აუდიტი, 24/7 მხარდაჭერა.',
        } as Bi,
        capabilities: [
          { en: 'OAuth 2.0 / OIDC identity platforms',           ka: 'OAuth 2.0 / OIDC იდენტიფიკაცია' },
          { en: 'Real-time fraud monitoring',                    ka: 'თაღლითობის მონიტორინგი რეალურ დროში' },
        ] as Bi[],
      },
      {
        slug: 'custom-engineering',
        num: '04',
        visualIcon: 'workflow',
        title: { en: 'Custom engineering', ka: 'ინდივიდუალური დამუშავება' } as Bi,
        body:  {
          en: "When the off-the-shelf answer doesn't fit, we build the right one — typed, tested and documented.",
          ka: 'როცა მზა გადაწყვეტა არ ჯდება — ვაშენებთ შესაბამისს, ტიპიზებულს, ტესტირებულს, დოკუმენტირებულს.',
        } as Bi,
        capabilities: [
          { en: 'Greenfield product engineering',             ka: 'ახალი პროდუქტის შექმნა' },
          { en: 'Legacy migration + modernization',           ka: 'ძველი სისტემების მიგრაცია' },
        ] as Bi[],
      },
    ],
  },

  projectsTeaser: {
    eyebrow: { en: 'Selected work', ka: 'შერჩეული პროექტები' } as Bi,
    title:   { en: 'Systems that run quietly, every day.', ka: 'სისტემები, რომლებიც წყნარად მუშაობენ ყოველდღე.' } as Bi,
    items: [
      { slug: 'tbc-corporate-portal', title: { en: 'TBC Corporate Portal', ka: 'TBC კორპორაციული პორტალი' }, category: { en: 'FinTech', ka: 'ფინტექი' }, year: '2024', accent: 'indigo', coverStyle: 'dashboard' },
      { slug: 'rs-tax-pipeline',      title: { en: 'Revenue Service tax pipeline', ka: 'შემოსავლების სამსახურის სატარიფო ხაზი' }, category: { en: 'Government', ka: 'სახელმწიფო' }, year: '2023', accent: 'violet', coverStyle: 'workflow' },
      { slug: 'lifelock-id-platform', title: { en: 'LifeLock ID platform', ka: 'LifeLock იდენტიფიკაცია' }, category: { en: 'Security', ka: 'უსაფრთხოება' }, year: '2023', accent: 'plum', coverStyle: 'identity' },
      { slug: 'geocell-billing',      title: { en: 'Geocell unified billing', ka: 'Geocell ერთიანი ბილინგი' }, category: { en: 'Enterprise', ka: 'საწარმოო' }, year: '2022', accent: 'indigo', coverStyle: 'network' },
    ] as Project[],
  },

  partners: {
    eyebrow: { en: 'Trusted by', ka: 'გვენდობიან' } as Bi,
    title:   { en: '150+ organizations across Georgia and the region.', ka: '150-ზე მეტი ორგანიზაცია საქართველოსა და რეგიონში.' } as Bi,
    logos: [
      'TBC Bank', 'Bank of Georgia', 'Liberty', 'Credo', 'Revenue Service',
      'Pension Agency', 'Public Service Hall', 'Geocell', 'Magti', 'Silknet',
      'Wissol', 'SOCAR', 'Adjara Group', 'Aldagi', 'TBC Insurance',
      'GPI', 'Tegeta', 'Borjomi',
    ],
  },

  newsTeaser: {
    eyebrow: { en: 'Latest from Softgen', ka: 'სიახლეები' } as Bi,
    title:   { en: 'Notes from the engineering floor.', ka: 'ჩანაწერები საინჟინრო სართულიდან.' } as Bi,
  },

  cta_band: {
    title: { en: 'Have a system that should already exist?', ka: 'გაქვთ სისტემა, რომელიც უკვე უნდა არსებობდეს?' } as Bi,
    subtext: {
      en: "Tell us what you're building. We respond within one business day.",
      ka: 'მოგვწერეთ თქვენს პროექტზე. ვპასუხობთ ერთი სამუშაო დღის განმავლობაში.',
    } as Bi,
  },

  about: {
    eyebrow:  { en: 'About Softgen', ka: 'Softgen-ის შესახებ' } as Bi,
    headline: {
      en: 'Seventeen years of building software that has to work.',
      ka: 'ჩვიდმეტი წელი ვქმნით პროგრამებს, რომლებიც უნდა მუშაობდნენ.',
    } as Bi,
    intro: {
      en: "Founded in Tbilisi in 2008, Softgen has grown alongside Georgia's financial and digital infrastructure. We're a 90-person engineering company that takes long-term responsibility for the systems we deliver.",
      ka: 'დაარსებული თბილისში 2008 წელს, Softgen გაიზარდა საქართველოს ფინანსურ და ციფრულ ინფრასტრუქტურასთან ერთად. ჩვენ ვართ 90 ადამიანის საინჟინრო კომპანია, რომელიც გრძელვადიან პასუხისმგებლობას იღებს მის მიერ შექმნილ სისტემებზე.',
    } as Bi,
    timeline: [
      { year: '2008', title: { en: 'Founded in Tbilisi',           ka: 'დაარსდა თბილისში' },                  body: { en: 'Three engineers, one core-banking contract, a basement office on Chavchavadze.', ka: 'სამი ინჟინერი, ერთი საბანკო კონტრაქტი, სარდაფი ჭავჭავაძეზე.' } },
      { year: '2012', title: { en: 'First government contract',    ka: 'პირველი სახელმწიფო კონტრაქტი' },       body: { en: 'Built the document workflow that still routes most inter-ministry correspondence.', ka: 'შექმნა დოკუმენტბრუნვა, რომელიც დღესაც მუშაობს უწყებებს შორის.' } },
      { year: '2016', title: { en: 'Security practice spun up',    ka: 'უსაფრთხოების მიმართულება დაიბადა' },   body: { en: 'Dedicated team for fraud, identity and compliance work — now a quarter of the company.', ka: 'გამოიყო ცალკე გუნდი თაღლითობის, იდენტიფიკაციისა და compliance-ის მიმართულებით.' } },
      { year: '2020', title: { en: 'Crossed 100 customers',        ka: '100 კლიენტის ნიშნული' },              body: { en: 'Same year we shipped pandemic-era systems for the Public Service Hall in 11 weeks.', ka: 'იმავე წელს გადავცეთ პანდემიის პერიოდის სისტემები სახელმწიფო სერვისების სააგენტოს 11 კვირაში.' } },
      { year: '2024', title: { en: 'Regional expansion',           ka: 'რეგიონული ექსპანსია' },               body: { en: 'Opened delivery offices in Yerevan and Baku. First contracts in Armenia and Azerbaijan signed.', ka: 'გავხსენი ოფისები ერევანში და ბაქოში. პირველი კონტრაქტები სომხეთსა და აზერბაიჯანში.' } },
    ] as Array<{ year: string; title: Bi; body: Bi }>,
    valuesEyebrow: { en: 'How we work', ka: 'როგორ ვმუშაობთ' } as Bi,
    valuesTitle:   { en: 'Three commitments we keep.', ka: 'სამი ვალდებულება, რომლებსაც ვიცავთ.' } as Bi,
    values: [
      { num: '01', title: { en: 'We finish what we ship.',      ka: 'რასაც ვუშვებთ — ვამთავრებთ.' },        body: { en: 'Every system has a maintenance owner the day it goes live. There is no "throwing it over the wall."', ka: 'ყველა სისტემას აქვს მფლობელი გაშვების დღიდან. "კედლის გადაგდება" არ ხდება.' } },
      { num: '02', title: { en: 'We write things down.',         ka: 'ჩვენ ვწერთ დოკუმენტაციას.' },          body: { en: 'Architecture decisions, runbooks, on-call playbooks — all documented in a way another engineer can pick up.', ka: 'არქიტექტურული გადაწყვეტილებები, runbook-ები, on-call playbook-ები — ყველა დოკუმენტირებული.' } },
      { num: '03', title: { en: 'We stay accountable in writing.', ka: 'პასუხისმგებლობას ვიღებთ წერილობით.' }, body: { en: 'SLAs are real, contracts are specific, and uptime numbers are reported quarterly to every customer.', ka: 'SLA-ები რეალურია, კონტრაქტები კონკრეტული, uptime-ის რიცხვები იგზავნება ყოველკვარტალურად.' } },
    ] as Array<{ num: string; title: Bi; body: Bi }>,
    teamEyebrow: { en: 'Leadership', ka: 'ხელმძღვანელობა' } as Bi,
    teamTitle:   { en: 'The people accountable for the work.', ka: 'ადამიანები, რომლებიც პასუხისმგებელნი არიან.' } as Bi,
    team: [
      { name: 'Levan Kapanadze',          role: { en: 'Founder & CEO',              ka: 'დამფუძნებელი / CEO' },          since: '2008' },
      { name: 'Nino Tsiklauri',           role: { en: 'Chief Technology Officer',   ka: 'CTO' },                          since: '2011' },
      { name: 'Giorgi Mamulashvili',      role: { en: 'Head of Security',           ka: 'უსაფრთხოების უფროსი' },         since: '2016' },
      { name: 'Tamar Beridze',            role: { en: 'Head of Government',         ka: 'სახ. სექტორის უფროსი' },        since: '2014' },
      { name: 'Vakhtang Lortkipanidze',   role: { en: 'Head of FinTech',            ka: 'ფინტექის უფროსი' },             since: '2013' },
      { name: 'Ana Jorjadze',             role: { en: 'Head of Engineering',        ka: 'ინჟინერიის უფროსი' },           since: '2017' },
    ] as Array<{ name: string; role: Bi; since: string }>,
  },

  news: {
    eyebrow:  { en: 'Newsroom', ka: 'სიახლეები' } as Bi,
    headline: { en: 'Notes from inside the engineering floor.', ka: 'ჩანაწერები საინჟინრო სართულიდან.' } as Bi,
    intro: {
      en: 'Customer announcements, technical write-ups, and the occasional opinion. No marketing pages — actual notes from the people building the systems.',
      ka: 'კლიენტებთან ანონსები, ტექნიკური სტატიები, ხანდახან აზრი. მარკეტინგული გვერდები არ არის.',
    } as Bi,
    categories: [
      { id: 'all',         label: { en: 'All',          ka: 'ყველა' } as Bi },
      { id: 'engineering', label: { en: 'Engineering',  ka: 'ინჟინერია' } as Bi },
      { id: 'company',     label: { en: 'Company',      ka: 'კომპანია' } as Bi },
      { id: 'security',    label: { en: 'Security',     ka: 'უსაფრთხოება' } as Bi },
      { id: 'case',        label: { en: 'Case studies', ka: 'ქეისები' } as Bi },
    ] as Array<{ id: string; label: Bi }>,
    articles: [
      {
        slug: 'shipping-tbc-corporate-portal', category: 'case',        date: '2026-04-22', readTime: 9, author: 'Vakhtang Lortkipanidze',
        title:   { en: 'How we shipped the TBC Corporate Portal in 14 weeks', ka: 'როგორ გავუშვით TBC-ის კორპორაციული პორტალი 14 კვირაში' },
        excerpt: { en: 'The deal was signed in November. The first 4,000 corporate users logged in by mid-March. Here\'s what the schedule, the architecture, and the trade-offs actually looked like.', ka: 'კონტრაქტი ნოემბერში გაფორმდა. პირველი 4000 კორპორაციული მომხმარებელი მარტის შუა რიცხვებში შევიდა. აქ არის გრაფიკი, არქიტექტურა და კომპრომისები.' },
        accent: 'indigo', featured: true,
      },
      {
        slug: 'type-safe-currency-amounts', category: 'engineering', date: '2026-04-08', readTime: 6, author: 'Ana Jorjadze',
        title:   { en: 'Why we type-check currency amounts at the database boundary', ka: 'რატომ ვამოწმებთ ვალუტას მონაცემთა ბაზის საზღვარზე' },
        excerpt: { en: 'A two-hour outage last winter taught us that integer GEL and integer cents are not the same number. The fix was small. The lesson wasn\'t.', ka: 'გასულ ზამთარს ორსაათიანი outage-ი დაგვიჯდა. გაკვეთილი მცირე იყო. მნიშვნელობა — დიდი.' },
        accent: 'violet',
      },
      {
        slug: 'softgen-yerevan-baku', category: 'company', date: '2026-03-30', readTime: 3, author: 'Levan Kapanadze',
        title:   { en: 'Opening offices in Yerevan and Baku', ka: 'ვხსნით ოფისებს ერევანში და ბაქოში' },
        excerpt: { en: 'Two regional offices, six new hires, and what it takes to deliver software across three currencies and three regulatory regimes.', ka: 'ორი რეგიონული ოფისი, ექვსი ახალი თანამშრომელი და სამ ვალუტასა და სამ რეგულატორულ რეჟიმში მუშაობის სპეციფიკა.' },
        accent: 'plum',
      },
      {
        slug: 'annual-pen-test-2026', category: 'security', date: '2026-03-12', readTime: 5, author: 'Giorgi Mamulashvili',
        title:   { en: 'What we found in our 2026 annual pen test', ka: 'რა ვიპოვეთ 2026 წლის ანუალურ პენ-ტესტში' },
        excerpt: { en: 'Four findings, one of them medium. Why publishing the summary publicly is the only honest answer.', ka: 'ოთხი მიგნება, ერთი მათგანი საშუალო რისკის. რატომ ვაქვეყნებთ შემაჯამებელ ანგარიშს.' },
        accent: 'indigo',
      },
      {
        slug: 'designing-for-public-service-hall', category: 'case', date: '2026-02-28', readTime: 11, author: 'Tamar Beridze',
        title:   { en: 'Designing forms for the Public Service Hall', ka: 'ფორმების დიზაინი სახელმწიფო სერვისების სააგენტოსთვის' },
        excerpt: { en: 'When the form on the screen is the only way 800,000 people interact with the state, hover states are the wrong place to spend a week.', ka: 'როცა ფორმა ეკრანზე არის ერთადერთი გზა 800 000 ადამიანისთვის — hover-ის შესწავლა არასწორი ადგილია.' },
        accent: 'violet',
      },
      {
        slug: 'monorepo-after-three-years', category: 'engineering', date: '2026-02-14', readTime: 8, author: 'Ana Jorjadze',
        title:   { en: 'Our monorepo after three years', ka: 'ჩვენი monorepo სამი წლის შემდეგ' },
        excerpt: { en: 'Eleven products, 280 services, one repo. What\'s working, what we\'d do differently, and the build graph that runs it.', ka: 'თერთმეტი პროდუქტი, 280 სერვისი, ერთი repo. რა მუშაობს, რას შევცვლიდით, და build graph-ი.' },
        accent: 'plum',
      },
    ] as Article[],
    bodies: {
      'shipping-tbc-corporate-portal': {
        en: [
          { type: 'p',  text: 'The contract was signed in early November 2025. TBC needed a new corporate portal — separate from the consumer banking app, accessible to 4,000+ business clients, in production by the end of Q1. We had fourteen weeks.' },
          { type: 'h2', text: 'What we agreed not to ship' },
          { type: 'p',  text: 'Within the first week, we wrote down what would not be in v1. Multi-account hierarchies. Bulk payment uploads. The treasury workflows. Anything mobile-native. Each item moved to the post-launch backlog with an owner and a target quarter, in writing.' },
          { type: 'p',  text: 'This is the move that bought us the schedule. Most fourteen-week deliveries fail because nothing was cut at week one.' },
          { type: 'h2', text: 'Architecture in three sentences' },
          { type: 'p',  text: 'Existing core banking APIs, a new BFF layer in TypeScript, and a Next.js front-end. Authentication routed through TBC\'s existing OAuth provider. No new database — every read went through the BFF to systems of record we already knew.' },
          { type: 'h2', text: 'The trade-off that mattered' },
          { type: 'p',  text: 'We chose not to introduce a new database. That decision saved roughly four weeks of schema, migration, and operational work. It cost us ~20% additional latency on the dashboard view, which we mitigated with edge caching of three specific queries. We accepted the trade-off in writing, with the latency budget published to the team.' },
          { type: 'h2', text: 'What week 14 looked like' },
          { type: 'p',  text: 'Friday, March 13, 17:00. Four engineers in the room, two on-call, one VP of operations. We migrated the first 1,200 accounts at 17:30. Watched the dashboards for ninety minutes. The remaining 2,800 went over the weekend in waves of 800. By Monday morning, support tickets were running at the rate of a normal Monday.' },
          { type: 'p',  text: 'There were three incidents in the first month. Two were external (a downstream system rate-limiting us under realistic load), one was ours (a timezone bug in scheduled transfers, fixed in a hotfix the same evening). All three are written up in our incident log, which the customer gets read access to.' },
        ] as BodyBlock[],
        ka: [
          { type: 'p',  text: 'კონტრაქტი 2025 წლის ნოემბრის დასაწყისში გაფორმდა. TBC-ს ახალი კორპორაციული პორტალი სჭირდებოდა — მომხმარებლის საბანკო აპისგან განცალკევებული, 4000-ზე მეტი ბიზნეს კლიენტისთვის, პირველი კვარტლის ბოლომდე პროდაქშენში. გვქონდა თოთხმეტი კვირა.' },
          { type: 'h2', text: 'რა არ გაგვიშვია' },
          { type: 'p',  text: 'პირველივე კვირაში ჩავწერეთ, რა არ შევიდოდა v1-ში. რთული ანგარიშების იერარქია. ჯგუფური გადახდები. სახაზინო პროცესები. მობილური აპლიკაცია. ყველა პუნქტი გადავიდა გაშვების შემდგომ backlog-ში მფლობელითა და მიზნის კვარტალით — წერილობით.' },
          { type: 'p',  text: 'სწორედ ამ ნაბიჯმა გვიხსნა გრაფიკი. თოთხმეტკვირიანი პროექტების უმრავლესობა იშლება, რადგან პირველ კვირაში არაფერი იჭრება.' },
          { type: 'h2', text: 'არქიტექტურა სამ წინადადებაში' },
          { type: 'p',  text: 'არსებული საბანკო ბირთვის API-ები, ახალი BFF-ფენა TypeScript-ზე და Next.js front-end. ავთენტიფიკაცია TBC-ის არსებული OAuth-ით. ახალი მონაცემთა ბაზა — არ შექმნილა.' },
          { type: 'h2', text: 'კომპრომისი, რომელსაც მნიშვნელობა ჰქონდა' },
          { type: 'p',  text: 'გადავწყვიტეთ ახალი ბაზა არ შემოგვეტანა. ამ გადაწყვეტილებამ დაახლოებით ოთხი კვირა დაგვიზოგა. ფასად დაგვიჯდა დაახლოებით 20% დამატებით latency dashboard-ზე, რაც edge cache-ით შევამცირეთ.' },
          { type: 'h2', text: 'როგორი იყო მე-14 კვირა' },
          { type: 'p',  text: 'პარასკევი, 13 მარტი, 17:00. ოთხი ინჟინერი ოთახში, ორი on-call-ზე, ერთი VP. პირველი 1200 ანგარიში გადავიტანეთ 17:30-ზე. ვუყურეთ dashboard-ებს ოთხმოცდაათი წუთი. დარჩენილი 2800 — შაბათ-კვირაში, 800-იანი ტალღებით. ორშაბათ დილამდე — ჩვეულებრივი ორშაბათი.' },
        ] as BodyBlock[],
      },
    } as Record<string, { en: BodyBlock[]; ka: BodyBlock[] }>,
  },

  footer: {
    address: { en: '12 Chavchavadze Ave, Tbilisi 0179', ka: 'ჭავჭავაძის გამზ. 12, თბილისი 0179' } as Bi,
    rights:  { en: 'All rights reserved.', ka: 'ყველა უფლება დაცულია.' } as Bi,
  },

  servicesPage: {
    eyebrow:  { en: 'Services', ka: 'სერვისები' } as Bi,
    headline: { en: 'Four practices, built around one engineering team.', ka: 'ოთხი მიმართულება, ერთი საინჟინრო გუნდი.' } as Bi,
    intro: {
      en: "We don't outsource. Every system below is built and maintained by the same Softgen engineers, on the same SLAs.",
      ka: 'ჩვენ არ ვიყენებთ ქვეკონტრაქტორებს. ქვემოთ ჩამოთვლილ ყველა სისტემას აშენებს და უვლის ერთი და იგივე გუნდი.',
    } as Bi,
    detail: {
      'core-platforms': {
        title:   { en: 'Core platforms', ka: 'ძირითადი პლატფორმები' },
        tagline: { en: 'Banking cores, ERP, CRM, back-office — built for scale and the next decade of regulation.', ka: 'საბანკო ბირთვები, ERP, CRM — მასშტაბისა და მომავალი ათწლეულის რეგულაციებისთვის.' },
        capabilities: [
          { en: 'Core banking systems with full ledger + reconciliation', ka: 'საბანკო ბირთვი სრული ledger-ით და შედარებით' },
          { en: 'ERP and inventory for retail, distribution, logistics',  ka: 'ERP და მარაგი — საცალო, დისტრიბუცია, ლოჯისტიკა' },
          { en: 'Custom CRM with sales pipeline + telephony',              ka: 'ინდივიდუალური CRM — გაყიდვების pipeline და ტელეფონია' },
          { en: 'Back-office workflow automation',                         ka: 'Back-office პროცესების ავტომატიზაცია' },
        ] as Bi[],
        related: ['tbc-corporate-portal', 'geocell-billing'],
      },
      'government-services': {
        title:   { en: 'Government services', ka: 'სახელმწიფო სერვისები' },
        tagline: { en: 'Citizen-facing portals, document workflows, and inter-agency integrations.', ka: 'მოქალაქეებისთვის პორტალები, დოკუმენტბრუნვა, უწყებათაშორისი ინტეგრაციები.' },
        capabilities: [
          { en: 'Citizen portals with bilingual support', ka: 'მოქალაქის პორტალი ორენოვანი მხარდაჭერით' },
          { en: 'Document workflow + e-signature',         ka: 'დოკუმენტბრუნვა და e-signature' },
          { en: 'Inter-agency integration buses',          ka: 'უწყებათაშორისი ინტეგრაციული მაგისტრალები' },
          { en: 'Public-data registries',                  ka: 'საჯარო მონაცემთა რეესტრები' },
        ] as Bi[],
        related: ['rs-tax-pipeline'],
      },
      'security-identity': {
        title:   { en: 'Security & identity', ka: 'უსაფრთხოება და იდენტიფიკაცია' },
        tagline: { en: 'Authentication, fraud monitoring, and compliance tooling.', ka: 'ავთენტიფიკაცია, თაღლითობის მონიტორინგი, compliance.' },
        capabilities: [
          { en: 'OAuth 2.0 / OIDC identity platforms',           ka: 'OAuth 2.0 / OIDC იდენტიფიკაცია' },
          { en: 'Real-time fraud monitoring',                    ka: 'თაღლითობის მონიტორინგი რეალურ დროში' },
          { en: 'Annual penetration tests + compliance reports', ka: 'ყოველწლიური pen-test და compliance ანგარიშები' },
          { en: 'PCI-DSS and ISO 27001 advisory',                ka: 'PCI-DSS და ISO 27001 კონსულტაცია' },
        ] as Bi[],
        related: ['lifelock-id-platform'],
      },
      'custom-engineering': {
        title:   { en: 'Custom engineering', ka: 'ინდივიდუალური დამუშავება' },
        tagline: { en: "When the off-the-shelf answer doesn't fit, we build the right one.", ka: 'როცა მზა გადაწყვეტა არ ჯდება — ვაშენებთ შესაბამისს.' },
        capabilities: [
          { en: 'Greenfield product engineering',             ka: 'ახალი პროდუქტის შექმნა' },
          { en: 'Legacy migration + modernization',           ka: 'ძველი სისტემების მიგრაცია' },
          { en: 'Hard-real-time and high-throughput systems', ka: 'მაღალი დატვირთვის სისტემები' },
          { en: 'Embedded teams (3-12 engineers)',            ka: 'ჩართული გუნდები (3-12 ინჟინერი)' },
        ] as Bi[],
        related: ['geocell-billing', 'tbc-corporate-portal'],
      },
    } as Record<string, { title: Bi; tagline: Bi; capabilities: Bi[]; related: string[] }>,
  },

  projectsPage: {
    eyebrow:  { en: 'Selected work', ka: 'შერჩეული პროექტები' } as Bi,
    headline: { en: 'Eighteen years of systems that run quietly.', ka: 'თვრამეტი წლის სისტემები, რომლებიც წყნარად მუშაობენ.' } as Bi,
    intro: {
      en: "A subset of the 50+ products we've shipped. Filter by category, or read a case study for the full architecture and trade-offs.",
      ka: '50+ შექმნილი პროდუქტიდან მცირე ნაწილი. გაფილტრე კატეგორიის მიხედვით ან წაიკითხე ქეისი.',
    } as Bi,
    filters: [
      { id: 'all',        label: { en: 'All',        ka: 'ყველა' } as Bi },
      { id: 'FinTech',    label: { en: 'FinTech',    ka: 'ფინტექი' } as Bi },
      { id: 'Government', label: { en: 'Government', ka: 'სახელმწიფო' } as Bi },
      { id: 'Security',   label: { en: 'Security',   ka: 'უსაფრთხოება' } as Bi },
      { id: 'Enterprise', label: { en: 'Enterprise', ka: 'საწარმოო' } as Bi },
    ],
    detail: {
      'tbc-corporate-portal': {
        client: 'TBC Bank',
        year: '2024',
        duration: { en: '14 weeks', ka: '14 კვირა' } as Bi,
        scope:    { en: 'Design, engineering, ops', ka: 'დიზაინი, ინჟინერია, ოპერაციები' } as Bi,
        team: '11 engineers · 2 designers',
        category: 'FinTech',
        tags: ['Next.js', 'TypeScript', 'BFF', 'OAuth', 'Edge cache'],
        summary: {
          en: 'A new corporate banking portal serving 4,000+ business clients, shipped from contract signature to production in 14 weeks.',
          ka: 'ახალი კორპორაციული საბანკო პორტალი — 4000+ ბიზნეს კლიენტი, გაშვებული 14 კვირაში.',
        } as Bi,
        body: {
          en: [
            { type: 'p',  text: 'TBC needed a separate corporate-banking surface from the consumer app. The contract was signed in November, the first 1,200 corporate users had to log in by mid-March.' },
            { type: 'h2', text: 'What we cut from v1' },
            { type: 'p',  text: 'Multi-account hierarchies, bulk payment uploads, treasury workflows, mobile-native — all moved to the post-launch backlog with named owners. This is the move that bought us the schedule.' },
            { type: 'h2', text: 'Architecture' },
            { type: 'p',  text: "Existing core-banking APIs, a new BFF layer in TypeScript, Next.js front-end. Authentication routed through TBC's OAuth provider. No new database — every read went through the BFF to systems of record we already knew." },
            { type: 'h2', text: 'Outcome' },
            { type: 'p',  text: 'Three incidents in the first month, all written up in the customer-visible incident log. 99.97% uptime in Q2 2025. Now serving 4,000+ accounts daily.' },
          ] as BodyBlock[],
        },
      },
    } as Record<string, {
      client: string; year: string; duration: Bi; scope: Bi; team: string;
      category: string; tags: string[]; summary: Bi; body: { en: BodyBlock[] };
    }>,
  },

  careers: {
    eyebrow:  { en: 'Open positions', ka: 'ღია პოზიციები' } as Bi,
    headline: { en: 'Engineers who finish what they ship.', ka: 'ინჟინრები, რომლებიც ამთავრებენ, რასაც უშვებენ.' } as Bi,
    intro: {
      en: "We hire slowly and keep people for years. Below are roles we're actively hiring for; if none fit but you're interesting, write to careers@softgen.ge anyway.",
      ka: 'ჩვენ ვამატებთ ადამიანებს ნელა და ვინარჩუნებთ წლების განმავლობაში.',
    } as Bi,
    departments: [
      { id: 'all',         label: { en: 'All teams',   ka: 'ყველა' } as Bi },
      { id: 'Engineering', label: { en: 'Engineering', ka: 'ინჟინერია' } as Bi },
      { id: 'Design',      label: { en: 'Design',      ka: 'დიზაინი' } as Bi },
      { id: 'Operations',  label: { en: 'Operations',  ka: 'ოპერაციები' } as Bi },
    ],
    types: {
      full_time: { en: 'Full-time', ka: 'სრული განაკვეთი' } as Bi,
      part_time: { en: 'Part-time', ka: 'ნახევარი' } as Bi,
      contract:  { en: 'Contract',  ka: 'კონტრაქტი' } as Bi,
    } as Record<'full_time' | 'part_time' | 'contract', Bi>,
    jobs: [
      { slug: 'senior-backend-engineer',   title: { en: 'Senior Backend Engineer',     ka: 'უფროსი Backend ინჟინერი' }, department: 'Engineering', type: 'full_time', location: 'Tbilisi',           description: { en: 'Lead the core-banking integration layer. TypeScript, PostgreSQL, designing for 5-year horizons.', ka: 'უძღვებოდე საბანკო ბირთვის ინტეგრაციას.' } },
      { slug: 'site-reliability-engineer', title: { en: 'Site Reliability Engineer',   ka: 'Site Reliability Engineer' }, department: 'Engineering', type: 'full_time', location: 'Tbilisi / Yerevan', description: { en: 'On-call rotation for our most critical systems. Postgres, Kubernetes, observability.', ka: 'On-call ჩვენი ყველაზე კრიტიკული სისტემებისთვის.' } },
      { slug: 'product-designer',          title: { en: 'Product Designer',            ka: 'პროდუქტის დიზაინერი' }, department: 'Design',      type: 'full_time', location: 'Tbilisi',           description: { en: 'Design forms, dashboards, and admin tooling for enterprise users. Bilingual (KA + EN) a plus.', ka: 'ფორმების, dashboard-ების და ადმინ-ინსტრუმენტების დიზაინი.' } },
      { slug: 'frontend-engineer',         title: { en: 'Frontend Engineer',           ka: 'Frontend ინჟინერი' }, department: 'Engineering', type: 'full_time', location: 'Tbilisi',           description: { en: 'React, TypeScript, design-system work. We ship to citizen-facing portals at high scale.', ka: 'React, TypeScript, design-system.' } },
      { slug: 'security-analyst',          title: { en: 'Security Analyst',            ka: 'უსაფრთხოების ანალიტიკოსი' }, department: 'Engineering', type: 'full_time', location: 'Tbilisi',           description: { en: 'Fraud monitoring, incident response, customer-facing security reviews.', ka: 'თაღლითობის მონიტორინგი, ინციდენტებზე რეაგირება.' } },
      { slug: 'delivery-manager',          title: { en: 'Delivery Manager',            ka: 'Delivery მენეჯერი' }, department: 'Operations',  type: 'full_time', location: 'Tbilisi',           description: { en: 'Run the relationship with two of our top-five customers. Schedules, status, written accountability.', ka: 'კლიენტებთან ურთიერთობის მართვა, გრაფიკები, წერილობითი ანგარიშგება.' } },
      { slug: 'junior-frontend',           title: { en: 'Junior Frontend Engineer',    ka: 'ჯუნიორ Frontend' }, department: 'Engineering', type: 'part_time', location: 'Tbilisi',           description: { en: '20h/week. We pair you with a senior for 6 months, no exceptions.', ka: 'კვირაში 20 საათი. 6 თვე — სენიორთან ერთად.' } },
    ] as Job[],
    apply: {
      title: { en: 'Apply for this role', ka: 'მიმართე ამ პოზიციაზე' } as Bi,
      fields: {
        name:    { en: 'Full name',           ka: 'სახელი და გვარი' } as Bi,
        email:   { en: 'Email',               ka: 'ელფოსტა' } as Bi,
        phone:   { en: 'Phone (optional)',    ka: 'ტელეფონი' } as Bi,
        cv:      { en: 'CV link or upload',   ka: 'CV ბმული ან ფაილი' } as Bi,
        cover:   { en: 'Why are you interested?', ka: 'რატომ გაინტერესებთ?' } as Bi,
        submit:  { en: 'Send application',    ka: 'გაგზავნე' } as Bi,
        success: { en: 'Thanks. We respond within one business day.', ka: 'გმადლობთ. ვუპასუხებთ ერთი სამუშაო დღის განმავლობაში.' } as Bi,
      },
    },
  },

  contact: {
    eyebrow:  { en: 'Get in touch',                 ka: 'დაგვიკავშირდით' } as Bi,
    headline: { en: "Tell us what you're building.", ka: 'მოგვწერეთ, რას აშენებთ.' } as Bi,
    intro: {
      en: 'We respond within one business day. For urgent existing-customer issues, use the on-call line.',
      ka: 'ვპასუხობთ ერთი სამუშაო დღის განმავლობაში.',
    } as Bi,
    form: {
      name:    { en: 'Full name',                 ka: 'სახელი' } as Bi,
      email:   { en: 'Work email',                ka: 'ელფოსტა' } as Bi,
      phone:   { en: 'Phone (optional)',          ka: 'ტელეფონი' } as Bi,
      company: { en: 'Company',                   ka: 'კომპანია' } as Bi,
      message: { en: 'What are you working on?',  ka: 'რას აშენებთ?' } as Bi,
      submit:  { en: 'Send message',              ka: 'გაგზავნა' } as Bi,
      success: { en: "Got it. We'll be in touch within one business day.", ka: 'მივიღეთ. დაგიკავშირდებით ერთ სამუშაო დღეში.' } as Bi,
    },
    offices: [
      { city: { en: 'Tbilisi', ka: 'თბილისი' }, role: { en: 'Headquarters',    ka: 'მთავარი ოფისი' }, address: { en: '12 Chavchavadze Ave, 0179', ka: 'ჭავჭავაძის გამზ. 12, 0179' }, phone: '+995 32 240 0080' },
      { city: { en: 'Yerevan', ka: 'ერევანი' }, role: { en: 'Delivery office', ka: 'Delivery ოფისი' }, address: { en: '8 Northern Ave, 0001',      ka: 'Northern Ave 8, 0001' },      phone: '+374 11 555 080'  },
      { city: { en: 'Baku',    ka: 'ბაქო' },    role: { en: 'Delivery office', ka: 'Delivery ოფისი' }, address: { en: 'Port Baku Towers, AZ1010', ka: 'Port Baku Towers, AZ1010' },  phone: '+994 12 404 8080' },
    ] as Office[],
  },
} as const;

/** Resolve a dotted key in an object tree to a value. */
function lookup(tree: unknown, key: string): unknown {
  const parts = key.split('.');
  let v: unknown = tree;
  for (const p of parts) {
    if (v == null || typeof v !== 'object') return undefined;
    v = (v as Record<string, unknown>)[p];
  }
  return v;
}

/**
 * i18n helper. Resolves a bilingual value, returning the requested locale
 * (falling back to en, then to the key as last resort).
 *
 * The optional 3rd arg is an override tree (a CONTENT-shaped object that
 * may carry per-page DB overrides — see `lib/pageCopy.ts`). Override wins
 * if it has the key; otherwise we fall back to the static CONTENT bundle.
 */
export function t(lang: Locale, key: string, override?: unknown): string {
  let v = override !== undefined ? lookup(override, key) : undefined;
  if (v === undefined) v = lookup(CONTENT, key);
  if (v && typeof v === 'object' && (lang in (v as Record<string, unknown>))) {
    const r = (v as Record<string, string>)[lang];
    return r ?? (v as Record<string, string>).en ?? key;
  }
  return typeof v === 'string' ? v : key;
}

/** Same as t() but returns an array (e.g. hero headline lines). */
export function tArr(lang: Locale, key: string, override?: unknown): string[] {
  let v = override !== undefined ? lookup(override, key) : undefined;
  if (v === undefined) v = lookup(CONTENT, key);
  if (v && typeof v === 'object' && (lang in (v as Record<string, unknown>))) {
    const x = (v as Record<string, string[] | string>)[lang];
    return Array.isArray(x) ? x : x ? [x as string] : [];
  }
  return [];
}
