/** Site settings shape + defaults. Imported from both server actions and
 *  client components, so it can't live inside a 'use server' file (those
 *  can only export async functions). */

export type SiteSettings = {
  general: {
    companyName: string;
    contactEmail: string;
    salesEmail: string;
    careersEmail: string;
    onCallPhone: string;
  };
  seo: {
    defaultTitle: { en: string; ka: string };
    defaultDescription: { en: string; ka: string };
    defaultOgImageUrl: string;
  };
  integrations: {
    googleAnalyticsId: string;
    smtpFrom: string;
  };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    companyName: 'Softgen LLC',
    contactEmail: 'hello@softgen.ge',
    salesEmail: 'sales@softgen.ge',
    careersEmail: 'careers@softgen.ge',
    onCallPhone: '+995 32 240 0080',
  },
  seo: {
    defaultTitle: {
      en: 'Softgen — Enterprise software, built in Tbilisi since 2008',
      ka: 'Softgen — საწარმოო პროგრამები, თბილისიდან 2008 წლიდან',
    },
    defaultDescription: {
      en: 'Softgen builds the systems Georgian banks, government agencies and enterprises rely on every day.',
      ka: 'Softgen აშენებს იმ სისტემებს, რომლებზეც ეყრდნობიან ქართული ბანკები, სახელმწიფო და კომპანიები.',
    },
    defaultOgImageUrl: '',
  },
  integrations: {
    googleAnalyticsId: '',
    smtpFrom: 'Softgen <hello@softgen.ge>',
  },
};
