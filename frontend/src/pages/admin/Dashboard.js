// frontend/src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_MAP = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8', bar: '#3b82f6' },
  'Under Review': { bg: '#fef3c7', color: '#92400e', bar: '#f59e0b' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46', bar: '#10b981' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6', bar: '#7c3aed' },
  'Rejected':     { bg: '#ffe4e6', color: '#9f1239', bar: '#e11d48' },
};

const StatCard = ({ icon, label, value, color, to, sub }) => (
  <div className="col-sm-6 col-xl-3">
    <Link to={to} className="ph-stat-card ph-card-hover" style={{ '--stat-accent': color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div className="ph-stat-icon" style={{ background: `${color}14`, margin: 0 }}>{icon}</div>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, color,
          background: `${color}12`, padding: '3px 9px',
          borderRadius: 99, letterSpacing: '0.5px', textTransform: 'uppercase'
        }}>
          View all →
        </span>
      </div>
      <div className="ph-stat-value" style={{ color }}>{value}</div>
      <p className="ph-stat-label">{label}</p>
      {sub && <p className="ph-stat-sub">{sub}</p>}
    </Link>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
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

  const { stats, statusBreakdown, recentApplications } = data;
  const placementRate = stats.totalStudents > 0
    ? Math.round((stats.totalSelected / stats.totalStudents) * 100)
    : 0;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Header */}
      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 5 }}>🛡️ Admin Dashboard</h4>
              <p className="subtitle">Manage placements, students, and companies</p>
            </div>
            <Link to="/admin/companies" className="ph-btn ph-btn-primary ph-btn-sm">
              + Add Company
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          <StatCard icon="👥" label="Total Students"   value={stats.totalStudents}     color="#4f62d4" to="/admin/students" />
          <StatCard icon="🏢" label="Companies"         value={stats.totalCompanies}    color="#0d9488" to="/admin/companies" />
          <StatCard icon="📋" label="Applications"      value={stats.totalApplications} color="#d97706" to="/admin/applications" />
          <StatCard icon="🏆" label="Students Selected" value={stats.totalSelected}     color="#7c3aed" to="/admin/applications"
            sub={`${placementRate}% placement rate`}
          />
        </div>

        <div className="row g-3">

          {/* Status breakdown */}
          <div className="col-lg-4">
            <div className="ph-card h-100" style={{ padding: '22px 24px' }}>
              <div className="ph-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span>📊</span> Applications by Status
              </div>
              {statusBreakdown.length === 0 ? (
                <div className="ph-empty" style={{ padding: '24px 0' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No applications yet.</p>
                </div>
              ) : statusBreakdown.map(row => {
                const s = STATUS_MAP[row.status] || { bg: '#f1f5f9', color: '#64748b', bar: '#94a3b8' };
                const pct = stats.totalApplications > 0
                  ? Math.round((row.count / stats.totalApplications) * 100)
                  : 0;
                return (
                  <div key={row.status} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, background: s.bar, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#334155' }}>{row.status}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{row.count}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="ph-progress">
                      <div className="ph-progress-bar" style={{ width: `${pct}%`, background: s.bar }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent applications */}
          <div className="col-lg-8">
            <div className="ph-card h-100" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <div className="ph-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🕐</span> Recent Applications
                </div>
                <Link to="/admin/applications" style={{ fontSize: '0.8rem', color: '#4f62d4', fontWeight: 600 }}>
                  View all →
                </Link>
              </div>
              <div className="table-responsive">
                <table className="ph-table">
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 22 }}>Student</th>
                      <th>Company</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                          No applications yet.
                        </td>
                      </tr>
                    ) : recentApplications.map(app => {
                      const s = STATUS_MAP[app.status] || STATUS_MAP['Applied'];
                      return (
                        <tr key={app.id}>
                          <td data-label="Student" style={{ paddingLeft: 22 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, flexShrink: 0,
                                background: 'linear-gradient(135deg, #4f62d4, #7c3aed)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 700, color: '#fff',
                              }}>
                                {app.student_name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{app.student_name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{app.branch}</div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Company">
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{app.company_name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{app.role}</div>
                          </td>
                          <td data-label="Status">
                            <span style={{
                              padding: '3px 10px', background: s.bg, color: s.color,
                              borderRadius: 999, fontSize: '0.71rem', fontWeight: 700,
                            }}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="row g-3 mt-1">
          {[
            { to: '/admin/students',  icon: '👥', label: 'Manage Students',  desc: 'View & search registered students', color: '#4f62d4' },
            { to: '/admin/companies', icon: '🏢', label: 'Manage Companies', desc: 'Add, view, or remove companies',      color: '#0d9488' },
            { to: '/admin/analytics', icon: '📊', label: 'View Analytics',   desc: 'Placement statistics & trends',      color: '#7c3aed' },
            { to: '/admin/export',    icon: '📤', label: 'Export Reports',   desc: 'Download CSV data exports',          color: '#d97706' },
          ].map(item => (
            <div key={item.to} className="col-6 col-md-3">
              <Link to={item.to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '18px 20px',
                  height: '100%',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${item.color}22`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.06)';
                  }}
                >
                  <div style={{
                    width: 40, height: 40,
                    background: `${item.color}12`,
                    borderRadius: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.15rem', flexShrink: 0,
                    marginBottom: 12,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
