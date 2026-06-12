import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getSession, 
  submitAnswer, 
  reportMonitoringEvent,
  ExamSession, 
  AuthResponse 
} from '../services/edgeApi';

export default function ExamPage() {
  const navigate = useNavigate();
  
  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, 'A'|'B'|'C'|'D'>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Load session on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const stored = localStorage.getItem('exam_session');
        if (!stored) throw new Error('No active session found. Please authenticate.');
        
        const auth: AuthResponse = JSON.parse(stored);
        setAuthData(auth);
        
        const examData = await getSession(auth.session_id, auth.token);
        if (!mounted) return;
        
        setSession(examData);
        setCurrentIndex(examData.current_question_index || 0);
        setRemainingSeconds(examData.remaining_seconds);
        
        // Populate local answers if recovering
        const answers: Record<string, 'A'|'B'|'C'|'D'> = {};
        examData.questions.forEach(q => {
          if (q.selected_option) answers[q.id] = q.selected_option;
        });
        setLocalAnswers(answers);
        setLoading(false);
        
      } catch (err: any) {
        if (mounted) {
          setErrorMsg(err.message || 'Failed to load exam session');
          setLoading(false);
        }
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // 2. Timer countdown
  useEffect(() => {
    if (loading || !!errorMsg || remainingSeconds <= 0) return;
    
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, errorMsg, remainingSeconds]);

  // 3. Security Monitoring (Focus loss)
  useEffect(() => {
    const onBlur = () => {
      if (authData && session) {
        reportMonitoringEvent({
          event_type: 'FOCUS_LOST',
          severity: 'WARNING',
          details: { timestamp: new Date().toISOString() }
        }, authData.token, session.session_id, session.candidate_id);
      }
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [authData]);

  // Handlers
  const handleTimeUp = () => {
    // Save state and jump to summary/complete
    navigate('/summary', { state: { autoSubmit: true } });
  };

  const handleSelectOption = async (option: 'A'|'B'|'C'|'D') => {
    if (!session || !authData) return;
    const currentQ = session.questions[currentIndex];
    
    // Optimistic UI update
    setLocalAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    
    // Background API call
    try {
      await submitAnswer(
        session.session_id, 
        currentQ.id, 
        option, 
        currentIndex, 
        remainingSeconds, 
        authData.token
      );
    } catch (err) {
      console.error('Failed to save answer:', err);
      // In a real app, queue offline sync here
    }
  };

  const toggleFlag = () => {
    if (!session) return;
    const currentQ = session.questions[currentIndex];
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const jumpTo = (index: number) => {
    if (!session) return;
    if (index >= 0 && index < session.questions.length) {
      setCurrentIndex(index);
    }
  };

  const finishExam = () => {
    navigate('/summary');
  };

  // Render Helpers
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (errorMsg) return (
    <div className="page">
      <div className="card">
        <h3>Error</h3>
        <p className="text-danger">{errorMsg}</p>
        <button className="btn btn-primary mt-16" onClick={() => navigate('/')}>Return to Login</button>
      </div>
    </div>
  );
  if (!session || !authData) return null;

  const currentQ = session.questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / session.total_questions) * 100;
  const timerCircleOffset = 62.83 - ((remainingSeconds / session.duration_seconds) * 62.83);

  return (
    <div className="page" style={{ justifyContent: 'flex-start' }}>
      
      {/* Header */}
      <div className="exam-header">
        <div className="logo-icon" style={{ width: 36, height: 36, fontSize: 16 }}>🛡️</div>
        <div>
          <div className="font-bold">{session.exam_title}</div>
          <div className="text-xs text-muted">Candidate: {session.candidate_name} ({session.candidate_id})</div>
        </div>
        
        <div style={{ flex: 1 }} />
        
        <button className="btn btn-ghost btn-sm" onClick={() => window.open('#', '_blank')}>
          Calculator
        </button>
        
        <div className="timer-ring">
          <svg width="60" height="60" viewBox="0 0 26 26" style={{ width: '100%', height: '100%' }}>
            <circle className="ring-bg" cx="13" cy="13" r="10" strokeWidth="2" />
            <circle 
              className="ring-fill" 
              cx="13" cy="13" r="10" 
              strokeWidth="2" 
              stroke={remainingSeconds < 300 ? 'var(--warning)' : 'var(--primary)'}
              strokeDasharray="62.83 62.83"
              strokeDashoffset={timerCircleOffset} 
            />
          </svg>
          <div className="timer-value">
            <span style={{ color: remainingSeconds < 300 ? 'var(--warning)' : 'inherit' }}>
              {formatTime(remainingSeconds)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Top Progress Bar */}
      <div className="progress-bar w-full" style={{ height: 3, borderRadius: 0 }}>
        <div className="progress-fill" style={{ width: `${progressPercent}%`, borderRadius: 0 }} />
      </div>

      <div className="flex w-full" style={{ height: 'calc(100vh - 67px)' }}>
        
        {/* Left pane: Navigator */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'var(--surface)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3>Question Palette</h3>
          <p className="text-xs text-muted mt-8 mb-16">Jump to any question. Colored pills indicate your progress.</p>
          
          <div className="nav-scroll">
            {session.questions.map((q, i) => {
              const isAnswered = !!localAnswers[q.id];
              const isCurrent = i === currentIndex;
              const isFlagged = flagged.has(q.id);
              
              let cls = 'nav-pill';
              if (isCurrent) cls += ' current';
              else if (isFlagged) cls += ' flagged';
              else if (isAnswered) cls += ' answered';
              
              return (
                <button key={q.id} className={cls} onClick={() => jumpTo(i)}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="flex-col gap-8 mt-24 text-xs">
            <div className="flex items-center gap-8"><div className="nav-pill current" style={{width:20,height:20}}></div> Current</div>
            <div className="flex items-center gap-8"><div className="nav-pill answered" style={{width:20,height:20}}></div> Answered</div>
            <div className="flex items-center gap-8"><div className="nav-pill flagged" style={{width:20,height:20}}></div> Flagged for Review</div>
            <div className="flex items-center gap-8"><div className="nav-pill" style={{width:20,height:20}}></div> Unanswered</div>
          </div>
          
          <div style={{ flex: 1 }} />
          
          <button className="btn btn-primary btn-full mt-24" onClick={finishExam}>
            Review & Submit Exam
          </button>
        </div>

        {/* Right pane: Question Content */}
        <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
          
          <div className="flex justify-between items-center mb-24">
            <div className="step-badge step-badge-exam" style={{ margin: 0 }}>
              Question {currentIndex + 1} of {session.total_questions}
            </div>
            <div className="flex gap-12">
              <span className="text-xs text-muted" style={{ background: 'var(--surface-3)', padding: '4px 10px', borderRadius: 4 }}>
                {currentQ.subject.toUpperCase()}
              </span>
              <span className="text-xs text-muted" style={{ background: 'var(--surface-3)', padding: '4px 10px', borderRadius: 4 }}>
                {currentQ.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          <h2 className="mb-24" style={{ lineHeight: 1.4, fontWeight: 500 }}>
            {currentQ.content}
          </h2>

          <div className="flex-col gap-16 mt-24">
            {(['A', 'B', 'C', 'D'] as const).map(opt => {
              const isSelected = localAnswers[currentQ.id] === opt;
              return (
                <button 
                  key={opt}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(opt)}
                >
                  <div className="option-letter">{opt}</div>
                  <div className="option-text">{currentQ.options[opt]}</div>
                </button>
              );
            })}
          </div>

        </div>
        
      </div>
      
      {/* Bottom Floating Action Bar */}
      <div style={{ 
        position: 'absolute', bottom: 32, right: 60, left: 380, 
        display: 'flex', justifyContent: 'space-between',
        pointerEvents: 'none' // Allow clicking through the empty space
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          <button className="btn btn-ghost" onClick={toggleFlag}>
            {flagged.has(currentQ.id) ? '🚩 Unflag Question' : '🏁 Flag for Review'}
          </button>
        </div>
        
        <div className="flex gap-16" style={{ pointerEvents: 'auto' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => jumpTo(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          
          {currentIndex < session.total_questions - 1 ? (
            <button className="btn btn-primary" onClick={() => jumpTo(currentIndex + 1)}>
              Next Question →
            </button>
          ) : (
            <button className="btn btn-success" onClick={finishExam}>
              Review Submission
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
