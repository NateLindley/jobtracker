import { useState, useEffect, useCallback } from 'react';
import { fetchApplications } from './api';
import type { JobApplication, Status } from './types';
import ApplicationCard from './components/ApplicationCard';
import AddApplicationForm from './components/AddApplicationForm';

const STATUS_FILTERS: { label: string; value: Status | undefined }[] = [
  { label: 'ALL', value: undefined },
  { label: 'APPLIED', value: 'APPLIED' },
  { label: 'INTERVIEWING', value: 'INTERVIEWING' },
  { label: 'OFFER', value: 'OFFER' },
  { label: 'REJECTED', value: 'REJECTED' },
];

export default function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<Status | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchApplications(filter);
      setApplications(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          job<span style={{ color: 'var(--accent)' }}>tracker</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
          postgres + prisma + react · {applications.length} applications
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Applied', key: 'APPLIED', color: '#5b9cf6' },
          { label: 'Interviewing', key: 'INTERVIEWING', color: '#f5a623' },
          { label: 'Offers', key: 'OFFER', color: '#4caf7d' },
          { label: 'Rejected', key: 'REJECTED', color: '#e05c5c' },
        ].map(({ label, key, color }) => (
          <div key={key} style={{
            background: 'var(--surface)',
            border: `1px solid var(--border)`,
            borderTop: `2px solid ${color}`,
            borderRadius: '6px',
            padding: '0.75rem 1.25rem',
            flex: 1,
            minWidth: '120px',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color }}>
              {counts[key] ?? 0}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setFilter(value)}
              style={{
                background: filter === value ? 'var(--accent)' : 'none',
                border: 'none',
                borderRadius: '4px',
                color: filter === value ? '#0f0f0f' : 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: filter === value ? 600 : 400,
                padding: '0.35rem 0.75rem',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '6px',
            color: '#0f0f0f',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.5rem 1.25rem',
          }}
        >
          + Add Application
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <AddApplicationForm
            onCreated={() => { setShowForm(false); load(); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Application grid */}
      {loading ? (
        <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', padding: '2rem 0' }}>
          loading...
        </div>
      ) : applications.length === 0 ? (
        <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', padding: '2rem 0' }}>
          no applications yet. add one above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} onUpdate={load} />
          ))}
        </div>
      )}
    </div>
  );
}
