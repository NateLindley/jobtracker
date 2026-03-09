import type { JobApplication, Status } from '../types';
import { updateApplication, deleteApplication } from '../api';

const STATUS_COLORS: Record<Status, string> = {
  APPLIED: '#5b9cf6',
  INTERVIEWING: '#f5a623',
  OFFER: '#4caf7d',
  REJECTED: '#e05c5c',
};

interface Props {
  app: JobApplication;
  onUpdate: () => void;
}

export default function ApplicationCard({ app, onUpdate }: Props) {
  const handleStatusChange = async (status: Status) => {
    await updateApplication(app.id, { status });
    onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete application to ${app.company}?`)) return;
    await deleteApplication(app.id);
    onUpdate();
  };

  const color = STATUS_COLORS[app.status];

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '6px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>{app.company}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
            {app.role}
          </div>
        </div>
        <button
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '1.1rem',
            lineHeight: 1,
            padding: '0 0.25rem',
          }}
          title="Delete"
        >×</button>
      </div>

      {/* Status selector */}
      <select
        value={app.status}
        onChange={(e) => handleStatusChange(e.target.value as Status)}
        style={{
          background: 'var(--bg)',
          border: `1px solid ${color}`,
          borderRadius: '4px',
          color,
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          padding: '0.25rem 0.5rem',
          width: 'fit-content',
          letterSpacing: '0.05em',
        }}
      >
        {(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'] as Status[]).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Tags */}
      {app.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {app.tags.map((tag) => (
            <span key={tag.id} style={{
              background: 'var(--border)',
              borderRadius: '3px',
              color: 'var(--accent)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.15rem 0.5rem',
            }}>
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Notes preview (JSONB) */}
      {app.notes && (
        <details style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>notes (JSONB)</summary>
          <pre style={{
            marginTop: '0.5rem',
            background: 'var(--bg)',
            padding: '0.5rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            overflowX: 'auto',
            fontFamily: 'var(--font-mono)',
          }}>
            {JSON.stringify(app.notes, null, 2)}
          </pre>
        </details>
      )}

      {/* Date */}
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        {new Date(app.appliedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
