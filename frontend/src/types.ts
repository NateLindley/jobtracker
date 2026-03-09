export type Status = 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';

export interface Tag {
  id: number;
  name: string;
}

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  status: Status;
  appliedAt: string;
  notes: Record<string, unknown> | null;
  tags: Tag[];
}

export interface ApplicationFormData {
  company: string;
  role: string;
  status: Status;
  tags: string; // comma-separated input
  notes: string; // JSON string input
}
