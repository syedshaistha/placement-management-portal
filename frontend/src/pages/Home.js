// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🔍',
    title: 'Browse Companies',
    desc: 'Explore visiting companies with package details, job roles, and eligibility criteria — all in one clean view.',
    color: '#4f62d4',
  },
  {
    icon: '✅',
    title: 'Smart Eligibility',
    desc: 'Automatic CGPA-based filtering shows you only the companies you qualify for, without manual searching.',
    color: '#0d9488',
  },
  {
    icon: '📋',
    title: 'Track Applications',
    desc: 'Real-time updates from Applied → Shortlisted → Selected. Stay informed at every step.',
    color: '#d97706',
  },
  {
    icon: '🛡️',
    title: 'Admin Control',
    desc: 'Placement coordinators manage companies, review applications, and update statuses effortlessly.',
    color: '#7c3aed',
  },
];

const stats = [
  { value: '500+', label: 'Students Registered' },
  { value: '50+',  label: 'Companies Visiting' },
  { value: '85%',  label: 'Placement Rate' },
  { value: '₹18L', label: 'Highest Package' },
];

const Home = () => {
  const { user, role } = useAuth();

  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${String(currentYear + 1).slice(2)}`;

  return (
    <div style={{ background: '#fff' }}>
      <style>{`
        /* ── Hero ── */
        .home-hero {
          min-height: 92vh;
          background: linear-gradient(155deg, #0a1128 0%, #141f3f 40%, #1a3060 75%, #1e3a72 100%);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .home-hero-glow-1 {
          position: absolute;
          top: -140px; right: -100px;
          width: 580px; height: 580px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,98,212,0.2) 0%, transparent 68%);
          pointer-events: none;
        }
        .home-hero-glow-2 {
          position: absolute;
          bottom: -120px; left: -80px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 68%);
          pointer-events: none;
        }
        .home-hero-glow-3 {
          position: absolute;
          top: 30%; left: 40%;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 88px 0 80px;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(79,98,212,0.18);
          border: 1px solid rgba(79,98,212,0.38);
          border-radius: 99px;
          padding: 6px 16px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #a5b4ff;
          letter-spacing: 0.4px;
          margin-bottom: 26px;
        }
        .hero-eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #7b93ff;
          animation: pulse-dot 2.2s ease infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.75); }
        }
        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.5rem, 5.5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -1.5px;
          color: #fff;
          margin-bottom: 20px;
        }
        .hero-title .accent {
          background: linear-gradient(135deg, #7b93ff 0%, #5eead4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.58);
          line-height: 1.72;
          max-width: 440px;
          margin-bottom: 38px;
          font-weight: 400;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 56px;
        }
        .hero-btn-main {
          padding: 13px 28px;
          background: #4f62d4;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(79,98,212,0.38), 0 1px 4px rgba(79,98,212,0.2);
          letter-spacing: -0.1px;
        }
        .hero-btn-main:hover {
          background: #3d50be;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(79,98,212,0.48), 0 2px 8px rgba(79,98,212,0.25);
        }
        .hero-btn-secondary {
          padding: 13px 28px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.82);
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
          letter-spacing: -0.1px;
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.13);
          color: #fff;
          border-color: rgba(255,255,255,0.32);
        }
        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 28px;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 0 28px 0 0;
          margin-right: 28px;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .hero-stat:last-child {
          border-right: none;
          margin-right: 0;
          padding-right: 0;
        }
        .hero-stat-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.42);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        /* Hero panel */
        .hero-panel {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .hero-panel-header {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(255,255,255,0.40);
          text-transform: uppercase;
          letter-spacing: 0.9px;
          margin-bottom: 14px;
        }
        .company-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          margin-bottom: 8px;
          transition: background 0.18s ease;
        }
        .company-pill:hover { background: rgba(255,255,255,0.09); }
        .company-pill-name {
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          font-size: 0.84rem;
        }
        .company-pill-role {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.42);
          margin-top: 1px;
        }
        .company-pill-pkg {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          color: #a5b4ff;
          font-size: 0.88rem;
        }
        .company-pill-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 99px;
          background: rgba(13,148,136,0.22);
          color: #5eead4;
          margin-left: 8px;
        }

        /* ── Features ── */
        .home-features {
          background: #f8fafc;
          padding: 88px 0;
        }
        .section-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #4f62d4;
          margin-bottom: 10px;
          display: block;
        }
        .section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.7rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .section-sub {
          color: #64748b;
          font-size: 1rem;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.65;
        }
        .feature-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 28px 24px;
          height: 100%;
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--fc-accent, #4f62d4);
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.10);
          border-color: transparent;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 18px;
        }
        .feature-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
        }
        .feature-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0;
        }

        /* ── CTA ── */
        .home-cta {
          background: linear-gradient(150deg, #0a1128 0%, #141f3f 50%, #1e2d5a 100%);
          padding: 80px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .home-cta::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,98,212,0.15) 0%, transparent 70%);
        }
        .home-cta h2 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.7rem, 3vw, 2.3rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          position: relative;
        }
        .home-cta p {
          color: rgba(255,255,255,0.50);
          font-size: 1rem;
          margin-bottom: 36px;
          position: relative;
        }
        .home-cta-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
        }

        /* ── Footer ── */
        .home-footer {
          background: #0f172a;
          padding: 22px 0;
          text-align: center;
          color: rgba(255,255,255,0.28);
          font-size: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        @media (max-width: 768px) {
          .hero-content { padding: 64px 0 56px; }
          .hero-stats { gap: 0; flex-wrap: wrap; }
          .hero-stat {
            padding: 0 20px 0 0;
            margin-right: 20px;
            margin-bottom: 12px;
          }
          .hero-stat:nth-child(even) { border-right: none; margin-right: 0; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="home-hero">
        <div className="home-hero-glow-1" />
        <div className="home-hero-glow-2" />
        <div className="home-hero-glow-3" />
        <div className="container hero-content">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                  B.Tech Placement Portal · {academicYear}
              </div>
              <h1 className="hero-title">
                Your Career<br />
                Starts <span className="accent">Right Here</span>
              </h1>
              <p className="hero-sub">
                Connect with top companies, track your applications in real time,
                and land your dream job — all from one platform.
              </p>

              {!user ? (
                <div className="hero-actions">
                  <Link to="/student/login" className="hero-btn-main">
                    Student Login →
                  </Link>
                  <Link to="/student/register" className="hero-btn-secondary">
                    Create Account
                  </Link>
                  <Link to="/admin/login" className="hero-btn-secondary">
                    Admin Portal
                  </Link>
                </div>
              ) : (
                <div className="hero-actions">
                  <Link
                    to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                    className="hero-btn-main"
                  >
                    Go to Dashboard →
                  </Link>
                </div>
              )}

              <div className="hero-stats">
                {stats.map((s) => (
                  <div className="hero-stat" key={s.label}>
                    <span className="hero-stat-value">{s.value}</span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5 offset-lg-1 d-none d-lg-block">
              <div className="hero-panel">
  <div className="hero-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>📈 LIVE APPLICATION TRACKER</span>
    <span className="company-pill-badge" style={{ background: 'rgba(79,98,212,0.2)', color: '#a5b4ff', fontSize: '0.6rem' }}>DEMO VIEW</span>
  </div>
  
  {[
    { name: 'Google', role: 'SDE II', status: 'Selected 🎉', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
    { name: 'Microsoft', role: 'Software Engineer', status: 'Shortlisted 📋', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
    { name: 'Amazon', role: 'SDE I', status: 'Interviewing 💬', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
    { name: 'Infosys', role: 'Systems Engineer', status: 'Applied 📨', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.2)' },
  ].map(c => (
    <div className="company-pill" key={c.name} style={{ padding: '12px 14px' }}>
      <div>
        <div className="company-pill-name">{c.name}</div>
        <div className="company-pill-role">{c.role}</div>
      </div>
      <div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '8px',
          color: c.color,
          background: c.bg,
          border: `1px solid ${c.border}`,
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          {c.status}
        </span>
      </div>
    </div>
  ))}
  
  <div style={{
    marginTop: 14, padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: 11,
    textAlign: 'center'
  }}>
    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
      Login as a student to trace your personal application workflow live.
    </span>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="home-features">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">Why PlacementHub</span>
            <h2 className="section-title">Everything You Need to Get Placed</h2>
            <p className="section-sub">A complete placement ecosystem designed for students and coordinators alike.</p>
          </div>
          <div className="row g-4">
            {features.map(f => (
              <div key={f.title} className="col-md-6 col-xl-3">
                <div className="feature-card" style={{ '--fc-accent': f.color }}>
                  <div className="feature-icon-wrap" style={{ background: `${f.color}14` }}>
                    {f.icon}
                  </div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      {!user && (
        <div className="home-cta">
          <div className="container">
            <h2>Ready to Begin Your Placement Journey?</h2>
            <p>Join hundreds of students already using PlacementHub.</p>
            <div className="home-cta-actions">
              <Link to="/student/register" className="hero-btn-main">
                Get Started Free →
              </Link>
              <Link to="/student/login" className="hero-btn-secondary">
                Already have an account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="container">
          🎓 PlacementHub — College Placement Management Portal &nbsp;·&nbsp; Final Year B.Tech Project &nbsp;·&nbsp; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Home;
