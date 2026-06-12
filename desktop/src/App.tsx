import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ExamPage from './pages/ExamPage';
import SummaryPage from './pages/SummaryPage';
import CompletePage from './pages/CompletePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = localStorage.getItem('exam_session');
  if (!session) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route path="/exam" element={
          <ProtectedRoute>
            <ExamPage />
          </ProtectedRoute>
        } />
        
        <Route path="/summary" element={
          <ProtectedRoute>
            <SummaryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/complete" element={<CompletePage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
