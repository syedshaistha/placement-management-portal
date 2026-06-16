// frontend/src/pages/admin/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', form);
      login(res.data.admin, 'admin', res.data.token);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Global overrides to lock page physics and seal the underlying white background leaks */}
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          overflow: hidden !important;
          background: #090d16 !important; /* Forces the deep luxury canvas base color globally */
        }
      `}</style>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.accessBadge}>
            <span>🔒</span> Authorized Personnel Only
          </div>
          <div style={styles.iconWrap}>🛡️</div>
          <h2 style={styles.title}>Admin Portal</h2>
          <p style={styles.sub}>Placement management console</p>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label className="form-label" style={styles.labelAdjust}>Username</label>
              <input
                type="text" name="username" className="form-control form-control-sm"
                placeholder="admin"
                value={form.username} onChange={handleChange} required
                autoComplete="username"
                style={styles.inputMini}
              />
            </div>
            <div style={styles.field}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <label className="form-label" style={{ margin: 0, fontSize: '0.8rem' }}>Password</label>
                <button
                  type="button" onClick={() => setShowPass(v => !v)}
                  style={styles.toggleBtn}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPass ? 'text' : 'password'} name="password" className="form-control form-control-sm"
                placeholder="Enter admin password"
                value={form.password} onChange={handleChange} required
                autoComplete="current-password"
                style={styles.inputMini}
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ marginRight: 8 }} />Authenticating…</>
                : 'Login as Admin →'
              }
            </button>
          </form>

          {/* Premium Formatted Left-Aligned Demo Box */}
          <div style={styles.demoContainer}>
            <div style={styles.demoHeader}>
              <span style={{ fontSize: '0.9rem' }}>🔑</span>
              <span style={styles.demoTitle}>Quick Access Admin Credentials</span>
            </div>
            <div style={styles.demoGrid}>
              <div style={styles.demoRow}>
                <span style={styles.demoLabel}>User:</span>
                <code style={styles.demoCode}>admin</code>
              </div>
              <div style={styles.demoRow}>
                <span style={styles.demoLabel}>Pass:</span>
                <code style={styles.demoCode}>password123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: 'calc(100vh - 70px)', 
    width: '100vw',
    // Luxury Deep Midnight Gradient with Indigo accents - matching student portal experience
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
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 8px 20px -6px rgba(0, 0, 0, 0.3)',
    width: '100%', 
    maxWidth: 390,
    overflow: 'hidden',
    marginTop: '-20px',
  },
  header: {
    background: 'linear-gradient(145deg, #0a1128 0%, #111827 50%, #1a2d5a 100%)',
    padding: '18px 24px 14px',
    textAlign: 'center',
    position: 'relative',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  accessBadge: {
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: 5,
    background: 'rgba(13,148,136,0.15)',
    border: '1px solid rgba(13,148,136,0.25)',
    borderRadius: 99, 
    padding: '2px 10px',
    fontSize: '0.65rem', 
    fontWeight: 700,
    color: '#5eead4', 
    textTransform: 'uppercase', 
    letterSpacing: '0.6px',
    marginBottom: 10,
  },
  iconWrap: {
    width: 42, 
    height: 42,
    background: 'linear-gradient(135deg, #0d9488, #059669)',
    borderRadius: 12, 
    fontSize: '1.3rem',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: '0 auto 8px',
    boxShadow: '0 4px 12px rgba(13,148,136,0.35)',
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
    color: 'rgba(255,255,255,0.44)', 
    fontSize: '0.75rem', 
    margin: 0 
  },
  body: { 
    padding: '18px 24px 20px' 
  },
  field: { 
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
    color: '#0d9488', 
    padding: 0,
  },
  submitBtn: {
    width: '100%', 
    padding: '8px',
    background: 'linear-gradient(135deg, #0d9488, #059669)',
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
    boxShadow: '0 4px 12px rgba(13,148,136,0.35)',
    marginTop: 12,
  },
  // Clean Structured Left-Aligned Layout
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
    justifyContent: 'flex-start',
  },
  demoLabel: {
    fontSize: '0.74rem',
    fontWeight: 600,
    color: '#64748b',
    width: '45px',
    display: 'inline-block',
  },
  demoCode: {
    background: '#f0fdfa',
    color: '#0d9488',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: '0.72rem',
    fontWeight: 600,
    fontFamily: 'monospace',
    border: '1px solid #ccfbf1',
  },
};

export default AdminLogin;