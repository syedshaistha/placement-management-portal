// frontend/src/pages/admin/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StatCard = ({ icon, label, value, color, to }) => (
  <div className="col-sm-6 col-xl-3">
    <Link to={to} className="text-decoration-none">
      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="rounded-3 p-2" style={{ background: `${color}18`, fontSize: '1.5rem' }}>{icon}</div>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>VIEW →</span>
          </div>
          <h2 className="fw-bold mb-0" style={{ color }}>{value}</h2>
          <p className="text-muted small mb-0">{label}</p>
        </div>
      </div>
    </Link>
  </div>
);

const STATUS_STYLES = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { bg: '#fef3c7', color: '#92400e' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6' },
  'Rejected':     { bg: '#fee2e2', color: '#991b1b' },
};

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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#5378ff' }} />
    </div>
  );
  if (!data) return <div className="container py-5 text-center text-muted">Failed to load dashboard.</div>;

  const { stats, statusBreakdown, recentApplications } = data;

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff' }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1">🛡️ Admin Dashboard</h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>Manage placements, students, and companies</p>
          </div>
          <Link to="/admin/companies" className="btn btn-sm fw-semibold"
            style={{ background: '#5378ff', color: '#fff', borderRadius: '30px', padding: '6px 18px' }}>
            + Add Company
          </Link>
        </div>
      </div>

      <div className="container py-4">
        {/* Stats */}
        <div className="row g-3 mb-4">
          <StatCard icon="👥" label="Total Students"     value={stats.totalStudents}     color="#5378ff"  to="/admin/students" />
          <StatCard icon="🏢" label="Companies"           value={stats.totalCompanies}    color="#10b981"  to="/admin/companies" />
          <StatCard icon="📋" label="Applications"        value={stats.totalApplications} color="#f59e0b"  to="/admin/applications" />
          <StatCard icon="🏆" label="Students Selected"   value={stats.totalSelected}     color="#6366f1"  to="/admin/applications" />
        </div>

        <div className="row g-3">
          {/* Status breakdown */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>📊 Applications by Status</h6>
                {statusBreakdown.length === 0 ? (
                  <p className="text-muted small">No applications yet.</p>
                ) : (
                  statusBreakdown.map(row => {
                    const style = STATUS_STYLES[row.status] || { bg: '#f3f4f6', color: '#6b7280' };
                    const pct = Math.round((row.count / stats.totalApplications) * 100);
                    return (
                      <div key={row.status} className="mb-3">
                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                          <span className="fw-semibold" style={{ color: style.color }}>{row.status}</span>
                          <span className="text-muted">{row.count}</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '10px', background: style.bg }}>
                          <div className="progress-bar" style={{ width: `${pct}%`, background: style.color, borderRadius: '10px' }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Recent applications */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="card-header bg-transparent border-0 p-4 pb-2 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0" style={{ color: '#1a1a2e' }}>🕐 Recent Applications</h6>
                <Link to="/admin/applications" className="btn btn-sm" style={{ fontSize: '0.78rem', color: '#5378ff' }}>View All</Link>
              </div>
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="ps-4 py-2 fw-semibold text-muted">Student</th>
                      <th className="py-2 fw-semibold text-muted">Company</th>
                      <th className="py-2 fw-semibold text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map(app => {
                      const style = STATUS_STYLES[app.status] || STATUS_STYLES['Applied'];
                      return (
                        <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="ps-4">
                            <div className="fw-semibold" style={{ color: '#1a1a2e' }}>{app.student_name}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.branch}</div>
                          </td>
                          <td>
                            <div className="fw-semibold">{app.company_name}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.role}</div>
                          </td>
                          <td>
                            <span className="badge rounded-pill px-2 py-1"
                              style={{ background: style.bg, color: style.color, fontSize: '0.72rem' }}>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
