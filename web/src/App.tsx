import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import QuestionEditor from './pages/QuestionEditor';
import Exams from './pages/Exams';
import Audit from './pages/Audit';

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <div className="auth-container">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/new" element={<QuestionEditor />} />
            <Route path="/questions/:id/edit" element={<QuestionEditor />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
