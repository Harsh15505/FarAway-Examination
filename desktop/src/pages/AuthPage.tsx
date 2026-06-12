import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate, checkEdgeHealth } from '../services/edgeApi';

type AuthStep = 'CONNECTING' | 'SCAN_QR' | 'FACE_VERIFY' | 'AUTHENTICATING' | 'ERROR' | 'SUCCESS';

export default function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('CONNECTING');
  const [errorMsg, setErrorMsg] = useState('');
  const [qrData, setQrData] = useState('');
  const [similarity, setSimilarity] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  // 1. Initial health check
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const isHealthy = await checkEdgeHealth();
      if (mounted) {
        if (isHealthy) {
          setStep('SCAN_QR');
        } else {
          setErrorMsg('Cannot connect to Edge Server. Please alert an invigilator.');
          setStep('ERROR');
        }
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // 2. Focus QR input when in SCAN_QR step
  useEffect(() => {
    if (step === 'SCAN_QR' && qrInputRef.current) {
      qrInputRef.current.focus();
    }
  }, [step]);

  // 3. Start Webcam when in FACE_VERIFY step
  useEffect(() => {
    if (step === 'FACE_VERIFY' && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error('Webcam error:', err);
          setErrorMsg('Webcam access denied. Please alert an invigilator.');
          setStep('ERROR');
        });
    }

    // Cleanup webcam
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [step]);

  // Handlers
  const handleQRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrData.trim()) return;
    setStep('FACE_VERIFY');
  };

  const handleCaptureFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    // Stop webcam
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());

    setStep('AUTHENTICATING');
    
    try {
      // For hackathon: we send the QR data (which is just a string or JSON)
      // and the face image.
      const response = await authenticate(qrData, base64Image);
      
      setSimilarity(response.face_score ?? 0);
      setStep('SUCCESS');
      
      // Save session info to localStorage
      localStorage.setItem('exam_session', JSON.stringify(response));
      
      // Wait a moment then go to exam
      setTimeout(() => {
        navigate('/exam');
      }, 3000);
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Invalid QR or face mismatch.');
      setStep('ERROR');
    }
  };

  const resetFlow = () => {
    setQrData('');
    setErrorMsg('');
    setStep('SCAN_QR');
  };

  return (
    <div className="page auth-page">
      <div className="logo">
        <div className="logo-icon">🛡️</div>
        <div>
          <div className="logo-title text-center">FortisExam Kiosk</div>
          <div className="logo-sub text-center mt-8">Secure Environment</div>
        </div>
      </div>

      <div className="card-glass" style={{ width: '480px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 'CONNECTING' && (
          <div className="flex-col items-center gap-16">
            <div className="spinner"></div>
            <p>Connecting to Edge Server...</p>
          </div>
        )}

        {step === 'SCAN_QR' && (
          <div className="flex-col items-center gap-24 w-full">
            <div className="step-badge step-badge-auth">Step 1 of 2</div>
            <h3>Scan your QR Code</h3>
            <p className="text-center text-sm">Hold your exam entry pass up to the scanner. The system will automatically detect it.</p>
            
            <div className="qr-frame">
              <div className="qr-scan-line"></div>
              <span className="text-muted font-mono text-sm">WAITING FOR SCAN</span>
            </div>

            {/* Hidden input to catch barcode scanner keystrokes */}
            <form onSubmit={handleQRSubmit} style={{ opacity: 0.1, position: 'absolute', bottom: 10 }}>
              <input 
                ref={qrInputRef}
                type="password" 
                value={qrData}
                onChange={e => setQrData(e.target.value)}
                autoFocus
                onBlur={() => qrInputRef.current?.focus()} // Keep focus
              />
            </form>
            
            {/* For testing without a scanner */}
            <button className="btn btn-ghost btn-sm" onClick={() => {
               // Demo QR payload for testing
               setQrData(JSON.stringify({
                 candidateId: 'test-cand-1',
                 examId: 'test-exam-1',
                 centerId: 'center-1',
                 nonce: 'nonce-123',
                 signature: 'dummy-sig'
               }));
               setStep('FACE_VERIFY');
            }}>
              [Simulate Scan]
            </button>
          </div>
        )}

        {step === 'FACE_VERIFY' && (
          <div className="flex-col items-center gap-16 w-full">
            <div className="step-badge step-badge-auth">Step 2 of 2</div>
            <h3>Face Verification</h3>
            <p className="text-center text-sm">Look directly at the camera. Ensure your face is clearly visible inside the guide.</p>
            
            <div className="webcam-frame">
              <video ref={videoRef} muted autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              <div className="webcam-overlay">
                <div className="face-guide"></div>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <button className="btn btn-primary btn-full mt-16" onClick={handleCaptureFace}>
              Capture & Authenticate
            </button>
            <button className="btn btn-ghost btn-sm mt-8" onClick={resetFlow}>
              Go Back
            </button>
          </div>
        )}

        {step === 'AUTHENTICATING' && (
          <div className="flex-col items-center gap-16">
            <div className="spinner"></div>
            <h3>Verifying Identity</h3>
            <p className="text-center text-sm">Checking RSA signatures and computing facial embeddings...</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="flex-col items-center gap-16 w-full">
            <div className="check-circle">✓</div>
            <h3>Authentication Successful</h3>
            <div className="alert alert-success w-full text-center flex-col items-center gap-8">
              <div>Identity Confirmed</div>
              {similarity > 0 && <div className="text-xs font-mono">Similarity Score: {(similarity * 100).toFixed(1)}%</div>}
            </div>
            <p className="text-sm text-center mt-8">Preparing your secure exam environment...</p>
            <div className="progress-bar w-full mt-16">
              <div className="progress-fill" style={{ width: '100%', transitionDuration: '3s' }}></div>
            </div>
          </div>
        )}

        {step === 'ERROR' && (
          <div className="flex-col items-center gap-24 w-full">
            <div className="check-circle" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)', color: 'var(--danger)' }}>✗</div>
            <h3>Authentication Failed</h3>
            <div className="alert alert-danger w-full text-center">
              {errorMsg}
            </div>
            <button className="btn btn-ghost btn-full mt-8" onClick={resetFlow}>
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
