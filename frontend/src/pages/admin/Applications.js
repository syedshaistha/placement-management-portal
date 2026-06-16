// frontend/src/pages/admin/Applications.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

const STATUS_MAP = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  'Under Review': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6', dot: '#7c3aed' },
  'Rejected':     { bg: '#ffe4e6', color: '#9f1239', dot: '#e11d48' },
};

const cgpaColor = (cgpa) => {
  const v = parseFloat(cgpa);
  if (v >= 8) return '#059669';
  if (v >= 6) return '#d97706';
  return '#e11d48';
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter]     = useState('All');

  const fetchApplications = () => {
    api.get('/admin/applications')
      .then(res => setApplications(res.data.applications))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchApplications(); }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.put(`/admin/applications/${appId}/status`, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const displayed = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  if (loading) return (
    <div className="ph-loading">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading applications…</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 5 }}>📋 All Applications</h4>
              <p className="subtitle">
                {applications.length} total &nbsp;·&nbsp; Use the dropdown to update status
              </p>
            </div>
            <div className="ph-filter-pills" style={{ maxWidth: '100%', overflow: 'auto' }}>
              {['All', ...STATUSES].map(s => {
                const count = s === 'All' ? applications.length : applications.filter(a => a.status === s).length;
                return (
                  <button
                    key={s}
                    className={`ph-filter-pill${filter === s ? ' active' : ''}`}
                    onClick={() => setFilter(s)}
                  >
                    {s} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="ph-table-wrap">
          <div className="table-responsive">
            <table className="ph-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>#</th>
                  <th>Student</th>
                  <th>Branch / CGPA</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '56px', color: '#94a3b8' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 10, opacity: 0.4 }}>📋</div>
                      No applications found.
                    </td>
                  </tr>
                ) : displayed.map((app, i) => {
                  const s = STATUS_MAP[app.status] || STATUS_MAP['Applied'];
                  return (
                    <tr key={app.id}>
                      <td data-label="#" style={{ paddingLeft: 20, color: '#94a3b8', fontSize: '0.79rem', fontWeight: 500 }}>{i + 1}</td>
                      <td data-label="Student">
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{app.student_name}</div>
                        <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{app.student_email}</div>
                      </td>
                      <td data-label="Branch / CGPA">
                        <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 3 }}>{app.branch}</div>
                        <span style={{
                          fontWeight: 800, fontSize: '0.78rem', color: cgpaColor(app.cgpa),
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                          {app.cgpa}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}> CGPA</span>
                      </td>
                      <td data-label="Company" style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{app.company_name}</td>
                      <td data-label="Role" style={{ color: '#64748b', fontSize: '0.82rem' }}>{app.role}</td>
                      <td data-label="Package">
                        <span style={{
                          fontWeight: 800, color: '#4f62d4', fontSize: '0.875rem',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                          ₹{app.package} LPA
                        </span>
                      </td>
                      <td data-label="Status">
                        <select
                          className="form-select form-select-sm"
                          style={{
                            background: s.bg, color: s.color,
                            border: `1.5px solid ${s.dot}35`,
                            borderRadius: 8, fontWeight: 700,
                            fontSize: '0.75rem', minWidth: 138,
                            cursor: updatingId === app.id ? 'wait' : 'pointer',
                          }}
                          value={app.status}
                          onChange={e => handleStatusChange(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                        >
                          {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                      </td>
                      <td data-label="Applied On" style={{ color: '#94a3b8', fontSize: '0.77rem', whiteSpace: 'nowrap' }}>
                        {new Date(app.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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
  );
};

export default AdminApplications;
