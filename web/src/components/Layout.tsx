/** Shared Layout shell — Sidebar + TopBar, matching Stitch design exactly. */
import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/questions', icon: 'database', label: 'Question Bank' },
  { to: '/exams', icon: 'edit_note', label: 'Exam Builder' },
  { to: '/centers', icon: 'location_city', label: 'Center Management' },
  { to: '/monitoring', icon: 'visibility', label: 'Live Monitoring' },
  { to: '/audit', icon: 'history_edu', label: 'Audit Explorer' },
  { to: '/leak-monitor', icon: 'security', label: 'Leak Monitor' },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-[#1E293B] border-r border-outline-variant flex flex-col z-50">
        {/* Header */}
        <div className="px-container-padding py-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>account_balance</span>
          </div>
          <div>
            <h1 className="font-page-title text-page-title text-white font-bold leading-tight">FortisExam</h1>
            <p className="font-micro text-micro text-white/70">Admin Terminal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={`flex items-center px-4 py-3 transition-all duration-200 border-l-4 ${
                      isActive
                        ? 'text-[#60A5FA] opacity-100 border-[#60A5FA] bg-secondary-container/10'
                        : 'text-white opacity-70 border-transparent hover:opacity-100 hover:bg-secondary-container/5'
                    }`}
                  >
                    <span className="material-symbols-outlined mr-3">{item.icon}</span>
                    <span className="font-label-medium text-label-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10 text-white/50 font-micro text-micro">
          System v4.12.0 (Secure)
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {/* TopBar */}
        <header className="fixed top-0 right-0 h-topbar-height w-[calc(100%-240px)] bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-container-padding z-40">
          {/* Left: Search */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 18 }}>search</span>
              <input
                className="pl-9 pr-3 py-1.5 bg-surface-container-low border border-outline-variant rounded font-body text-body text-on-surface focus:outline-none focus:border-[#1E40AF] w-64 placeholder:text-outline"
                placeholder="Search entity ID..."
                type="text"
              />
            </div>
          </div>

          {/* Middle: Nav tabs */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-label-medium text-label-medium pb-1 transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant font-medium hover:text-primary border-b-2 border-transparent'
                }`
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) =>
                `font-label-medium text-label-medium pb-1 transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant font-medium hover:text-primary border-b-2 border-transparent'
                }`
              }
            >
              Questions
            </NavLink>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/monitoring"
              className="bg-[#1E40AF] text-white px-4 py-1.5 rounded font-label-medium text-label-medium hover:bg-primary transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
              Live Monitoring
            </NavLink>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors relative">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full"></span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
              </button>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mt-[64px] p-container-padding">
          {children}
        </main>
      </div>
    </div>
  );
}
