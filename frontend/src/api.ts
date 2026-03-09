import type { JobApplication, Status } from './types';

const BASE = '/api';

export async function fetchApplications(status?: Status): Promise<JobApplication[]> {
  const url = status ? `${BASE}/applications?status=${status}` : `${BASE}/applications`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
}

export async function createApplication(data: {
  company: string;
  role: string;
  status: Status;
  tags: string[];
  notes: Record<string, unknown> | null;
}): Promise<JobApplication> {
  const res = await fetch(`${BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create application');
  return res.json();
}

export async function updateApplication(
  id: number,
  data: Partial<{ company: string; role: string; status: Status; tags: string[]; notes: Record<string, unknown> | null }>
): Promise<JobApplication> {
  const res = await fetch(`${BASE}/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update application');
  return res.json();
}

export async function deleteApplication(id: number): Promise<void> {
  const res = await fetch(`${BASE}/applications/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete application');
}
