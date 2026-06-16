// frontend/src/pages/student/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/student/login', form);
      login(res.data.student, 'student', res.data.token);
      toast.success(`Welcome back, ${res.data.student.name}!`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Global overrides to lock viewport scrolling and enforce premium high-contrast canvas base */}
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          overflow: hidden !important;
          background: #090d16 !important;
        }
      `}</style>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>🎓</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.sub}>Sign in to your placement account</p>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label className="form-label" style={styles.labelAdjust}>Email Address</label>
              <input
                type="email" name="email" className="form-control form-control-sm"
                placeholder="name@college.edu"
                value={form.email} onChange={handleChange} required
                autoComplete="email"
                style={styles.inputMini}
              />
            </div>
            
            <div style={styles.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <label className="form-label" style={{ margin: 0, fontSize: '0.8rem' }}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={styles.toggleBtn}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPass ? 'text' : 'password'} name="password" className="form-control form-control-sm"
                placeholder="Enter your password"
                value={form.password} onChange={handleChange} required
                autoComplete="current-password"
                style={styles.inputMini}
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ marginRight: 8 }} />Signing in…</>
                : 'Sign In →'
              }
            </button>
          </form>

          {/* Premium Formatted Left-Aligned Demo Box */}
          <div style={styles.demoContainer}>
            <div style={styles.demoHeader}>
              <span style={{ fontSize: '0.9rem' }}>🔑</span>
              <span style={styles.demoTitle}>Quick Access Demo Credentials</span>
            </div>
            <div style={styles.demoGrid}>
              <div style={styles.demoRow}>
                <span style={styles.demoLabel}>Email:</span>
                <code style={styles.demoCode}>arjun@college.edu</code>
              </div>
              <div style={styles.demoRow}>
                <span style={styles.demoLabel}>Pass:</span>
                <code style={styles.demoCode}>password123</code>
              </div>
            </div>
          </div>

          <p style={styles.footerText}>
            No account?{' '}
            <Link to="/student/register" style={styles.link}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: 'calc(100vh - 70px)', 
    width: '100vw',
    background: 'linear-gradient(135deg, #090d16 0%, #111b33 50%, #070a12 100%)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '12px',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 25px 50px -12 rgba(0, 0, 0, 0.5), 0 8px 20px -6px rgba(0, 0, 0, 0.3)',
    width: '100%', 
    maxWidth: 390,
    overflow: 'hidden',
    marginTop: '-20px', 
  },
  header: {
    background: 'linear-gradient(145deg, #111827 0%, #1e2d5a 55%, #263a6e 100%)',
    padding: '16px 20px 14px',
    textAlign: 'center',
    position: 'relative',
  },
  iconWrap: {
    width: 38, 
    height: 38,
    background: 'rgba(255,255,255,0.10)',
    border: '1.5px solid rgba(255,255,255,0.18)',
    borderRadius: 10,
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: '1.2rem',
    margin: '0 auto 8px',
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '1.15rem', 
    fontWeight: 800,
    color: '#fff', 
    marginBottom: 2, 
    letterSpacing: '-0.3px',
  },
  sub: { 
    color: 'rgba(255,255,255,0.60)', 
    fontSize: '0.75rem', 
    margin: 0 
  },
  body: { 
    padding: '18px 24px 20px' 
  },
  fieldGroup: { 
    marginBottom: 10 
  },
  labelAdjust: {
    marginBottom: 2,
    fontSize: '0.8rem'
  },
  inputMini: {
    paddingTop: '5px',
    paddingBottom: '5px',
    fontSize: '0.85rem',
    height: 'auto'
  },
  toggleBtn: {
    background: 'none', 
    border: 'none', 
    cursor: 'pointer',
    fontSize: '0.72rem', 
    fontWeight: 600, 
    color: '#4f62d4', 
    padding: 0,
  },
  submitBtn: {
    width: '100%', 
    padding: '8px',
    background: '#4f62d4', 
    color: '#fff',
    border: 'none', 
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif", 
    fontSize: '0.85rem', 
    fontWeight: 600,
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79,98,212,0.35)',
    marginTop: 12,
  },
  demoContainer: {
    marginTop: 16,
    padding: '10px 14px',
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: 10,
  },
  demoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '4px',
  },
  demoTitle: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  demoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  demoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Closes the gap by aligning elements together directly
  },
  demoLabel: {
    fontSize: '0.74rem',
    fontWeight: 600,
    color: '#64748b',
    width: '45px', // Fixed label space so details align up beautifully
    display: 'inline-block',
  },
  demoCode: {
    background: '#eef2ff',
    color: '#4f62d4',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: '0.72rem',
    fontWeight: 600,
    fontFamily: 'monospace',
    border: '1px solid #dbeafe',
  },
  footerText: {
    textAlign: 'center', 
    fontSize: '0.78rem',
    color: '#64748b', 
    marginTop: 14, 
    marginBottom: 0,
  },
  link: { 
    color: '#4f62d4', 
    fontWeight: 600 
  },
};

export default StudentLogin;