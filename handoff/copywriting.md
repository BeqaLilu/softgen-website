# Softgen — Copy Export (EN + KA)

> Every visible string in the prototype, both languages. The build agent should consume this as the seed data for the bilingual JSON columns in the database, AND as the inline copy for static page strings.

## How to use

- All values are objects: `{ en: "...", ka: "..." }`. Use `value[lang] ?? value.en` at render time.
- For the database seed, structure mirrors `content.jsx` from the prototype.
- Strings labelled "static" go into the `pages` table (or hard-coded in the layout). Strings labelled "seed" go into their respective entity tables.

---

## Brand & navigation (static)

| Key | EN | KA |
|---|---|---|
| `brand.name` | Softgen | Softgen |
| `brand.tagline` | Software for serious business | სერიოზული ბიზნესის პროგრამები |
| `nav.home` | Home | მთავარი |
| `nav.about` | About | ჩვენ შესახებ |
| `nav.services` | Services | სერვისები |
| `nav.projects` | Projects | პროექტები |
| `nav.news` | News | სიახლეები |
| `nav.careers` | Careers | კარიერა |
| `nav.contact` | Contact | კონტაქტი |
| `cta.talk` | Start a project | დაიწყე პროექტი |
| `cta.explore` | Explore work | ნახე პროექტები |
| `cta.learnMore` | Learn more | გაიგე მეტი |
| `cta.readMore` | Read article | წაიკითხე სრულად |
| `cta.backToNews` | All articles | ყველა სტატია |
| `cta.viewAll` | View all | ყველა |
| `footer.address` | 12 Chavchavadze Ave, Tbilisi 0179 | ჭავჭავაძის გამზ. 12, თბილისი 0179 |
| `footer.rights` | All rights reserved. | ყველა უფლება დაცულია. |

---

## Homepage (static)

```json
{
  "hero.eyebrow":  { "en": "Enterprise software, since 2008", "ka": "საწარმოო პროგრამები, 2008-დან" },
  "hero.headline": {
    "en": ["Software", "that runs", "the business."],
    "ka": ["პროგრამები,", "რომლებიც მართავენ", "ბიზნესს."]
  },
  "hero.subtext": {
    "en": "Softgen builds the systems Georgian banks, government agencies and enterprises rely on every day — from core platforms to mission-critical integrations.",
    "ka": "Softgen აშენებს იმ სისტემებს, რომლებზეც ყოველდღე ეყრდნობიან ქართული ბანკები, სახელმწიფო უწყებები და კომპანიები — ფუძემდებლური პლატფორმებიდან კრიტიკულ ინტეგრაციებამდე."
  },

  "stats": [
    { "value": "150+", "label": { "en": "Companies served",   "ka": "მომსახურებული კომპანია" } },
    { "value": "17",   "label": { "en": "Years in business",  "ka": "წლის გამოცდილება" }, "suffix": { "en": "yr", "ka": "წ" } },
    { "value": "50+",  "label": { "en": "Products shipped",   "ka": "გამოშვებული პროდუქტი" } },
    { "value": "24/7", "label": { "en": "Operations support", "ka": "უწყვეტი მხარდაჭერა" } }
  ],

  "services.eyebrow": { "en": "What we do", "ka": "რას ვაკეთებთ" },
  "services.title":   { "en": "Four practices, one engineering team.", "ka": "ოთხი მიმართულება, ერთი საინჟინრო გუნდი." },

  "projectsTeaser.eyebrow": { "en": "Selected work", "ka": "შერჩეული პროექტები" },
  "projectsTeaser.title":   { "en": "Systems that run quietly, every day.", "ka": "სისტემები, რომლებიც წყნარად მუშაობენ ყოველდღე." },

  "partners.eyebrow": { "en": "Trusted by", "ka": "გვენდობიან" },
  "partners.title":   { "en": "150+ organizations across Georgia and the region.", "ka": "150-ზე მეტი ორგანიზაცია საქართველოსა და რეგიონში." },

  "newsTeaser.eyebrow": { "en": "Latest from Softgen", "ka": "სიახლეები" },
  "newsTeaser.title":   { "en": "Notes from the engineering floor.", "ka": "ჩანაწერები საინჟინრო სართულიდან." },

  "cta_band.title":   { "en": "Have a system that should already exist?", "ka": "გაქვთ სისტემა, რომელიც უკვე უნდა არსებობდეს?" },
  "cta_band.subtext": { "en": "Tell us what you're building. We respond within one business day.", "ka": "მოგვწერეთ თქვენს პროექტზე. ვპასუხობთ ერთი სამუშაო დღის განმავლობაში." }
}
```

### Services seed (4 rows for `services` table)

```json
[
  { "slug": "core-platforms",
    "num": "01",
    "title":   { "en": "Core platforms", "ka": "ძირითადი პლატფორმები" },
    "tagline": { "en": "Banking cores, ERP, CRM, back-office — built for scale and the next decade of regulation.",
                 "ka": "საბანკო ბირთვები, ERP, CRM — მასშტაბისა და მომავალი ათწლეულის რეგულაციებისთვის." },
    "body":    { "en": "Banking cores, ERP, CRM and back-office systems built for scale and the next decade of regulation.",
                 "ka": "საბანკო ბირთვები, ERP, CRM და back-office სისტემები მასშტაბისა და მომავალი ათწლეულის რეგულაციებისთვის." },
    "capabilities": [
      { "en": "Core banking systems with full ledger + reconciliation", "ka": "საბანკო ბირთვი სრული ledger-ით და შედარებით" },
      { "en": "ERP and inventory for retail, distribution, logistics",  "ka": "ERP და მარაგი — საცალო, დისტრიბუცია, ლოჯისტიკა" },
      { "en": "Custom CRM with sales pipeline + telephony",              "ka": "ინდივიდუალური CRM — გაყიდვების pipeline და ტელეფონია" },
      { "en": "Back-office workflow automation",                         "ka": "Back-office პროცესების ავტომატიზაცია" }
    ],
    "related": ["tbc-corporate-portal","geocell-billing"]
  },
  { "slug": "government-services",
    "num": "02",
    "title":   { "en": "Government services", "ka": "სახელმწიფო სერვისები" },
    "tagline": { "en": "Citizen-facing portals, document workflows, and inter-agency integrations.",
                 "ka": "მოქალაქეებისთვის პორტალები, დოკუმენტბრუნვა, უწყებათაშორისი ინტეგრაციები." },
    "body":    { "en": "Citizen-facing portals, document workflows and inter-agency integrations that hold up under load.",
                 "ka": "მოქალაქეებზე ორიენტირებული პორტალები, დოკუმენტბრუნვა და უწყებათაშორისი ინტეგრაციები." },
    "capabilities": [
      { "en": "Citizen portals with bilingual support",          "ka": "მოქალაქის პორტალი ორენოვანი მხარდაჭერით" },
      { "en": "Document workflow + e-signature",                 "ka": "დოკუმენტბრუნვა და e-signature" },
      { "en": "Inter-agency integration buses",                  "ka": "უწყებათაშორისი ინტეგრაციული მაგისტრალები" },
      { "en": "Public-data registries",                          "ka": "საჯარო მონაცემთა რეესტრები" }
    ],
    "related": ["rs-tax-pipeline"]
  },
  { "slug": "security-identity",
    "num": "03",
    "title":   { "en": "Security & identity", "ka": "უსაფრთხოება და იდენტიფიკაცია" },
    "tagline": { "en": "Authentication, fraud monitoring, and compliance tooling.",
                 "ka": "ავთენტიფიკაცია, თაღლითობის მონიტორინგი, compliance." },
    "body":    { "en": "Authentication, fraud monitoring and compliance tooling. Audited annually, 24/7 on-call.",
                 "ka": "ავთენტიფიკაცია, თაღლითობის მონიტორინგი და compliance. ყოველწლიური აუდიტი, 24/7 მხარდაჭერა." },
    "capabilities": [
      { "en": "OAuth 2.0 / OIDC identity platforms",                   "ka": "OAuth 2.0 / OIDC იდენტიფიკაცია" },
      { "en": "Real-time fraud monitoring",                            "ka": "თაღლითობის მონიტორინგი რეალურ დროში" },
      { "en": "Annual penetration tests + compliance reports",         "ka": "ყოველწლიური pen-test და compliance ანგარიშები" },
      { "en": "PCI-DSS and ISO 27001 advisory",                        "ka": "PCI-DSS და ISO 27001 კონსულტაცია" }
    ],
    "related": ["lifelock-id-platform"]
  },
  { "slug": "custom-engineering",
    "num": "04",
    "title":   { "en": "Custom engineering", "ka": "ინდივიდუალური დამუშავება" },
    "tagline": { "en": "When the off-the-shelf answer doesn't fit, we build the right one.",
                 "ka": "როცა მზა გადაწყვეტა არ ჯდება — ვაშენებთ შესაბამისს." },
    "body":    { "en": "When the off-the-shelf answer doesn't fit, we build the right one — typed, tested and documented.",
                 "ka": "როცა მზა გადაწყვეტა არ ჯდება — ვაშენებთ შესაბამისს, ტიპიზებულს, ტესტირებულს, დოკუმენტირებულს." },
    "capabilities": [
      { "en": "Greenfield product engineering",                "ka": "ახალი პროდუქტის შექმნა" },
      { "en": "Legacy migration + modernization",              "ka": "ძველი სისტემების მიგრაცია" },
      { "en": "Hard-real-time and high-throughput systems",    "ka": "მაღალი დატვირთვის სისტემები" },
      { "en": "Embedded teams (3-12 engineers)",               "ka": "ჩართული გუნდები (3-12 ინჟინერი)" }
    ],
    "related": ["geocell-billing","tbc-corporate-portal"]
  }
]
```

### Projects seed (4 rows for `projects` table)

```json
[
  { "slug": "tbc-corporate-portal",
    "title":    { "en": "TBC Corporate Portal", "ka": "TBC კორპორაციული პორტალი" },
    "category": "FinTech", "year": 2024, "accent": "indigo",
    "client": "TBC Bank",
    "duration": { "en": "14 weeks", "ka": "14 კვირა" },
    "scope":    { "en": "Design, engineering, ops", "ka": "დიზაინი, ინჟინერია, ოპერაციები" },
    "team": "11 engineers · 2 designers",
    "tags": ["Next.js","TypeScript","BFF","OAuth","Edge cache"],
    "summary":  { "en": "A new corporate banking portal serving 4,000+ business clients, shipped from contract signature to production in 14 weeks.",
                  "ka": "ახალი კორპორაციული საბანკო პორტალი — 4000+ ბიზნეს კლიენტი, გაშვებული 14 კვირაში." },
    "featured": true, "published": true
  },
  { "slug": "rs-tax-pipeline",
    "title":    { "en": "Revenue Service tax pipeline", "ka": "შემოსავლების სამსახურის სატარიფო ხაზი" },
    "category": "Government", "year": 2023, "accent": "violet",
    "featured": true, "published": true
  },
  { "slug": "lifelock-id-platform",
    "title":    { "en": "LifeLock ID platform", "ka": "LifeLock იდენტიფიკაცია" },
    "category": "Security", "year": 2023, "accent": "plum",
    "featured": true, "published": true
  },
  { "slug": "geocell-billing",
    "title":    { "en": "Geocell unified billing", "ka": "Geocell ერთიანი ბილინგი" },
    "category": "Enterprise", "year": 2022, "accent": "indigo",
    "featured": true, "published": true
  }
]
```

### TBC project body (long-form, both languages — see prototype `content.jsx::projectsPage.detail.tbc-corporate-portal.body`)

The full TBC case study body lives in `content.jsx`. For the rest of the projects, write similar 4-6 section bodies during content load.

### Partners seed (18 rows for `partners` table)

```
TBC Bank · Bank of Georgia · Liberty · Credo · Revenue Service · Pension Agency ·
Public Service Hall · Geocell · Magti · Silknet · Wissol · SOCAR · Adjara Group ·
Aldagi · TBC Insurance · GPI · Tegeta · Borjomi
```

---

## About page (static + team seed)

```json
{
  "about.eyebrow":  { "en": "About Softgen", "ka": "Softgen-ის შესახებ" },
  "about.headline": { "en": "Seventeen years of building software that has to work.",
                      "ka": "ჩვიდმეტი წელი ვქმნით პროგრამებს, რომლებიც უნდა მუშაობდნენ." },
  "about.intro":    { "en": "Founded in Tbilisi in 2008, Softgen has grown alongside Georgia's financial and digital infrastructure. We're a 90-person engineering company that takes long-term responsibility for the systems we deliver.",
                      "ka": "დაარსებული თბილისში 2008 წელს, Softgen გაიზარდა საქართველოს ფინანსურ და ციფრულ ინფრასტრუქტურასთან ერთად. ჩვენ ვართ 90 ადამიანის საინჟინრო კომპანია, რომელიც გრძელვადიან პასუხისმგებლობას იღებს მის მიერ შექმნილ სისტემებზე." }
}
```

### Timeline (5 milestones)

| Year | Title (EN) | Title (KA) | Body (EN) | Body (KA) |
|---|---|---|---|---|
| 2008 | Founded in Tbilisi | დაარსდა თბილისში | Three engineers, one core-banking contract, a basement office on Chavchavadze. | სამი ინჟინერი, ერთი საბანკო კონტრაქტი, სარდაფი ჭავჭავაძეზე. |
| 2012 | First government contract | პირველი სახელმწიფო კონტრაქტი | Built the document workflow that still routes most inter-ministry correspondence. | შექმნა დოკუმენტბრუნვა, რომელიც დღესაც მუშაობს უწყებებს შორის. |
| 2016 | Security practice spun up | უსაფრთხოების მიმართულება დაიბადა | Dedicated team for fraud, identity and compliance work — now a quarter of the company. | გამოიყო ცალკე გუნდი თაღლითობის, იდენტიფიკაციისა და compliance-ის მიმართულებით. |
| 2020 | Crossed 100 customers | 100 კლიენტის ნიშნული | Same year we shipped pandemic-era systems for the Public Service Hall in 11 weeks. | იმავე წელს გადავცეთ პანდემიის პერიოდის სისტემები სახელმწიფო სერვისების სააგენტოს 11 კვირაში. |
| 2024 | Regional expansion | რეგიონული ექსპანსია | Opened delivery offices in Yerevan and Baku. First contracts in Armenia and Azerbaijan signed. | გავხსენი ოფისები ერევანში და ბაქოში. პირველი კონტრაქტები სომხეთსა და აზერბაიჯანში. |

### Three commitments

| # | Title EN / KA | Body EN / KA |
|---|---|---|
| 01 | We finish what we ship. / რასაც ვუშვებთ — ვამთავრებთ. | Every system has a maintenance owner the day it goes live. There is no "throwing it over the wall." / ყველა სისტემას აქვს მფლობელი გაშვების დღიდან. "კედლის გადაგდება" არ ხდება. |
| 02 | We write things down. / ჩვენ ვწერთ დოკუმენტაციას. | Architecture decisions, runbooks, on-call playbooks — all documented in a way another engineer can pick up. / არქიტექტურული გადაწყვეტილებები, runbook-ები, on-call playbook-ები — ყველა დოკუმენტირებული. |
| 03 | We stay accountable in writing. / პასუხისმგებლობას ვიღებთ წერილობით. | SLAs are real, contracts are specific, and uptime numbers are reported quarterly to every customer. / SLA-ები რეალურია, კონტრაქტები კონკრეტული, uptime-ის რიცხვები იგზავნება ყოველკვარტალურად. |

### Team (6 rows for `team_members` table)

| Name | Role EN | Role KA | Since |
|---|---|---|---|
| Levan Kapanadze | Founder & CEO | დამფუძნებელი / CEO | 2008 |
| Nino Tsiklauri | Chief Technology Officer | CTO | 2011 |
| Giorgi Mamulashvili | Head of Security | უსაფრთხოების უფროსი | 2016 |
| Tamar Beridze | Head of Government | სახ. სექტორის უფროსი | 2014 |
| Vakhtang Lortkipanidze | Head of FinTech | ფინტექის უფროსი | 2013 |
| Ana Jorjadze | Head of Engineering | ინჟინერიის უფროსი | 2017 |

---

## News (static + articles seed)

```json
{
  "news.eyebrow":  { "en": "Newsroom", "ka": "სიახლეები" },
  "news.headline": { "en": "Notes from inside the engineering floor.", "ka": "ჩანაწერები საინჟინრო სართულიდან." },
  "news.intro":    { "en": "Customer announcements, technical write-ups, and the occasional opinion. No marketing pages — actual notes from the people building the systems.",
                     "ka": "კლიენტებთან ანონსები, ტექნიკური სტატიები, ხანდახან აზრი. მარკეტინგული გვერდები არ არის." },
  "news.categories": [
    { "id": "all",         "label": { "en": "All",          "ka": "ყველა" } },
    { "id": "engineering", "label": { "en": "Engineering",  "ka": "ინჟინერია" } },
    { "id": "company",     "label": { "en": "Company",      "ka": "კომპანია" } },
    { "id": "security",    "label": { "en": "Security",     "ka": "უსაფრთხოება" } },
    { "id": "case",        "label": { "en": "Case studies", "ka": "ქეისები" } }
  ]
}
```

### Articles seed (6 rows)

See `content.jsx::news.articles` for the canonical record. Summary:

| Slug | Cat | Date | Author | Title EN | Read |
|---|---|---|---|---|---|
| `shipping-tbc-corporate-portal` | case | 2026-04-22 | Vakhtang Lortkipanidze | How we shipped the TBC Corporate Portal in 14 weeks | 9 min |
| `type-safe-currency-amounts` | engineering | 2026-04-08 | Ana Jorjadze | Why we type-check currency amounts at the database boundary | 6 min |
| `softgen-yerevan-baku` | company | 2026-03-30 | Levan Kapanadze | Opening offices in Yerevan and Baku | 3 min |
| `annual-pen-test-2026` | security | 2026-03-12 | Giorgi Mamulashvili | What we found in our 2026 annual pen test | 5 min |
| `designing-for-public-service-hall` | case | 2026-02-28 | Tamar Beridze | Designing forms for the Public Service Hall | 11 min |
| `monorepo-after-three-years` | engineering | 2026-02-14 | Ana Jorjadze | Our monorepo after three years | 8 min |

The full bilingual long-form body for `shipping-tbc-corporate-portal` is in `content.jsx::news.bodies`. For the other articles, write similarly-structured bodies (4-6 sections) when seeding content.

---

## Careers (static + jobs seed)

```json
{
  "careers.eyebrow":  { "en": "Open positions", "ka": "ღია პოზიციები" },
  "careers.headline": { "en": "Engineers who finish what they ship.", "ka": "ინჟინრები, რომლებიც ამთავრებენ, რასაც უშვებენ." },
  "careers.intro":    { "en": "We hire slowly and keep people for years. Below are roles we're actively hiring for; if none fit but you're interesting, write to careers@softgen.ge anyway.",
                        "ka": "ჩვენ ვამატებთ ადამიანებს ნელა და ვინარჩუნებთ წლების განმავლობაში." },

  "careers.types": {
    "full_time": { "en": "Full-time", "ka": "სრული განაკვეთი" },
    "part_time": { "en": "Part-time", "ka": "ნახევარი" },
    "contract":  { "en": "Contract",  "ka": "კონტრაქტი" }
  },

  "careers.apply.title": { "en": "Apply for this role", "ka": "მიმართე ამ პოზიციაზე" },
  "careers.apply.fields": {
    "name":   { "en": "Full name",            "ka": "სახელი და გვარი" },
    "email":  { "en": "Email",                "ka": "ელფოსტა" },
    "phone":  { "en": "Phone (optional)",     "ka": "ტელეფონი" },
    "cv":     { "en": "CV link or upload",    "ka": "CV ბმული ან ფაილი" },
    "cover":  { "en": "Why are you interested?", "ka": "რატომ გაინტერესებთ?" },
    "submit": { "en": "Send application",     "ka": "გაგზავნე" },
    "success":{ "en": "Thanks. We respond within one business day.",
                "ka": "გმადლობთ. ვუპასუხებთ ერთი სამუშაო დღის განმავლობაში." }
  }
}
```

### Jobs seed (7 rows)

| Slug | Title EN | Dept | Type | Location | Description EN |
|---|---|---|---|---|---|
| `senior-backend-engineer` | Senior Backend Engineer | Engineering | full_time | Tbilisi | Lead the core-banking integration layer. TypeScript, PostgreSQL, designing for 5-year horizons. |
| `site-reliability-engineer` | Site Reliability Engineer | Engineering | full_time | Tbilisi / Yerevan | On-call rotation for our most critical systems. Postgres, Kubernetes, observability. |
| `product-designer` | Product Designer | Design | full_time | Tbilisi | Design forms, dashboards, and admin tooling for enterprise users. Bilingual (KA + EN) a plus. |
| `frontend-engineer` | Frontend Engineer | Engineering | full_time | Tbilisi | React, TypeScript, design-system work. We ship to citizen-facing portals at high scale. |
| `security-analyst` | Security Analyst | Engineering | full_time | Tbilisi | Fraud monitoring, incident response, customer-facing security reviews. |
| `delivery-manager` | Delivery Manager | Operations | full_time | Tbilisi | Run the relationship with two of our top-five customers. Schedules, status, written accountability. |
| `junior-frontend` | Junior Frontend Engineer | Engineering | part_time | Tbilisi | 20h/week. We pair you with a senior for 6 months, no exceptions. |

Georgian translations for each are in `content.jsx::careers.jobs`.

---

## Contact (static)

```json
{
  "contact.eyebrow":  { "en": "Get in touch", "ka": "დაგვიკავშირდით" },
  "contact.headline": { "en": "Tell us what you're building.", "ka": "მოგვწერეთ, რას აშენებთ." },
  "contact.intro":    { "en": "We respond within one business day. For urgent existing-customer issues, use the on-call line.",
                        "ka": "ვპასუხობთ ერთი სამუშაო დღის განმავლობაში." },

  "contact.form": {
    "name":    { "en": "Full name",         "ka": "სახელი" },
    "email":   { "en": "Work email",        "ka": "ელფოსტა" },
    "phone":   { "en": "Phone (optional)",  "ka": "ტელეფონი" },
    "company": { "en": "Company",           "ka": "კომპანია" },
    "message": { "en": "What are you working on?", "ka": "რას აშენებთ?" },
    "submit":  { "en": "Send message",      "ka": "გაგზავნა" },
    "success": { "en": "Got it. We'll be in touch within one business day.",
                 "ka": "მივიღეთ. დაგიკავშირდებით ერთ სამუშაო დღეში." }
  }
}
```

### Offices

| City EN / KA | Role EN / KA | Address EN / KA | Phone |
|---|---|---|---|
| Tbilisi / თბილისი | Headquarters / მთავარი ოფისი | 12 Chavchavadze Ave, 0179 / ჭავჭავაძის გამზ. 12, 0179 | +995 32 240 0080 |
| Yerevan / ერევანი | Delivery office / Delivery ოფისი | 8 Northern Ave, 0001 / Northern Ave 8, 0001 | +374 11 555 080 |
| Baku / ბაქო | Delivery office / Delivery ოფისი | Port Baku Towers, AZ1010 / Port Baku Towers, AZ1010 | +994 12 404 8080 |

---

## Source of truth

`content.jsx` in the prototype is canonical. If anything here disagrees with that file, **the file wins** — copy from there. This document exists so the build agent can scan all copy in one place.
