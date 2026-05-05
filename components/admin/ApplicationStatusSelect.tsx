'use client';

import { useTransition } from 'react';
import { updateApplicationStatus } from '@/app/admin/applications/actions';
import { APPLICATION_STATUSES } from '@/app/admin/applications/statuses';

export function ApplicationStatusSelect({
  id,
  current,
}: {
  id: string;
  current: string;
}) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const v = e.currentTarget.value;
        start(async () => {
          await updateApplicationStatus(id, v);
        });
      }}
      className="input"
      style={{ width: 180, padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}
    >
      {APPLICATION_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
