import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Package,
  Truck,
  Building2,
  Users,
  ShieldCheck,
  Activity,
  Bell,
  Search,
  Radio,
  ChevronRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const adminNav = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/questions', label: 'Question Bank', icon: BookOpen },
  { path: '/exams', label: 'Exam Builder', icon: ClipboardList },
  { path: '/packages', label: 'Packages', icon: Package },
  { path: '/distribution', label: 'Distribution', icon: Truck },
  { path: '/centers', label: 'Center Management', icon: Building2 },
  { path: '/users', label: 'User Management', icon: Users },
];

const securityNav = [
  { path: '/audit', label: 'Audit Explorer', icon: ShieldCheck },
  { path: '/monitoring', label: 'Live Monitoring', icon: Activity },
  { path: '/tamper', label: 'Leak Monitor', icon: AlertTriangle },
  { path: '/demo', label: 'Hackathon Demo', icon: Sparkles },
];

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">FE</div>
          <div className="sidebar-logo-text">
            <h1>FortisExam</h1>
            <span>Admin Terminal</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {adminNav.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${isActive(path) ? 'active' : ''}`}
            >
              <Icon className="nav-item-icon" size={16} />
              {label}
            </Link>
          ))}

          <div className="sidebar-section-label">Security</div>
          {securityNav.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${isActive(path) ? 'active' : ''}`}
            >
              <Icon className="nav-item-icon" size={16} />
              {label}
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          <UserButton afterSignOutUrl="/" />
          <span className="sidebar-version">v4.12.0</span>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-breadcrumb">
              <span>FortisExam</span>
              <ChevronRight size={14} />
              <span className="current">
                {[...adminNav, ...securityNav].find(n => isActive(n.path))?.label ?? 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              <Search className="topbar-search-icon" size={14} />
              <input type="text" placeholder="Search entity ID..." />
            </div>

            {/* Live Monitoring button */}
            <Link to="/monitoring">
              <button
                className="btn btn-sm"
                style={{ background: '#22c55e', color: '#fff', gap: 6 }}
              >
                <Radio size={13} />
                Live Monitoring
              </button>
            </Link>

            <button className="icon-btn" title="Notifications">
              <Bell size={16} />
              <span className="badge-dot" />
            </button>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1a237e',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user?.firstName?.[0] ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
