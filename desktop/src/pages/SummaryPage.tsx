import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession, submitExam, ExamSession, AuthResponse } from '../services/edgeApi';

export default function SummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoSubmit = location.state?.autoSubmit || false;

  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load session to get latest answer counts
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const stored = localStorage.getItem('exam_session');
        if (!stored) throw new Error('No active session found.');
        
        const auth: AuthResponse = JSON.parse(stored);
        setAuthData(auth);
        
        const examData = await getSession(auth.session_id, auth.token);
        if (!mounted) return;
        
        setSession(examData);
        setLoading(false);
        
        if (autoSubmit) {
          handleFinalSubmit(examData, auth);
        }
        
      } catch (err: any) {
        if (mounted) {
          setErrorMsg(err.message || 'Failed to load exam summary');
          setLoading(false);
        }
      }
    };
    init();
    return () => { mounted = false; };
  }, [autoSubmit]);

  const handleFinalSubmit = async (sess = session, auth = authData) => {
    if (!sess || !auth) return;
    setSubmitting(true);
    try {
      const response = await submitExam(sess.session_id, auth.token);
      
      // Navigate to complete with submission hash
      navigate('/complete', { 
        state: { 
          hash: response.submission_hash,
          totalAnswers: response.total_answers 
        },
        replace: true 
      });
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit exam. Please call an invigilator.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!session || !authData) return null;

  const answeredCount = session.questions.filter(q => !!q.selected_option).length;
  const unansweredCount = session.total_questions - answeredCount;

  return (
    <div className="page auth-page">
      <div className="logo">
        <div className="logo-icon">📋</div>
        <div>
          <div className="logo-title text-center">Exam Summary</div>
          <div className="logo-sub text-center mt-8">Review Before Submission</div>
        </div>
      </div>

      <div className="card-glass" style={{ width: '560px', padding: '40px' }}>
        
        {autoSubmit && (
          <div className="alert alert-warning mb-24 w-full">
            <strong>Time is up!</strong> Your exam is being automatically submitted.
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger mb-24 w-full text-center">
            {errorMsg}
          </div>
        )}

        {submitting ? (
          <div className="flex-col items-center gap-16 py-24">
            <div className="spinner" style={{ width: 48, height: 48 }}></div>
            <h3>Submitting securely...</h3>
            <p className="text-sm text-center">Generating cryptographic proof of your answers.</p>
          </div>
        ) : (
          <>
            <div className="flex-col gap-16 w-full">
              
              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <span className="text-muted">Candidate Name</span>
                <span className="font-bold">{session.candidate_name}</span>
              </div>
              
              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <span className="text-muted">Exam</span>
                <span className="font-bold">{session.exam_title}</span>
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <span className="text-muted">Total Questions</span>
                <span className="font-bold">{session.total_questions}</span>
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <span className="text-muted">Answered</span>
                <span className="font-bold text-success">{answeredCount}</span>
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <span className="text-muted">Unanswered</span>
                <span className="font-bold text-warning">{unansweredCount}</span>
              </div>
              
            </div>

            <div className="flex gap-16 mt-32 w-full">
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1 }} 
                onClick={() => navigate('/exam')}
                disabled={submitting}
              >
                Return to Exam
              </button>
              
              <button 
                className="btn btn-success" 
                style={{ flex: 1 }} 
                onClick={() => handleFinalSubmit()}
                disabled={submitting}
              >
                Confirm Submission
              </button>
            </div>
            
            {unansweredCount > 0 && (
              <p className="text-center text-xs text-warning mt-16">
                Warning: You have {unansweredCount} unanswered questions.
              </p>
            )}
          </>
        )}

      </div>
    </div>
  );
}
