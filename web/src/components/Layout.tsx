import { UserButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/questions', label: 'Questions', icon: '📝' },
    { path: '/exams', label: 'Exams', icon: '📋' },
    { path: '/audit', label: 'Audit Trail', icon: '🔗' },
  ];

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>FortisExam</h1>
          <span className="badge">Admin</span>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <UserButton />
        </div>
      </nav>
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;
