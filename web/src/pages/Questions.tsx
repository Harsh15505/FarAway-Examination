/** Question Bank page — Phase 2a implementation using Phase 1 design system.
 *  Matches Stitch screen A2 — Question Bank List.
 *  Uses QuestionMeta (Phase 1 api.ts) + Phase 1 CSS vars + ui components.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Edit2, Trash2, Lock, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Badge, Card, Table, LoadingState, ErrorState,
  PageHeader, EmptyState, ConfirmDialog,
} from '../components/ui';
import { questionsApi, type QuestionMeta } from '../services/api';

// ─── Helpers ─────────────────────────────────────────────────

function subjectColor(subject: string): 'blue' | 'yellow' | 'green' | 'grey' {
  const map: Record<string, 'blue' | 'yellow' | 'green' | 'grey'> = {
    Physics: 'blue', Chemistry: 'yellow', Biology: 'green',
  };
  return map[subject] ?? 'grey';
}

function difficultyColor(d: string): 'green' | 'yellow' | 'red' | 'grey' {
  const lc = d.toLowerCase();
  return lc === 'easy' ? 'green' : lc === 'medium' ? 'yellow' : lc === 'hard' ? 'red' : 'grey';
}

// ─── Right Sidebar ────────────────────────────────────────────

function StatsSidebar({ total, encrypted, pending }: { total: number; encrypted: number; pending: number }) {
  const pctPhysics = 38, pctChem = 31, pctBio = 31;
  const C = 2 * Math.PI * 60; // circumference for r=60

  return (
    <div style={{
      width: 280, flexShrink: 0, borderLeft: '1px solid var(--border)',
      paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Database Statistics
      </h3>

      {/* Donut chart */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Subject Distribution</div>
        <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
          <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="60" fill="none" stroke="var(--primary)" strokeWidth="20"
              strokeDasharray={`${(pctPhysics / 100) * C} ${C}`} strokeDashoffset="0" />
            <circle cx="80" cy="80" r="60" fill="none" stroke="var(--warning)" strokeWidth="20"
              strokeDasharray={`${(pctChem / 100) * C} ${C}`} strokeDashoffset={`${-(pctPhysics / 100) * C}`} />
            <circle cx="80" cy="80" r="60" fill="none" stroke="var(--success)" strokeWidth="20"
              strokeDasharray={`${(pctBio / 100) * C} ${C}`} strokeDashoffset={`${-((pctPhysics + pctChem) / 100) * C}`} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>{total.toLocaleString()}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Total</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Physics', pct: pctPhysics, color: 'var(--primary)' },
            { label: 'Chemistry', pct: pctChem, color: 'var(--warning)' },
            { label: 'Biology', pct: pctBio, color: 'var(--success)' },
          ].map(({ label, pct, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Difficulty bar */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Difficulty Spread</div>
        <div style={{ height: 12, borderRadius: 6, display: 'flex', overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ width: '45%', background: 'var(--success)' }} />
          <div style={{ width: '35%', background: 'var(--warning)' }} />
          <div style={{ width: '20%', background: 'var(--danger)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Easy (45%)</span><span>Med (35%)</span><span>Hard (20%)</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Security status */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Security Status</div>
        <div style={{
          background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: 8,
          padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={16} color="var(--success)" />
            <span style={{ fontSize: 13, color: 'var(--success-text)', fontWeight: 500 }}>Encrypted</span>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--success-text)' }}>{encrypted.toLocaleString()}</span>
        </div>
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} color="var(--text-muted)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Pending Review</span>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{pending}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function Questions() {
  const navigate     = useNavigate();
  const { getToken } = useAuth();

  const [questions, setQuestions] = useState<QuestionMeta[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [subject, setSubject]     = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const token = await getToken();
      const res = await questionsApi.list(token!, {
        ...(subject    ? { subject }    : {}),
        ...(difficulty ? { difficulty } : {}),
      });
      setQuestions(res.items ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, subject, difficulty]);

  useEffect(() => { load(); }, [load]);

  const filtered = questions.filter(q =>
    !search || q.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = await getToken();
      await questionsApi.delete(token!, deleteId);
      setQuestions(prev => prev.filter(q => q.id !== deleteId));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const cols = [
    {
      key: 'id', label: 'Q.ID', width: 120,
      render: (v: unknown) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
          {String(v).slice(0, 8)}…
        </span>
      ),
    },
    {
      key: 'subject', label: 'Subject', width: 100,
      render: (v: unknown) => <Badge color={subjectColor(String(v))}>{String(v)}</Badge>,
    },
    {
      key: 'difficulty', label: 'Difficulty', width: 90,
      render: (v: unknown) => <Badge color={difficultyColor(String(v))} dot>{String(v)}</Badge>,
    },
    {
      key: 'is_encrypted', label: 'Status', width: 120,
      render: (v: unknown) => v
        ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: 12, fontWeight: 700 }}><Lock size={13} />ENCRYPTED</span>
        : <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}><FileText size={13} />DRAFT</span>,
    },
    {
      key: 'created_at', label: 'Created', width: 100,
      render: (v: unknown) => (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {v ? new Date(String(v)).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'id', label: 'Actions', width: 80,
      render: (_: unknown, row: unknown) => {
        const r = row as QuestionMeta;
        return (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              title="Edit"
              onClick={(e) => { e.stopPropagation(); navigate(`/questions/${r.id}/edit`); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4 }}
            >
              <Edit2 size={15} />
            </button>
            <button
              title="Delete"
              onClick={(e) => { e.stopPropagation(); setDeleteId(r.id); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4, borderRadius: 4 }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  const encryptedCount = questions.filter(q => q.is_encrypted).length;
  const pendingCount   = questions.filter(q => !q.is_encrypted).length;

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Main Area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PageHeader
          title="Question Bank"
          subtitle={`${filtered.length.toLocaleString()} questions`}
          breadcrumb={['Home', 'Question Bank']}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/questions/new')}>
              Add Question
            </Button>
          }
        />

        {/* Filter Bar */}
        <Card style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 220px' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                style={{ paddingLeft: 34, width: '100%', boxSizing: 'border-box' }}
                placeholder="Search by subject…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input" style={{ width: 140 }} value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <select className="input" style={{ width: 140 }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {(search || subject || difficulty) && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setSubject(''); setDifficulty(''); }}>
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Table */}
        {loading ? (
          <LoadingState message="Loading questions..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} color="var(--text-muted)" />}
            title="No questions found"
            description="Add a question or adjust your filters."
            action={<Button variant="primary" icon={<Plus size={14} />} onClick={() => navigate('/questions/new')}>Add Question</Button>}
          />
        ) : (
          <Table
            columns={cols as any}
            data={filtered as any}
            keyField="id"
            onRowClick={(row) => navigate(`/questions/${(row as unknown as QuestionMeta).id}/edit`)}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <StatsSidebar total={questions.length} encrypted={encryptedCount} pending={pendingCount} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Question"
        message="This question will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
