// frontend/src/pages/student/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_STYLES = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  'Under Review': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6', dot: '#7c3aed' },
  'Rejected':     { bg: '#ffe4e6', color: '#9f1239', dot: '#e11d48' },
};

const StatCard = ({ icon, label, value, color, subtext }) => (
  <div className="col-sm-6 col-xl-3">
    <div className="ph-stat-card" style={{ '--stat-accent': color }}>
      <div className="ph-stat-icon" style={{ background: `${color}14` }}>{icon}</div>
      <div className="ph-stat-value" style={{ color }}>{value}</div>
      <p className="ph-stat-label">{label}</p>
      {subtext && <p className="ph-stat-sub">{subtext}</p>}
    </div>
  </div>
);

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="ph-loading">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading dashboard…</span>
    </div>
  );
  if (!data) return (
    <div className="container py-5 text-center" style={{ color: '#94a3b8' }}>
      Failed to load dashboard.
    </div>
  );

  const { student, stats } = data;
  const cgpa = parseFloat(student.cgpa);
  const cgpaColor = cgpa >= 8 ? '#059669' : cgpa >= 6 ? '#d97706' : '#e11d48';
  const cgpaBg    = cgpa >= 8 ? '#d1fae5' : cgpa >= 6 ? '#fef3c7' : '#ffe4e6';

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Page header */}
      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44,
                background: 'linear-gradient(135deg, #4f62d4, #0d9488)',
                borderRadius: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0,
                border: '2px solid rgba(255,255,255,0.18)',
              }}>
                {student.name?.[0]?.toUpperCase() || '👤'}
              </div>
              <div>
                <h4 style={{ color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                  Welcome back, {student.name.split(' ')[0]}!
                </h4>
                <p className="subtitle" style={{ margin: 0 }}>
                  {student.branch} &nbsp;·&nbsp; CGPA:&nbsp;
                  <strong style={{ color: '#7cb9ff' }}>{student.cgpa}</strong>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/student/companies" className="ph-btn ph-btn-primary ph-btn-sm">
                Browse Companies
              </Link>
              <Link to="/student/applications" className="ph-btn ph-btn-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.22)' }}>
                My Applications
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          <StatCard icon="📋" label="Total Applications" value={stats.totalApplications} color="#4f62d4" />
          <StatCard icon="📌" label="Shortlisted"         value={stats.shortlisted}       color="#d97706" />
          <StatCard icon="🏆" label="Selected"            value={stats.selected}          color="#059669" />
          <StatCard icon="🏢" label="Eligible Companies"  value={stats.eligibleCompanies} color="#7c3aed" subtext="Based on your CGPA" />
        </div>

        {/* Content row */}
        <div className="row g-3">

          {/* Profile */}
          <div className="col-lg-5">
            <div className="ph-card h-100">
              <div style={{ padding: '22px 24px' }}>
                <div className="ph-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📄</span> My Profile
                </div>

                <div style={{
                  background: '#f8fafc', borderRadius: 12, overflow: 'hidden',
                  border: '1px solid #e8eef5',
                }}>
                  {[
                    ['Name',   student.name],
                    ['Email',  student.email],
                    ['Branch', student.branch],
                    ['CGPA',   student.cgpa],
                  ].map(([k, v], i) => (
                    <div key={k} className="ph-info-row" style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                      <span className="ph-info-key">{k}</span>
                      <span className="ph-info-val" style={{ color: k === 'CGPA' ? cgpaColor : '#1e293b' }}>
                        {k === 'CGPA' ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '2px 10px', background: cgpaBg, borderRadius: 99,
                            fontSize: '0.82rem',
                          }}>
                            {v}
                          </span>
                        ) : v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CGPA bar */}
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Academic Standing
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: cgpaColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {student.cgpa} / 10
                    </span>
                  </div>
                  <div className="ph-progress" style={{ height: 8 }}>
                    <div className="ph-progress-bar" style={{
                      width: `${(cgpa / 10) * 100}%`,
                      background: `linear-gradient(90deg, ${cgpaColor}, ${cgpaColor}bb)`,
                    }} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#94a3b8' }}>
                    {cgpa >= 8 ? '⭐ Excellent — eligible for most companies'
                     : cgpa >= 6 ? '✓ Good — eligible for several companies'
                     : '⚠ Work on improving your CGPA for more opportunities'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions + status guide */}
          <div className="col-lg-7">
            <div className="ph-card h-100">
              <div style={{ padding: '22px 24px' }}>
                <div className="ph-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚡</span> Quick Actions
                </div>
                <div className="row g-3 mb-4">
                  {[
                    { to: '/student/companies',    icon: '🏢', title: 'Browse Companies', desc: 'View all visiting companies and apply', color: '#4f62d4' },
                    { to: '/student/applications', icon: '📋', title: 'My Applications', desc: 'Track real-time status updates',         color: '#059669' },
                  ].map(item => (
                    <div className="col-sm-6" key={item.to}>
                      <Link to={item.to} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{
                          padding: '20px 18px',
                          background: `${item.color}08`,
                          border: `1.5px solid ${item.color}1e`,
                          borderRadius: 14,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = `${item.color}14`;
                            e.currentTarget.style.borderColor = `${item.color}45`;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 6px 18px ${item.color}1a`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = `${item.color}08`;
                            e.currentTarget.style.borderColor = `${item.color}1e`;
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ fontSize: '1.7rem', marginBottom: 12 }}>{item.icon}</div>
                          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginBottom: 5 }}>{item.title}</div>
                          <div style={{ fontSize: '0.77rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Status guide */}
                <div>
                  <p style={{ fontSize: '0.70rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>
                    Application Status Guide
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {Object.entries(STATUS_STYLES).map(([status, style]) => (
                      <span key={status} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 11px',
                        background: style.bg, color: style.color,
                        borderRadius: 999,
                        fontSize: '0.73rem', fontWeight: 600,
                      }}>
                        <span style={{ width: 6, height: 6, background: style.dot, borderRadius: '50%', flexShrink: 0 }} />
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
