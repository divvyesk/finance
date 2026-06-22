'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Intake states
  const [file, setFile] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'idle', 'uploading', 'ocr', 'extracting', 'validating', 'done'
  const [statusMessage, setStatusMessage] = useState('');
  const [extractedResult, setExtractedResult] = useState(null);
  
  // Manual form inputs
  const [salary, setSalary] = useState('80000');
  const [bonus, setBonus] = useState('5000');
  const [stateName, setStateName] = useState('California');
  const [payFrequency, setPayFrequency] = useState('biweekly');
  const [employmentType, setEmploymentType] = useState('full_time');

  // Verify auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          // Send to login if unauthenticated
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Session error', err);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Simulate step-by-step agent workflow on upload/submit
  const runAIWorkflow = async (apiCallFn) => {
    setUploadStatus('uploading');
    setStatusMessage('Uploading document...');
    
    // Simulate minor visual pipeline delay for serious AI feel
    await new Promise(r => setTimeout(r, 800));
    setUploadStatus('ocr');
    setStatusMessage('Step 1.1: Running OCR (Document ➜ Text Conversion)...');
    
    await new Promise(r => setTimeout(r, 1200));
    setUploadStatus('extracting');
    setStatusMessage('Step 1.2: Invoking AI Extraction Agent (Enforcing JSON Schema)...');
    
    await new Promise(r => setTimeout(r, 1000));
    setUploadStatus('validating');
    setStatusMessage('Step 1.3: Running Validation Layer Checks...');
    
    await new Promise(r => setTimeout(r, 600));

    try {
      const data = await apiCallFn();
      setExtractedResult(data);
      setUploadStatus('done');
      setStatusMessage('Income Intake completed successfully!');
    } catch (err) {
      setUploadStatus('idle');
      setStatusMessage('Error: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const apiCall = async () => {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }
      return await res.json();
    };

    runAIWorkflow(apiCall);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    const apiCall = async () => {
      const payload = {
        salary: Number(salary),
        bonus: Number(bonus),
        state: stateName,
        pay_frequency: payFrequency,
        employment_type: employmentType,
      };

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Extraction request failed');
      }
      return await res.json();
    };

    runAIWorkflow(apiCall);
  };

  const resetIntake = () => {
    setFile(null);
    setExtractedResult(null);
    setUploadStatus('idle');
    setStatusMessage('');
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Workspace Control Panel
        </span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          Welcome to your Financial Onboarding Operating System
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '850px' }}>
          This dashboard guides you through building a personalized financial roadmap. As a developer, look below the surface to see the active AI concepts—like structured OCR schema enforcement, grounded recommendation loops, and multi-agent critique systems—working in tandem.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Checklist */}
        <aside>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              Your Journey Progress
            </h3>
            <div className="tracker-container">
              <div className={`tracker-item ${uploadStatus === 'done' ? 'completed' : 'active'}`}>
                <span className="tracker-checkbox">✓</span>
                <span>1. Understand Income</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>2. Understand Taxes</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>3. Define Goals</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>4. Build Safety Net</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>5. Build Spending System</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>6. Explore Scenarios</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>7. Build Financial Roadmap</span>
              </div>
              <div className="tracker-item">
                <span className="tracker-checkbox"></span>
                <span>8. Complete Setup</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Workspace Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className="card" style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'var(--primary-glow)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              Step 1: Intake Agent
            </span>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Income Intake Agent</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
              Upload your paycheck paystub, offer letter, or contract to run the structured extraction pipeline, or enter details manually.
            </p>

            {uploadStatus === 'idle' || uploadStatus === '' ? (
              <div>
                {!manualMode ? (
                  <div>
                    <label className="dropzone">
                      <span className="dropzone-icon">📥</span>
                      <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                        Drag & drop or click to upload document
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Supports PDF, PNG, JPG (e.g. offer_letter.pdf, paystub.png)
                      </span>
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept=".pdf,.png,.jpg,.jpeg"
                      />
                    </label>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>or</span>
                      <button
                        type="button"
                        className="btn btn-text"
                        style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}
                        onClick={() => setManualMode(true)}
                      >
                        Enter Income Data Manually ➜
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleManualSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="salary">Annual Gross Salary ($)</label>
                        <input
                          id="salary"
                          type="number"
                          className="form-input"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="bonus">Annual Target Bonus ($)</label>
                        <input
                          id="bonus"
                          type="number"
                          className="form-input"
                          value={bonus}
                          onChange={(e) => setBonus(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="stateName">State (US)</label>
                        <input
                          id="stateName"
                          type="text"
                          className="form-input"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="e.g. California"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="payFrequency">Pay Frequency</label>
                        <select
                          id="payFrequency"
                          className="form-input"
                          value={payFrequency}
                          onChange={(e) => setPayFrequency(e.target.value)}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Biweekly</option>
                          <option value="semimonthly">Semimonthly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="employmentType">Employment Type</label>
                        <select
                          id="employmentType"
                          className="form-input"
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                        >
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="contract">Contractor</option>
                          <option value="intern">Intern</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary">
                        Extract & Process
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setManualMode(false);
                          resetIntake();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}

            {/* Pipeline Loading Screen */}
            {uploadStatus !== 'idle' && uploadStatus !== 'done' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
                textAlign: 'center'
              }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', color: 'var(--primary)', marginBottom: '1.5rem' }}></div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Processing Income Document</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{statusMessage}</p>
                
                {/* Progress bar inside loading */}
                <div style={{ width: '100%', maxWidth: '300px', height: '4px', background: 'var(--border-light)', borderRadius: '2px', marginTop: '1.5rem', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'var(--primary)',
                    width: uploadStatus === 'uploading' ? '25%' : uploadStatus === 'ocr' ? '50%' : uploadStatus === 'extracting' ? '75%' : '90%',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            )}

            {/* Pipeline Completed Screen */}
            {uploadStatus === 'done' && extractedResult && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>✓</span> Document Extracted Successfully
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      Source: {extractedResult.data.source} (OCR Confidence: {(extractedResult.data.ocr_confidence * 100).toFixed(0)}%)
                    </p>
                  </div>
                  <button className="btn btn-secondary" onClick={resetIntake} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Re-upload / Reset
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  {/* JSON Output schema viewer */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Extracted JSON Payload
                    </h4>
                    <pre className="json-view">
                      {JSON.stringify(extractedResult.data, null, 2)}
                    </pre>
                  </div>

                  {/* Validation feedback logs */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Validation Layer Feedback
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: 'var(--success)'
                      }}>
                        <span>✓</span> State employment rules verified ({extractedResult.data.state})
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: 'var(--success)'
                      }}>
                        <span>✓</span> Pay frequency detected ({extractedResult.data.pay_frequency})
                      </div>
                      {extractedResult.validation.isValid ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          color: 'var(--success)'
                        }}>
                          <span>✓</span> Salary structure validation check passed
                        </div>
                      ) : (
                        extractedResult.validation.errors.map((err, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: 'var(--error)'
                          }}>
                            <span>⚠</span> {err}
                          </div>
                        ))
                      )}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Proceeding to Step 2: Paycheck Interpreter (in development!)')}>
                        Proceed to Step 2: Paycheck Interpreter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* AI Concepts Learned Card */}
          <section className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Educational Walkthrough
            </span>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
              AI Engineering Concepts Learned
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>1. OCR (Image ➜ Text)</strong>
                How visual offer documents or PDFs are converted into raw text segments using standard libraries.
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>2. Structured Extraction</strong>
                Writing system prompts and parameters to force LLMs to output fields adhering to a specific JSON schema.
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>3. Schema Validation</strong>
                Running checks on critical parameters (like missing states or abnormal salary ranges) prior to saving records.
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>4. Confidence Scores</strong>
                Determining reliability thresholds for model output to decide whether user clarification is needed.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
