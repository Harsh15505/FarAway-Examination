import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ExamPage from './pages/ExamPage';
import SummaryPage from './pages/SummaryPage';
import CompletePage from './pages/CompletePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/complete" element={<CompletePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
