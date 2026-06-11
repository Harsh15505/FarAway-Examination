import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  BookOpen, ClipboardList, Building2, ShieldCheck,
  AlertTriangle, Users, Package, ArrowRight, Radio,
} from 'lucide-react';
import { StatCard, Card, LoadingState, ErrorState, Badge } from '../components/ui';
import { dashboardApi, type DashboardStats, type ActivityItem } from '../services/api';
import { Link } from 'react-router-dom';

const activityTypeMap: Record<string, { color: string; label: string }> = {
  SUCCESS: { color: 'var(--success)', label: 'SUCCESS' },
  WARNING: { color: 'var(--warning)', label: 'WARNING' },
  ERROR:   { color: 'var(--danger)',  label: 'ERROR' },
  CRYPTO:  { color: 'var(--purple)', label: 'CRYPTO' },
  INFO:    { color: 'var(--primary)', label: 'INFO' },
};

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item, i) => {
        const cfg = activityTypeMap[item.type] ?? activityTypeMap.INFO;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: cfg.color,
              background: cfg.color + '18',
              padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1,
            }}>[{cfg.label}]</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.message}</p>
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

function PackageDistBar({ name, distributed, total }: { name: string; distributed: number; total: number }) {
  const pct = total > 0 ? Math.round((distributed / total) * 100) : 0;
  const color = pct >= 80 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--primary)';
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{name}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{distributed}/{total} Centers</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// Fallback demo data when backend unavailable
const DEMO_STATS: DashboardStats = {
  total_questions: 3847,
  total_exams: 14,
  total_centers: 312,
  total_audit_events: 10000,
  active_sessions: 2270000,
  critical_alerts: 3,
  recent_activity: [
    { id: '1', type: 'SUCCESS', message: 'Package delivered to Center #47 NTA System', actor: 'NTA System', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
    { id: '2', type: 'WARNING', message: 'Anomaly flagged at Delhi Center 12', actor: 'Edge AI', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: '3', type: 'CRYPTO', message: 'Exam package NEET-2026-S1 compiled', actor: 'Admin Sharma', timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
    { id: '4', type: 'SUCCESS', message: '343 candidates authenticated', actor: 'Edge Server', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
    { id: '5', type: 'INFO', message: 'Question bank updated: 345 questions', actor: 'Expert Matrix', timestamp: new Date(Date.now() - 90 * 60000).toISOString() },
  ],
  package_distribution_status: [
    { exam_name: 'NEET-UG-2026 (Phase 1)', distributed: 308, total: 308 },
    { exam_name: 'JEE Mains April 1', distributed: 78, total: 100 },
    { exam_name: 'CUET PG-S4', distributed: 145, total: 308 },
  ],
};

export default function Dashboard() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const data = await dashboardApi.getStats(token ?? '');
        setStats(data);
      } catch (err) {
        // Use demo data if endpoint not yet available
        console.warn('Dashboard API unavailable, using demo data:', err);
        setStats(DEMO_STATS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;
  if (!stats) return null;

  return (
    <div>
      {/* Welcome header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Welcome, NTA Admin
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            System operational. Overview of current national examination cycles.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/monitoring">
            <button className="btn btn-ghost btn-sm">
              <Radio size={13} />
              View Live Monitor
            </button>
          </Link>
          <Link to="/exams">
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              Release Key
            </button>
          </Link>
          <Link to="/exams">
            <button className="btn btn-primary btn-sm">
              <Package size={13} />
              Compile Exam
            </button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-cols-4 mb-6">
        <StatCard
          label="Scheduled"
          value={stats.total_exams}
          change="Exams"
          icon={<ClipboardList size={20} />}
          color="blue"
        />
        <StatCard
          label="Active"
          value={stats.total_centers}
          change="Centers"
          icon={<Building2 size={20} />}
          color="green"
        />
        <StatCard
          label="Enrolled"
          value={stats.active_sessions}
          change="Candidates"
          icon={<Users size={20} />}
          color="purple"
        />
        <StatCard
          label="Critical"
          value={stats.critical_alerts}
          change="Alerts"
          icon={<AlertTriangle size={20} />}
          color="red"
        />
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 20 }}>
        {/* Activity Feed */}
        <Card
          title="Recent Activity Feed"
          action={
            <Link to="/audit">
              <button className="btn btn-ghost btn-sm">
                View Full Log <ArrowRight size={12} />
              </button>
            </Link>
          }
        >
          <ActivityFeed items={stats.recent_activity} />
        </Card>

        {/* Center Risk Map placeholder */}
        <Card title="Center Risk Map" subtitle="Powered by FortisExam Risk Model">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 4, fontSize: 10, fontWeight: 600, textAlign: 'center',
          }}>
            {['Del-01', 'Mum-06', 'Kol-11', 'Che-16', 'Ben-21'].map(c => (
              <div key={c} style={{ background: 'var(--success-light)', color: 'var(--success-text)', padding: '4px 2px', borderRadius: 4 }}>{c}</div>
            ))}
            {['Del-08', 'Mum-09', 'Hyd-13'].map(c => (
              <div key={c} style={{ background: 'var(--danger-light)', color: 'var(--danger-text)', padding: '4px 2px', borderRadius: 4 }}>{c}</div>
            ))}
            {['Pun-17', 'Raj-22', 'Jkh-23', 'Jai-24', 'Lko-25', 'Pat-26'].map(c => (
              <div key={c} style={{ background: 'var(--warning-light)', color: 'var(--warning-text)', padding: '4px 2px', borderRadius: 4 }}>{c}</div>
            ))}
          </div>
          <Link to="/centers">
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%' }}>
              Full View <ArrowRight size={12} />
            </button>
          </Link>
        </Card>
      </div>

      {/* Package Distribution */}
      <Card
        title="Package Distribution Status"
        action={<Link to="/distribution"><button className="btn btn-ghost btn-sm">View All</button></Link>}
      >
        {stats.package_distribution_status.map((p, i) => (
          <PackageDistBar key={i} name={p.exam_name} distributed={p.distributed} total={p.total} />
        ))}
      </Card>

      {/* Footer */}
      <div style={{ marginTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
        System v4.12.0 (Secure) · {stats.total_audit_events.toLocaleString()} audit events recorded ·{' '}
        <Badge color="green" dot>All Systems Operational</Badge>
      </div>
    </div>
  );
}
