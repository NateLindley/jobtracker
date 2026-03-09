import { useState } from 'react';
import { createApplication } from '../api';
import type { Status } from '../types';

interface Props {
  onCreated: () => void;
  onCancel: () => void;
}

export default function AddApplicationForm({ onCreated, onCancel }: Props) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<Status>('APPLIED');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!company || !role) { setError('Company and role are required'); return; }

    let parsedNotes = null;
    if (notes.trim()) {
      try { parsedNotes = JSON.parse(notes); }
      catch { setError('Notes must be valid JSON (e.g. {"salary": "$120k"})'); return; }
    }

    setLoading(true);
    try {
      await createApplication({
        company,
        role,
        status,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        notes: parsedNotes,
      });
      onCreated();
    } catch {
      setError('Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    color: 'var(--text)',
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
    width: '100%',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--muted)',
    marginBottom: '0.375rem',
    letterSpacing: '0.04em',
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
        + NEW APPLICATION
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>COMPANY</label>
          <input style={inputStyle} value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div>
          <label style={labelStyle}>ROLE</label>
          <input style={inputStyle} value={role} onChange={e => setRole(e.target.value)} placeholder="Senior Engineer" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>STATUS</label>
          <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option value="APPLIED">APPLIED</option>
            <option value="INTERVIEWING">INTERVIEWING</option>
            <option value="OFFER">OFFER</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>TAGS (comma-separated)</label>
          <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} placeholder="remote, senior, startup" />
        </div>
      </div>

      <div>
        <label style={labelStyle}>NOTES (JSON — stored as JSONB)</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={'{"salary": "$150k", "recruiter": "Jane"}'}
        />
      </div>

      {error && <div style={{ color: 'var(--rejected)', fontSize: '0.8rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--muted)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: 'var(--accent)', border: 'none', borderRadius: '4px', color: '#0f0f0f', fontWeight: 600, padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
