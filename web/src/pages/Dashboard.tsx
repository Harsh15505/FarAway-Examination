/** Dashboard page — Phase 2a using Phase 1 design system.
 *  Matches Stitch screen A1. Types aligned with Phase 1 api.ts exactly.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  ClipboardList, Building2, AlertTriangle, Users,
  Package, Eye, Key, AlertCircle,
} from 'lucide-react';
import { StatCard, Card, LoadingState, ErrorState, Button } from '../components/ui';
import { dashboardApi, type DashboardStats, type ActivityItem, type PackageDistStatus } from '../services/api';
import { Link } from 'react-router-dom';

// ─── Sub-components ──────────────────────────────────────────

const activityTypeColors: Record<string, string> = {
  SUCCESS: 'var(--success)',
  WARNING: 'var(--warning)',
  ERROR:   'var(--danger)',
  CRYPTO:  'var(--purple)',
  INFO:    'var(--primary)',
};

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item, i) => {
        const color = activityTypeColors[item.type] ?? 'var(--primary)';
        return (
          <div key={item.id ?? i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color,
              background: color + '18',
              padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1,
            }}>[{item.type}]</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0 }}>{item.message}</p>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.actor}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PackageDistBar({ pkg }: { pkg: PackageDistStatus }) {
  const pct = pkg.total > 0 ? Math.round((pkg.distributed / pkg.total) * 100) : 0;
  const color = pct === 100 ? 'var(--success)' : pct >= 60 ? 'var(--primary)' : 'var(--warning)';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{pkg.exam_name}</span>
        <span style={{ color, fontWeight: 700 }}>{pct}% <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pkg.distributed}/{pkg.total})</span></span>
      </div>
      <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 8, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// Simple risk map using demo data (no backend endpoint yet)
const DEMO_RISK_CENTERS = [
  { code: 'Delhi-01', high: false, medium: false }, { code: 'Delhi-12', high: true, medium: false },
  { code: 'Mum-89', high: false, medium: true },    { code: 'Kol-22', high: false, medium: false },
  { code: 'Che-05', high: false, medium: false },   { code: 'Blr-47', high: false, medium: false },
  { code: 'Pun-14', high: false, medium: false },   { code: 'Hyd-99', high: false, medium: true },
  { code: 'Ahm-03', high: false, medium: false },   { code: 'Luc-11', high: false, medium: false },
  { code: 'Pat-88', high: true, medium: false },    { code: 'Jai-02', high: false, medium: false },
];

// ─── Demo fallback (while backend GAP-3 is pending) ──────────

const DEMO_STATS: DashboardStats = {
  total_questions: 3847,
  total_exams: 14,
  total_centers: 312,
  total_audit_events: 10420,
  active_sessions: 227000,
  critical_alerts: 3,
  recent_activity: [
    { id: '1', type: 'SUCCESS', message: 'Package delivered to Center #47', actor: 'NTA System', timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: '2', type: 'INFO',    message: 'Anomaly flagged at Delhi Center 12', actor: 'Edge AI', timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: '3', type: 'CRYPTO',  message: 'Exam package NEET-2026-S1 compiled', actor: 'Admin Sharma', timestamp: new Date(Date.now() - 1080000).toISOString() },
    { id: '4', type: 'SUCCESS', message: '847 candidates authenticated', actor: 'Edge Server', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '5', type: 'WARNING', message: 'Center #89 risk score elevated to HIGH', actor: 'AI Model', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: '6', type: 'INFO',    message: 'Question bank updated — 340 new questions', actor: 'Expert Mehta', timestamp: new Date(Date.now() - 10800000).toISOString() },
  ],
  package_distribution_status: [
    { exam_name: 'NEET-UG-2026 (Phase 1)', distributed: 280, total: 300 },
    { exam_name: 'JEE-Mains-Apr-S1', distributed: 85, total: 120 },
    { exam_name: 'CUET-PG-Sci', distributed: 12, total: 45 },
  ],
};

// ─── Main Page ────────────────────────────────────────────────

export default function Dashboard() {
  const { getToken } = useAuth();
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const data = await dashboardApi.getStats(token!);
        if (!cancelled) { setStats(data); setLoading(false); }
      } catch {
        if (!cancelled) {
          console.warn('Dashboard stats endpoint not ready (GAP-3). Using demo data.');
          setStats(DEMO_STATS);
          setUsingDemo(true);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (!stats)  return <ErrorState message={error ?? 'Failed to load dashboard.'} onRetry={() => { setLoading(true); setError(null); }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* GAP-3 Demo Banner */}
      {usingDemo && (
        <div style={{
          background: 'var(--warning-light)', border: '1px solid var(--warning)',
          borderRadius: 8, padding: '10px 16px', fontSize: 13, color: 'var(--warning-text)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={15} />
          Showing demo data — <code style={{ fontFamily: 'var(--font-mono)' }}>GET /dashboard/stats</code> not yet implemented (BackendGaps.md: GAP-3)
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0 }}>System Overview</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>National examination operations — real-time command view.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/monitoring">
            <Button variant="secondary" size="sm" icon={<Eye size={14} />}>Live Monitor</Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            icon={<Key size={14} />}
            style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}
          >
            Release Key
          </Button>
          <Link to="/exams">
            <Button variant="primary" size="sm" icon={<Package size={14} />}>Compile Exam</Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Scheduled Exams"   value={stats.total_exams}                     color="blue"   icon={<ClipboardList size={20} color="var(--primary)" />} />
        <StatCard label="Active Centers"    value={stats.total_centers}                   color="green"  icon={<Building2 size={20} color="var(--success)" />} />
        <StatCard label="Enrolled Sessions" value={stats.active_sessions.toLocaleString()} color="blue"   icon={<Users size={20} color="var(--primary)" />} />
        <StatCard label="Critical Alerts"   value={stats.critical_alerts}                 color="red"    icon={<AlertTriangle size={20} color="var(--danger)" />} />
      </div>

      {/* Row 2: Activity Feed + Risk Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recent Activity Feed
            </h3>
            <Link to="/audit" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>View Full Log →</Link>
          </div>
          <ActivityFeed items={stats.recent_activity} />
        </Card>

        <Card>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Center Risk Map
              </h3>
              <span style={{ background: 'var(--purple)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>AI</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>FortisExam Risk Model · Demo data</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {DEMO_RISK_CENTERS.map(c => {
              const color = c.high ? 'var(--danger)' : c.medium ? 'var(--warning)' : 'var(--success)';
              return (
                <div key={c.code} style={{
                  border: `1px solid ${(c.high || c.medium) ? color : 'var(--border)'}`,
                  borderRadius: 6, padding: '5px 8px',
                  background: (c.high || c.medium) ? color + '0D' : 'var(--surface)', cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 10, fontWeight: (c.high || c.medium) ? 700 : 500, color: (c.high || c.medium) ? color : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.code}</div>
                  <div style={{ marginTop: 3, height: 3, borderRadius: 2, background: color }} />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
            {[['var(--success)', 'Low'], ['var(--warning)', 'Medium'], ['var(--danger)', 'High']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Distribution Status */}
      <Card>
        <h3 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Package Distribution Status
        </h3>
        {stats.package_distribution_status.map(pkg => (
          <PackageDistBar key={pkg.exam_name} pkg={pkg} />
        ))}
      </Card>
    </div>
  );
}
