// frontend/src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, role } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-white text-center"
        style={{
          minHeight: '88vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(83,120,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(83,120,255,0.06)' }} />

        <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-3">
            <span style={{ fontSize: '4rem' }}>🎓</span>
          </div>
          <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '-0.5px' }}>
            Placement<span style={{ color: '#5378ff' }}>Hub</span>
          </h1>
          <p className="lead mb-2 text-white-50">College Placement Management Portal</p>
          <p className="mb-5" style={{ maxWidth: '520px', margin: '0 auto 2rem', color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem' }}>
            Connecting students with top companies. Apply to dream jobs, track applications, and launch your career.
          </p>

          {!user ? (
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/student/login" className="btn btn-lg px-5 fw-semibold" style={{ background: '#5378ff', border: 'none', color: '#fff', borderRadius: '50px' }}>
                Student Login
              </Link>
              <Link to="/student/register" className="btn btn-lg btn-outline-light px-5 fw-semibold" style={{ borderRadius: '50px' }}>
                Register
              </Link>
              <Link to="/admin/login" className="btn btn-lg px-5 fw-semibold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50px', backdropFilter: 'blur(4px)' }}>
                Admin Portal
              </Link>
            </div>
          ) : (
            <Link
              to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
              className="btn btn-lg px-5 fw-semibold"
              style={{ background: '#5378ff', border: 'none', color: '#fff', borderRadius: '50px' }}
            >
              Go to Dashboard →
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2" style={{ color: '#1a1a2e' }}>Everything You Need</h2>
          <p className="text-center text-muted mb-5">A complete placement ecosystem for students and administrators</p>
          <div className="row g-4">
            {[
              { icon: '🔍', title: 'Browse Companies', desc: 'Explore all visiting companies with package and role details at a glance.' },
              { icon: '✅', title: 'Eligibility Check', desc: 'Automatic CGPA-based eligibility filter — see only what you qualify for.' },
              { icon: '📋', title: 'Track Applications', desc: 'Real-time application status updates from Applied to Selected.' },
              { icon: '🛡️', title: 'Admin Control', desc: 'Admins manage companies, review applications, and update statuses with ease.' },
            ].map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '16px', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4" style={{ background: '#1a1a2e', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
        <div className="container">
          🎓 PlacementHub — College Placement Management Portal · Mini Project
        </div>
      </footer>
    </div>
  );
};

export default Home;
