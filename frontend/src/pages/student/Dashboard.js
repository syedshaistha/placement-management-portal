// frontend/src/pages/student/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StatCard = ({ icon, label, value, color, subtext }) => (
  <div className="col-sm-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="rounded-3 p-2" style={{ background: `${color}18`, fontSize: '1.5rem' }}>{icon}</div>
          <span className="badge rounded-pill" style={{ background: `${color}18`, color: color, fontSize: '0.7rem' }}>STATS</span>
        </div>
        <h2 className="fw-bold mb-0" style={{ color }}>{value}</h2>
        <p className="text-muted small mb-0">{label}</p>
        {subtext && <p className="text-muted" style={{ fontSize: '0.75rem' }}>{subtext}</p>}
      </div>
    </div>
  </div>
);

const STATUS_STYLES = {
  'Applied':      { bg: '#e3f2fd', color: '#1565c0' },
  'Under Review': { bg: '#fff3e0', color: '#e65100' },
  'Shortlisted':  { bg: '#e8f5e9', color: '#2e7d32' },
  'Selected':     { bg: '#f3e5f5', color: '#6a1b9a' },
  'Rejected':     { bg: '#ffebee', color: '#c62828' },
};

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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#5378ff' }} />
    </div>
  );
  if (!data) return <div className="container py-5 text-center text-muted">Failed to load dashboard.</div>;

  const { student, stats } = data;

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      {/* Header banner */}
      <div className="py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">👋 Hello, {student.name}!</h4>
              <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {student.branch} · CGPA: <strong style={{ color: '#7c9dff' }}>{student.cgpa}</strong>
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/student/companies" className="btn btn-sm fw-semibold" style={{ background: '#5378ff', color: '#fff', borderRadius: '30px', padding: '6px 18px' }}>
                Browse Companies
              </Link>
              <Link to="/student/applications" className="btn btn-sm btn-outline-light" style={{ borderRadius: '30px', padding: '6px 18px' }}>
                My Applications
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Stat cards */}
        <div className="row g-3 mb-4">
          <StatCard icon="📋" label="Total Applications" value={stats.totalApplications} color="#5378ff" />
          <StatCard icon="📌" label="Shortlisted" value={stats.shortlisted} color="#f59e0b" />
          <StatCard icon="🏆" label="Selected" value={stats.selected} color="#10b981" />
          <StatCard icon="🏢" label="Eligible Companies" value={stats.eligibleCompanies} color="#6366f1" subtext="Based on your CGPA" />
        </div>

        {/* Profile card */}
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>📄 My Profile</h6>
                <table className="table table-borderless mb-0" style={{ fontSize: '0.9rem' }}>
                  <tbody>
                    {[
                      ['Name', student.name],
                      ['Email', student.email],
                      ['Branch', student.branch],
                      ['CGPA', student.cgpa],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td className="text-muted ps-0" style={{ width: '40%' }}>{k}</td>
                        <td className="fw-semibold pe-0">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>⚡ Quick Actions</h6>
                <div className="row g-3">
                  {[
                    { to: '/student/companies', icon: '🏢', title: 'View Companies', desc: 'Browse all visiting companies', color: '#5378ff' },
                    { to: '/student/applications', icon: '📋', title: 'My Applications', desc: 'Track your application status', color: '#10b981' },
                  ].map(item => (
                    <div className="col-6" key={item.to}>
                      <Link to={item.to} className="text-decoration-none">
                        <div className="p-3 rounded-3 h-100"
                          style={{ background: `${item.color}10`, border: `1px solid ${item.color}30`, transition: 'all 0.2s', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = `${item.color}20`}
                          onMouseLeave={e => e.currentTarget.style.background = `${item.color}10`}>
                          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                          <div className="fw-semibold" style={{ color: '#1a1a2e', fontSize: '0.9rem' }}>{item.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>{item.desc}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Status legend */}
                <div className="mt-4">
                  <h6 className="fw-semibold small text-muted mb-2">APPLICATION STATUS GUIDE</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.entries(STATUS_STYLES).map(([status, style]) => (
                      <span key={status} className="badge rounded-pill px-3 py-2"
                        style={{ background: style.bg, color: style.color, fontSize: '0.75rem' }}>
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
