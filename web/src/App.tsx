import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages — Admin
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Exams from './pages/Exams';
import Packages from './pages/Packages';
import Distribution from './pages/Distribution';
import Centers from './pages/Centers';
import Users from './pages/Users';

// Pages — Security
import Audit from './pages/Audit';
import Monitoring from './pages/Monitoring';
import TamperDemo from './pages/TamperDemo';

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <div className="auth-container">
          <SignIn routing="hash" />
        </div>
      </SignedOut>

      <SignedIn>
        <Layout>
          <Routes>
            {/* Admin */}
            <Route path="/"            element={<Dashboard />} />
            <Route path="/questions"   element={<Questions />} />
            <Route path="/exams"       element={<Exams />} />
            <Route path="/packages"    element={<Packages />} />
            <Route path="/distribution" element={<Distribution />} />
            <Route path="/centers"     element={<Centers />} />
            <Route path="/users"       element={<Users />} />
            {/* Security */}
            <Route path="/audit"       element={<Audit />} />
            <Route path="/monitoring"  element={<Monitoring />} />
            <Route path="/tamper"      element={<TamperDemo />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
