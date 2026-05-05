import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

/** `/` → `/{defaultLocale}` so middleware never has to guess. */
export default function RootIndex() {
  redirect(`/${routing.defaultLocale}`);
}
