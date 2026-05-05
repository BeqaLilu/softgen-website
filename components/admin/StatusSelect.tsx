'use client';

import { useTransition } from 'react';
import { STATUS_OPTIONS, type LeadStatus } from './StatusPill';
import { updateLeadStatus } from '@/app/admin/leads/actions';

export function StatusSelect({
  id,
  current,
}: {
  id: string;
  current: LeadStatus;
}) {
  const [pending, start] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const next = e.currentTarget.value;
        start(async () => {
          await updateLeadStatus(id, next);
        });
      }}
      className="input"
      style={{ width: 180, padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
