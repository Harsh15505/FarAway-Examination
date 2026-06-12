/**
 * Live Monitoring — Phase 4
 * Screens: D1 (Proctor Dashboard), D2 (Live Monitoring Feed), A7e (National Overview)
 *
 * Data strategy:
 *   - Security events come from GET /audit/events?event_type=ANOMALY_DETECTED (cloud, no edge JWT needed)
 *   - Session list: GAP-4 (not yet in backend) — uses demo data fallback
 *   - Acknowledge: GAP-5 (not yet in backend) — optimistic UI update only
 *   - Auto-refreshes every 15 seconds
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Activity, AlertTriangle, Eye, RefreshCw, CheckCircle,
  Clock, Monitor, Zap, Bell, BellOff, Filter
} from 'lucide-react';
import {
  PageHeader, Card, StatCard, Alert, Badge, Button,
  Spinner, EmptyState, Tabs
} from '../components/ui';
import { auditApi } from '../services/api';

// ── Demo Monitoring Events ────────────────────────────────────────────────────

interface MonitoringCard {
  id: string;
  session_id: string;
  candidate_id: string;
  alert_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, unknown>;
  center: string;
  acknowledged: boolean;
  created_at: string;
}

const DEMO_EVENTS: MonitoringCard[] = [
  {
    id: 'sec-001', session_id: 'sess-ravi-01', candidate_id: 'cand-ravi-sharma',
    alert_type: 'MULTIPLE_FACES', severity: 'CRITICAL',
    details: { face_count: 3, message: '3 faces detected simultaneously' },
    center: 'Delhi Exam Hub', acknowledged: false,
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'sec-002', session_id: 'sess-priya-02', candidate_id: 'cand-priya-mehta',
    alert_type: 'GAZE_DEVIATION', severity: 'HIGH',
    details: { gaze_yaw: 42.5, gaze_pitch: 12.0, message: 'Sustained gaze away from screen' },
    center: 'Mumbai Central', acknowledged: false,
    created_at: new Date(Date.now() - 480000).toISOString(),
  },
  {
    id: 'sec-003', session_id: 'sess-arjun-03', candidate_id: 'cand-arjun-patel',
    alert_type: 'NO_FACE', severity: 'HIGH',
    details: { duration_seconds: 8, message: 'No face detected for 8 seconds' },
    center: 'Bangalore Hub', acknowledged: true,
    created_at: new Date(Date.now() - 720000).toISOString(),
  },
  {
    id: 'sec-004', session_id: 'sess-neha-04', candidate_id: 'cand-neha-singh',
    alert_type: 'RAPID_ANSWER_CHANGES', severity: 'MEDIUM',
    details: { answer_changes: 12, window_seconds: 30, message: '12 answer changes in 30 seconds' },
    center: 'Chennai Metro', acknowledged: false,
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'sec-005', session_id: 'sess-ravi-01', candidate_id: 'cand-ravi-sharma',
    alert_type: 'CAMERA_BLOCKED', severity: 'MEDIUM',
    details: { message: 'Camera feed obscured or blocked' },
    center: 'Delhi Exam Hub', acknowledged: true,
    created_at: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'sec-006', session_id: 'sess-amit-05', candidate_id: 'cand-amit-kumar',
    alert_type: 'GAZE_DEVIATION', severity: 'LOW',
    details: { gaze_yaw: 18.2, gaze_pitch: 5.3, message: 'Brief gaze deviation' },
    center: 'Pune Tech Park', acknowledged: true,
    created_at: new Date(Date.now() - 1500000).toISOString(),
  },
];

const DEMO_SESSIONS = [
  { id: 'sess-ravi-01', candidate: 'Ravi Sharma', exam: 'JEE Mains 2026', center: 'Delhi Exam Hub', alerts: 2, status: 'active' },
  { id: 'sess-priya-02', candidate: 'Priya Mehta', exam: 'JEE Mains 2026', center: 'Mumbai Central', alerts: 1, status: 'active' },
  { id: 'sess-arjun-03', candidate: 'Arjun Patel', exam: 'JEE Mains 2026', center: 'Bangalore Hub', alerts: 1, status: 'active' },
  { id: 'sess-neha-04', candidate: 'Neha Singh', exam: 'JEE Mains 2026', center: 'Chennai Metro', alerts: 1, status: 'active' },
  { id: 'sess-amit-05', candidate: 'Amit Kumar', exam: 'JEE Mains 2026', center: 'Pune Tech Park', alerts: 1, status: 'active' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<string, { color: 'red' | 'yellow' | 'blue' | 'green' | 'grey'; label: string; icon: React.ReactNode }> = {
  CRITICAL: { color: 'red',    label: 'Critical', icon: <AlertTriangle size={14} /> },
  HIGH:     { color: 'red',    label: 'High',     icon: <AlertTriangle size={14} /> },
  MEDIUM:   { color: 'yellow', label: 'Medium',   icon: <Eye size={14} /> },
  LOW:      { color: 'blue',   label: 'Low',      icon: <Eye size={14} /> },
};

const ALERT_TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  MULTIPLE_FACES:       { label: 'Multiple Faces',       icon: '👥' },
  NO_FACE:              { label: 'No Face Detected',     icon: '🚫' },
  GAZE_DEVIATION:       { label: 'Gaze Deviation',       icon: '👁️' },
  CAMERA_BLOCKED:       { label: 'Camera Blocked',       icon: '📵' },
  RAPID_ANSWER_CHANGES: { label: 'Rapid Answer Changes', icon: '⚡' },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LiveMonitoring() {
  const { getToken } = useAuth();

  // Data state
  const [cards, setCards] = useState<MonitoringCard[]>(DEMO_EVENTS);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // UI state
  const [severityTab, setSeverityTab] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load anomaly events from audit chain ─────────────────────

  const loadEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      // Pull ANOMALY_DETECTED events from cloud audit chain
      const res = await auditApi.listEvents(token, {
        event_type: 'ANOMALY_DETECTED',
        page: 1,
        page_size: 100,
      });

      // Map audit events → MonitoringCard
      const mapped: MonitoringCard[] = res.events.map(evt => {
        let details: Record<string, unknown> = {};
        try { details = JSON.parse(evt.payload); } catch { /* raw */ }
        const sev = (details.severity as string) ?? 'MEDIUM';
        return {
          id: evt.id,
          session_id: evt.target_id ?? 'unknown',
          candidate_id: evt.actor_id,
          alert_type: (details.alert_type as string) ?? evt.event_type,
          severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(sev) ? sev as MonitoringCard['severity'] : 'MEDIUM',
          details,
          center: (details.center as string) ?? 'Unknown Center',
          acknowledged: false,
          created_at: evt.created_at,
        };
      });

      if (mapped.length > 0) {
        setCards(mapped);
        setIsDemo(false);
      } else {
        setCards(DEMO_EVENTS);
        setIsDemo(true);
      }
    } catch {
      setCards(DEMO_EVENTS);
      setIsDemo(true);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [getToken]);

  // Initial load
  useEffect(() => { loadEvents(); }, [loadEvents]);

  // Auto-refresh every 15s
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => loadEvents(true), 15000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, loadEvents]);

  // ── Acknowledge (optimistic) ────────────────────────────────

  const handleAcknowledge = async (id: string) => {
    // Optimistic UI update first
    setCards(prev => prev.map(c => c.id === id ? { ...c, acknowledged: true } : c));

    // Try to call backend (GAP-5) — silently ignore failure
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? '/api/v1'}/monitoring/events/${id}/acknowledge`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
    } catch {
      // GAP-5: endpoint not yet implemented — optimistic update is sufficient for demo
    }
  };

  // ── Derived stats ───────────────────────────────────────────

  const totalAlerts = cards.length;
  const criticalAlerts = cards.filter(c => c.severity === 'CRITICAL' || c.severity === 'HIGH').length;
  const unacknowledged = cards.filter(c => !c.acknowledged).length;
  const activeSessions = new Set(cards.map(c => c.session_id)).size;

  // ── Filtered display ────────────────────────────────────────

  const tabCounts = {
    ALL: cards.length,
    CRITICAL: cards.filter(c => c.severity === 'CRITICAL').length,
    HIGH: cards.filter(c => c.severity === 'HIGH').length,
    MEDIUM: cards.filter(c => c.severity === 'MEDIUM').length,
    LOW: cards.filter(c => c.severity === 'LOW').length,
  };

  let filtered = cards;
  if (severityTab !== 'ALL') filtered = cards.filter(c => c.severity === severityTab);
  if (selectedSession) filtered = filtered.filter(c => c.session_id === selectedSession);

  // ── Render ──────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        breadcrumb={['Security', 'Live Monitoring']}
        title="Live Monitoring"
        subtitle="Real-time security event feed — anomaly detection from all active exam sessions"
        actions={
          <>
            <div className="flex items-center gap-8" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <Clock size={12} />
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button
              variant={autoRefresh ? 'primary' : 'ghost'}
              size="sm"
              icon={autoRefresh ? <Bell size={14} /> : <BellOff size={14} />}
              onClick={() => setAutoRefresh(a => !a)}
            >
              {autoRefresh ? 'Auto (15s)' : 'Manual'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={() => loadEvents()}
              loading={loading}
            >
              Refresh
            </Button>
          </>
        }
      />

      {/* Demo Banner */}
      {isDemo && (
        <Alert variant="warning">
          <strong>Demo Mode:</strong> No anomaly events found in the audit chain. Showing sample security events.
          Run exams through the Kiosk and trigger monitoring events for real data.
        </Alert>
      )}

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginTop: 24 }}>
        <StatCard label="Active Sessions"    value={activeSessions}    icon={<Monitor size={20} />}       color="blue"   />
        <StatCard label="Total Alerts (24h)" value={totalAlerts}       icon={<Activity size={20} />}      color="purple" />
        <StatCard label="Unacknowledged"     value={unacknowledged}    icon={<AlertTriangle size={20} />} color="red"    />
        <StatCard label="Critical + High"    value={criticalAlerts}    icon={<Zap size={20} />}           color="yellow" />
      </div>

      {/* Main Grid: Feed + Session Panel */}
      <div className="flex gap-24" style={{ marginTop: 24, alignItems: 'flex-start' }}>

        {/* ── Left: Event Feed ─────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Severity Tabs + Session Filter */}
          <div className="flex gap-3 items-center" style={{ marginBottom: 16 }}>
            <Tabs
              tabs={[
                { id: 'ALL',      label: 'All',      count: tabCounts.ALL },
                { id: 'CRITICAL', label: 'Critical', count: tabCounts.CRITICAL },
                { id: 'HIGH',     label: 'High',     count: tabCounts.HIGH },
                { id: 'MEDIUM',   label: 'Medium',   count: tabCounts.MEDIUM },
                { id: 'LOW',      label: 'Low',      count: tabCounts.LOW },
              ]}
              active={severityTab}
              onChange={setSeverityTab}
            />
            {selectedSession && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Filter size={12} />}
                onClick={() => setSelectedSession(null)}
              >
                Clear Session Filter
              </Button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="loading-state"><Spinner size="lg" /><p>Loading monitoring events…</p></div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<CheckCircle size={40} />}
              title="No events in this category"
              description="No security events match the current filter."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(evt => {
                const sevCfg = SEVERITY_CONFIG[evt.severity] ?? SEVERITY_CONFIG.MEDIUM;
                const alertCfg = ALERT_TYPE_CONFIG[evt.alert_type] ?? { label: evt.alert_type, icon: '⚠️' };
                const isCritical = evt.severity === 'CRITICAL' || evt.severity === 'HIGH';

                return (
                  <div
                    key={evt.id}
                    style={{
                      border: `1px solid ${isCritical && !evt.acknowledged ? 'rgba(239,68,68,0.35)' : 'var(--border)'}`,
                      borderLeft: `4px solid ${
                        evt.severity === 'CRITICAL' ? 'var(--danger)' :
                        evt.severity === 'HIGH'     ? '#f97316' :
                        evt.severity === 'MEDIUM'   ? 'var(--warning)' :
                                                      'var(--primary)'
                      }`,
                      borderRadius: 10,
                      padding: '14px 18px',
                      background: evt.acknowledged
                        ? 'var(--surface)'
                        : isCritical
                          ? 'rgba(239,68,68,0.04)'
                          : 'var(--surface)',
                      opacity: evt.acknowledged ? 0.7 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <div className="flex items-center gap-12" style={{ marginBottom: 8 }}>
                      {/* Alert type icon */}
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{alertCfg.icon}</span>

                      {/* Title + severity */}
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-8" style={{ marginBottom: 2 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{alertCfg.label}</span>
                          <Badge color={sevCfg.color} dot>{sevCfg.label}</Badge>
                          {evt.acknowledged && (
                            <span style={{ fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <CheckCircle size={11} /> Acknowledged
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted">
                          Session: <span className="font-mono">{evt.session_id}</span>
                          {' · '}
                          <button
                            onClick={() => setSelectedSession(evt.session_id === selectedSession ? null : evt.session_id)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, padding: 0 }}
                          >
                            {evt.candidate_id}
                          </button>
                          {' · '}{evt.center}
                        </div>
                      </div>

                      {/* Time + Action */}
                      <div className="flex items-center gap-8" style={{ flexShrink: 0 }}>
                        <span className="text-xs text-muted">{relativeTime(evt.created_at)}</span>
                        {!evt.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(evt.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    {Object.keys(evt.details).length > 0 && (
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                        {Object.entries(evt.details)
                          .filter(([k]) => k !== 'severity' && k !== 'alert_type')
                          .map(([k, v]) => (
                            <span key={k} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 4 }}>
                              <span style={{ fontWeight: 600, marginRight: 4 }}>{k.replace(/_/g, ' ')}:</span>
                              {String(v)}
                            </span>
                          ))
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right: Active Sessions Panel ─────────────────── */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <Card title="Active Sessions" subtitle={`${DEMO_SESSIONS.length} candidates in exam`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {DEMO_SESSIONS.map(sess => {
                const isSelected = selectedSession === sess.id;
                const sessAlerts = cards.filter(c => c.session_id === sess.id && !c.acknowledged).length;
                return (
                  <button
                    key={sess.id}
                    onClick={() => setSelectedSession(isSelected ? null : sess.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 8,
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isSelected ? 'var(--primary)' : 'var(--surface-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                    }}>
                      {sess.candidate.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sess.candidate}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sess.center}</div>
                    </div>
                    {sessAlerts > 0 && (
                      <span style={{
                        background: 'var(--danger)', color: '#fff',
                        borderRadius: 99, fontSize: 11, fontWeight: 700,
                        padding: '1px 7px', flexShrink: 0,
                      }}>
                        {sessAlerts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <Alert variant="info">
                <strong>GAP-4:</strong> Live session list requires <code>GET /exam/sessions</code> backend endpoint (not yet implemented).
                Showing demo sessions above.
              </Alert>
            </div>
          </Card>

          {/* Alert Summary per Severity */}
          <Card title="Alert Breakdown" style={{ marginTop: 16 }}>
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => {
              const count = cards.filter(c => c.severity === sev).length;
              const pct = totalAlerts > 0 ? (count / totalAlerts) * 100 : 0;
              const colors = { CRITICAL: 'var(--danger)', HIGH: '#f97316', MEDIUM: 'var(--warning)', LOW: 'var(--primary)' };
              return (
                <div key={sev} style={{ marginBottom: 12 }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors[sev] }}>{sev}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: colors[sev], borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Alert type breakdown */}
          <Card title="By Alert Type" style={{ marginTop: 16 }}>
            {Object.entries(ALERT_TYPE_CONFIG).map(([type, cfg]) => {
              const count = cards.filter(c => c.alert_type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center gap-8 justify-between" style={{ marginBottom: 8 }}>
                  <div className="flex items-center gap-6">
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 12 }}>{cfg.label}</span>
                  </div>
                  <Badge color={count > 2 ? 'red' : count > 0 ? 'yellow' : 'grey'}>{count}</Badge>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
