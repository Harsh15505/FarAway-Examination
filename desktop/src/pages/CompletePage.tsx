import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { hash?: string; totalAnswers?: number } | null;

  useEffect(() => {
    // Clear session from localStorage so it can't be reused
    localStorage.removeItem('exam_session');
    
    // In a real kiosk, this page would show for a few seconds then
    // automatically redirect to AuthPage for the next candidate, 
    // or wait for invigilator reset. We'll add a manual button.
  }, []);

  return (
    <div className="page auth-page">
      <div className="card-glass" style={{ width: '560px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div className="check-circle mb-24" style={{ width: 96, height: 96, fontSize: '3rem' }}>
          ✓
        </div>
        
        <h2 className="mb-8">Exam Completed</h2>
        <p className="text-center text-muted mb-32">
          Your exam has been successfully submitted and cryptographically sealed.
          You may now leave the testing area.
        </p>

        {state && (
          <div className="w-full bg-surface-3 p-16 rounded-md border border-border mb-32" style={{ background: 'var(--surface-3)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', width: '100%' }}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm text-muted">Answers Logged:</span>
              <span className="font-bold">{state.totalAnswers}</span>
            </div>
            <div className="flex-col gap-4">
              <span className="text-xs text-muted">Submission Hash (Proof):</span>
              <span className="font-mono text-xs text-primary break-all" style={{ wordBreak: 'break-all' }}>
                {state.hash}
              </span>
            </div>
          </div>
        )}

        <button 
          className="btn btn-ghost"
          onClick={() => navigate('/', { replace: true })}
        >
          Return to Login
        </button>

      </div>
    </div>
  );
}
