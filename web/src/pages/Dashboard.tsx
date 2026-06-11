/** Dashboard page — Main Overview matching Stitch screen A1. */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface StatCard {
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  bgColor: string;
  pulse?: boolean;
}

interface ActivityEvent {
  id: string;
  type: 'SUCCESS' | 'LIVE' | 'CRYPTO' | 'WARNING' | 'INFO';
  message: string;
  actor: string;
  time: string;
  isAI?: boolean;
}

interface RiskTile {
  code: string;
  level: 'low' | 'medium' | 'high';
}

interface DistributionBar {
  name: string;
  delivered: number;
  total: number;
  color: string;
}

const typeColors: Record<string, string> = {
  SUCCESS: '#059669',
  LIVE: '#DC2626',
  CRYPTO: '#1E40AF',
  WARNING: '#D97706',
  INFO: '#1E40AF',
};

// Demo data matching the stitch wireframe
const statCards: StatCard[] = [
  { label: 'SCHEDULED', value: '14', unit: 'Exams', icon: 'event', color: '#1E40AF', bgColor: 'rgba(30,64,175,0.1)' },
  { label: 'ACTIVE', value: '312', unit: 'Centers', icon: 'location_on', color: '#059669', bgColor: 'rgba(5,150,105,0.1)' },
  { label: 'ENROLLED', value: '2,27,000', unit: 'Candidates', icon: 'group', color: '#1E40AF', bgColor: 'rgba(30,64,175,0.1)' },
  { label: 'CRITICAL', value: '3', unit: 'Alerts', icon: 'warning', color: '#DC2626', bgColor: 'rgba(220,38,38,0.1)', pulse: true },
];

const activityEvents: ActivityEvent[] = [
  { id: '1', type: 'SUCCESS', message: 'Package delivered to Center #47', actor: 'NTA System', time: '2 min ago' },
  { id: '2', type: 'LIVE', message: 'Anomaly flagged at Delhi Center 12', actor: 'Edge AI', time: '5 min ago', isAI: true },
  { id: '3', type: 'CRYPTO', message: 'Exam package NEET-2026-S1 compiled', actor: 'Admin Sharma', time: '18 min ago' },
  { id: '4', type: 'SUCCESS', message: '847 candidates authenticated', actor: 'Edge Server', time: '1hr ago' },
  { id: '5', type: 'WARNING', message: 'Center #89 risk score elevated to HIGH', actor: 'AI Model', time: '2hr ago', isAI: true },
  { id: '6', type: 'INFO', message: 'Question bank updated, 340 questions', actor: 'Expert Mehta', time: '3hr ago' },
];

const riskTiles: RiskTile[] = [
  { code: 'Delhi-01', level: 'low' }, { code: 'Delhi-12', level: 'high' }, { code: 'Mum-89', level: 'medium' },
  { code: 'Kol-22', level: 'low' }, { code: 'Che-05', level: 'low' }, { code: 'Blr-47', level: 'low' },
  { code: 'Pun-14', level: 'low' }, { code: 'Hyd-99', level: 'medium' }, { code: 'Ahm-03', level: 'low' },
  { code: 'Luc-11', level: 'low' }, { code: 'Pat-88', level: 'high' }, { code: 'Jai-02', level: 'low' },
];

const distributionBars: DistributionBar[] = [
  { name: 'NEET-UG-2026 (Phase 1)', delivered: 280, total: 300, color: '#059669' },
  { name: 'JEE-Mains-Apr-S1', delivered: 85, total: 120, color: '#1E40AF' },
  { name: 'CUET-PG-Sci', delivered: 12, total: 45, color: '#D97706' },
];

const riskColors = { low: '#059669', medium: '#D97706', high: '#DC2626' };

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API load
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-64 bg-surface-container-high rounded" />
        <div className="grid grid-cols-4 gap-gutter">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface-container-high rounded" />)}
        </div>
        <div className="h-64 bg-surface-container-high rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header & Quick Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-page-title text-page-title font-bold text-on-surface tracking-tight">Welcome, NTA Admin</h2>
          <p className="font-body text-body text-on-surface-variant mt-1">System operational. Overview of current national examination cycles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/monitoring')}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded font-label-medium text-label-medium hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>monitoring</span>
            View Live Monitor
          </button>
          <button className="bg-surface-container-lowest border border-[#D97706] text-[#D97706] px-4 py-2 rounded font-label-medium text-label-medium hover:bg-[#D97706]/10 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>
            Release Key
          </button>
          <button
            onClick={() => navigate('/exams')}
            className="bg-[#1E40AF] text-white px-4 py-2 rounded font-label-medium text-label-medium hover:bg-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>package</span>
            Compile Exam
          </button>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-4 gap-gutter">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface-container-lowest border border-outline-variant rounded p-card-padding flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">{card.label}</span>
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: card.bgColor, color: card.color }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{card.icon}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {card.pulse && (
                <span className="w-3 h-3 rounded-full live-pulse-red" style={{ backgroundColor: card.color }}></span>
              )}
              <span className="text-3xl font-bold tracking-tight" style={{ color: card.pulse ? card.color : undefined }}>{card.value}</span>
              <span className="font-body text-body text-on-surface-variant">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Activity Feed + Risk Map */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left: Recent Activity Feed (8 cols) */}
        <div className="col-span-8 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
          <div className="p-card-padding border-b border-outline-variant flex justify-between items-center bg-[#F8FAFC]">
            <h3 className="font-section-header text-section-header text-on-surface uppercase">Recent Activity Feed</h3>
            <button
              onClick={() => navigate('/audit')}
              className="text-primary font-label-medium text-label-medium hover:underline"
            >
              View Full Log
            </button>
          </div>
          <div className="p-0">
            <ul className="flex flex-col divide-y divide-outline-variant">
              {activityEvents.map((event) => (
                <li key={event.id} className="px-card-padding py-3 flex items-start gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: typeColors[event.type] }}></div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-baseline">
                      <span className="font-label-medium text-label-medium text-on-surface">
                        <span className="mr-1" style={{ color: typeColors[event.type] }}>[{event.type}]</span>
                        {event.message}
                      </span>
                      <span className="font-micro text-micro text-on-surface-variant whitespace-nowrap">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {event.isAI && (
                        <span className="px-1.5 py-0.5 rounded bg-[#7C3AED] text-white font-micro text-[10px] uppercase tracking-wider leading-none">AI</span>
                      )}
                      <span className="font-body text-body text-on-surface-variant">{event.actor}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: AI Center Risk Map (4 cols) */}
        <div className="col-span-4 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
          <div className="p-card-padding border-b border-outline-variant bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <h3 className="font-section-header text-section-header text-on-surface uppercase">Center Risk Map</h3>
              <span className="px-1.5 py-0.5 rounded bg-[#7C3AED] text-white font-micro text-[10px] uppercase tracking-wider leading-none">AI</span>
            </div>
            <p className="font-micro text-micro text-on-surface-variant mt-1">Powered by FortisExam Risk Model</p>
          </div>
          <div className="p-card-padding grid grid-cols-3 gap-2">
            {riskTiles.map((tile) => (
              <div
                key={tile.code}
                className={`border border-outline-variant rounded p-2 text-center hover:border-primary cursor-pointer transition-colors ${
                  tile.level !== 'low' ? `bg-[${riskColors[tile.level]}]/5` : ''
                }`}
                style={tile.level !== 'low' ? { backgroundColor: `${riskColors[tile.level]}0D` } : {}}
              >
                <div
                  className="font-label-medium text-[10px] truncate"
                  style={{ color: tile.level !== 'low' ? riskColors[tile.level] : undefined, fontWeight: tile.level !== 'low' ? 700 : undefined }}
                >
                  {tile.code}
                </div>
                <div className="mt-1 w-full h-1 rounded-full" style={{ backgroundColor: riskColors[tile.level] }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Package Distribution Status */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col w-full">
        <div className="p-card-padding border-b border-outline-variant bg-[#F8FAFC]">
          <h3 className="font-section-header text-section-header text-on-surface uppercase">Package Distribution Status</h3>
        </div>
        <div className="p-card-padding flex flex-col gap-6">
          {distributionBars.map((bar) => {
            const pct = Math.round((bar.delivered / bar.total) * 100);
            return (
              <div key={bar.name} className="w-full">
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-medium text-label-medium text-on-surface font-bold">{bar.name}</span>
                    <span className="font-micro text-micro text-on-surface-variant">{bar.delivered} / {bar.total} Centers</span>
                  </div>
                  <span className="font-label-medium text-label-medium font-bold" style={{ color: bar.color }}>{pct}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: bar.color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
