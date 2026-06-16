// frontend/src/pages/student/Applications.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const STATUS_MAP = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  'Under Review': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6', dot: '#7c3aed' },
  'Rejected':     { bg: '#ffe4e6', color: '#9f1239', dot: '#e11d48' },
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    api.get('/student/applications')
      .then(res => setApplications(res.data.applications))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="ph-loading">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading applications…</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Header */}
      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div>
            <h4 style={{ color: '#fff', marginBottom: 5 }}>📋 My Applications</h4>
            <p className="subtitle">Track the real-time status of all your job applications</p>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {applications.length === 0 ? (
          <div className="ph-empty">
            <span className="ph-empty-icon">📭</span>
            <h6>No applications yet</h6>
            <p>Browse companies and start applying to see your applications here.</p>
          </div>
        ) : (
          <>
            {/* Summary chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {Object.entries(STATUS_MAP).map(([status, style]) => {
                const count = applications.filter(a => a.status === status).length;
                if (!count) return null;
                return (
                  <div key={status} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px',
                    background: style.bg, color: style.color,
                    borderRadius: 999, fontSize: '0.77rem', fontWeight: 700,
                  }}>
                    <span style={{ width: 6, height: 6, background: style.dot, borderRadius: '50%', flexShrink: 0 }} />
                    {status}: {count}
                  </div>
                );
              })}
            </div>

            {/* Table */}
            <div className="ph-table-wrap">
              <div className="table-responsive">
                <table className="ph-table">
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 20 }}>#</th>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Package</th>
                      <th>Status</th>
                      <th>Applied On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, i) => {
                      const style = STATUS_MAP[app.status] || STATUS_MAP['Applied'];
                      return (
                        <tr key={app.id}>
                          <td data-label="#" style={{ paddingLeft: 20, color: '#94a3b8', fontWeight: 500, fontSize: '0.8rem' }}>{i + 1}</td>
                          <td data-label="Company" style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{app.company_name}</td>
                          <td data-label="Role" style={{ color: '#64748b', fontSize: '0.84rem' }}>{app.role}</td>
                          <td data-label="Package">
                            <span style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontWeight: 800, color: '#4f62d4', fontSize: '0.875rem',
                            }}>
                              ₹{app.package} LPA
                            </span>
                          </td>
                          <td data-label="Status">
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '3px 11px',
                              background: style.bg, color: style.color,
                              borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
                            }}>
                              <span style={{ width: 6, height: 6, background: style.dot, borderRadius: '50%', flexShrink: 0 }} />
                              {app.status}
                            </span>
                          </td>
                          <td data-label="Applied On" style={{ color: '#94a3b8', fontSize: '0.79rem', whiteSpace: 'nowrap' }}>
                            {new Date(app.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Applications;
