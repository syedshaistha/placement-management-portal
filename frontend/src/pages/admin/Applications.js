// frontend/src/pages/admin/Applications.js

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

const STATUS_STYLES = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { bg: '#fef3c7', color: '#92400e' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6' },
  'Rejected':     { bg: '#fee2e2', color: '#991b1b' },
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('All');

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
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const displayed = filter === 'All'
    ? applications
    : applications.filter(a => a.status === filter);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#5378ff' }} />
    </div>
  );

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      <div className="py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff' }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1">📋 All Applications</h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {applications.length} total · Click the status dropdown to update
            </p>
          </div>
          {/* Filter buttons */}
          <div className="d-flex flex-wrap gap-1">
            {['All', ...STATUSES].map(s => (
              <button key={s}
                className={`btn btn-sm ${filter === s ? 'btn-light fw-semibold' : 'btn-outline-light'}`}
                style={{ borderRadius: '20px', fontSize: '0.78rem', padding: '4px 12px' }}
                onClick={() => setFilter(s)}>
                {s} {s !== 'All' && `(${applications.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: '#f1f5f9' }}>
                <tr>
                  {['#', 'Student', 'Branch / CGPA', 'Company', 'Role', 'Package', 'Status', 'Applied On'].map(h => (
                    <th key={h} className="py-3 ps-3 fw-semibold" style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-5 text-muted">No applications found.</td></tr>
                ) : displayed.map((app, i) => {
                  const style = STATUS_STYLES[app.status] || STATUS_STYLES['Applied'];
                  return (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="ps-3 text-muted small">{i + 1}</td>
                      <td className="ps-3">
                        <div className="fw-semibold" style={{ color: '#1a1a2e', fontSize: '0.88rem' }}>{app.student_name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.student_email}</div>
                      </td>
                      <td className="ps-3">
                        <div style={{ fontSize: '0.82rem' }}>{app.branch}</div>
                        <span className="fw-bold" style={{ color: parseFloat(app.cgpa) >= 8 ? '#10b981' : '#f59e0b', fontSize: '0.82rem' }}>
                          {app.cgpa} CGPA
                        </span>
                      </td>
                      <td className="ps-3 fw-semibold" style={{ fontSize: '0.88rem' }}>{app.company_name}</td>
                      <td className="ps-3 text-muted" style={{ fontSize: '0.82rem' }}>{app.role}</td>
                      <td className="ps-3 fw-bold" style={{ color: '#5378ff', fontSize: '0.85rem' }}>₹{app.package} LPA</td>
                      <td className="ps-3">
                        {/* Status dropdown */}
                        <select
                          className="form-select form-select-sm"
                          style={{
                            background: style.bg, color: style.color,
                            border: `1px solid ${style.color}40`,
                            borderRadius: '8px', fontWeight: 600,
                            fontSize: '0.78rem', minWidth: '130px',
                            cursor: updatingId === app.id ? 'wait' : 'pointer'
                          }}
                          value={app.status}
                          onChange={e => handleStatusChange(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="ps-3 text-muted" style={{ fontSize: '0.78rem' }}>
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
