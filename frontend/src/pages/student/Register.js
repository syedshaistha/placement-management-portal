// frontend/src/pages/student/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics',
  'Mechanical', 'Civil', 'Electrical', 'Chemical',
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', cgpa: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const cgpa = parseFloat(form.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      return toast.error('CGPA must be between 0 and 10');
    }
    setLoading(true);
    try {
      await api.post('/auth/student/register', form);
      toast.success('Account created! Please sign in.');
      navigate('/student/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          background: #090d16 !important; /* Premium rich canvas anchor color */
        }
      `}</style>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>👤</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.sub}>Join PlacementHub and start your placement journey</p>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label className="form-label" style={styles.labelAdjust}>Full Name</label>
              <input
                type="text" name="name" className="form-control form-control-sm"
                placeholder="Arjun Sharma"
                value={form.name} onChange={handleChange} required
                autoComplete="name"
                style={styles.inputMini}
              />
            </div>

            <div style={styles.field}>
              <label className="form-label" style={styles.labelAdjust}>College Email</label>
              <input
                type="email" name="email" className="form-control form-control-sm"
                placeholder="name@college.edu"
                value={form.email} onChange={handleChange} required
                autoComplete="email"
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
                placeholder="Minimum 6 characters"
                value={form.password} onChange={handleChange} required minLength={6}
                autoComplete="new-password"
                style={styles.inputMini}
              />
            </div>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={styles.labelAdjust}>CGPA</label>
                <input
                  type="number" name="cgpa" className="form-control form-control-sm"
                  placeholder="8.50"
                  value={form.cgpa} onChange={handleChange}
                  required min="0" max="10" step="0.01"
                  style={styles.inputMini}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={styles.labelAdjust}>Branch</label>
                <select 
                  name="branch" 
                  className="form-select form-select-sm" 
                  value={form.branch} 
                  onChange={handleChange} 
                  required
                  style={styles.inputMini}
                >
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3d50be'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#4f62d4'; }}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ marginRight: 8 }} />Creating Account…</>
                : 'Create Account →'
              }
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/student/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    // Computes layout safely below dynamic global navigation element heights
    height: 'calc(100vh - 70px)', 
    width: '100vw',
    // Luxury Deep Midnight Gradient with Indigo accents - matching login screen perfectly
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
    // Deeper, high-end soft drop shadows to enhance the "3D floating" design principle
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 8px 20px -6px rgba(0, 0, 0, 0.3)',
    width: '100%', 
    maxWidth: 390, 
    overflow: 'hidden',
    // Micro adjustment to offset standard visual weight imbalances 
    marginTop: '-20px', 
  },
  header: {
    background: 'linear-gradient(145deg, #111827 0%, #1e2d5a 55%, #263a6e 100%)',
    padding: '14px 20px 12px',
    textAlign: 'center',
  },
  iconWrap: {
    width: 36, 
    height: 36,
    background: 'rgba(255,255,255,0.10)',
    border: '1.5px solid rgba(255,255,255,0.18)',
    borderRadius: 10, 
    fontSize: '1.1rem',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: '0 auto 6px',
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '1.1rem', 
    fontWeight: 800,
    color: '#fff', 
    marginBottom: 2, 
    letterSpacing: '-0.3px',
  },
  sub: { 
    color: 'rgba(255,255,255,0.60)', 
    fontSize: '0.72rem', 
    margin: 0 
  },
  body: { 
    padding: '16px 24px 18px' 
  },
  field: { 
    marginBottom: 8 
  },
  labelAdjust: {
    marginBottom: 2,
    fontSize: '0.8rem'
  },
  inputMini: {
    paddingTop: '4px',
    paddingBottom: '4px',
    fontSize: '0.85rem',
    height: 'auto'
  },
  row: { 
    display: 'flex', 
    gap: 10, 
    marginBottom: 8 
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
    transition: 'background 0.2s ease',
    boxShadow: '0 4px 12px rgba(79,98,212,0.35)',
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center', 
    fontSize: '0.75rem',
    color: '#64748b', 
    marginTop: 10, 
    marginBottom: 0,
  },
  link: { 
    color: '#4f62d4', 
    fontWeight: 600 
  },
};

export default Register;