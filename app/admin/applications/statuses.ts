export const APPLICATION_STATUSES = [
  'new', 'reviewed', 'interview', 'offer', 'hired', 'rejected',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
