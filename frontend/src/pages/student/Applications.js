// frontend/src/pages/student/Applications.js

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const STATUS_STYLES = {
  'Applied':      { bg: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { bg: '#fef3c7', color: '#92400e' },
  'Shortlisted':  { bg: '#d1fae5', color: '#065f46' },
  'Selected':     { bg: '#ede9fe', color: '#5b21b6' },
  'Rejected':     { bg: '#fee2e2', color: '#991b1b' },
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/applications')
      .then(res => setApplications(res.data.applications))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#5378ff' }} />
    </div>
  );

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      <div className="py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff' }}>
        <div className="container">
          <h4 className="fw-bold mb-1">📋 My Applications</h4>
          <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Track the status of all your job applications
          </p>
        </div>
      </div>

      <div className="container py-4">
        {applications.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3.5rem' }}>📭</div>
            <h5 className="mt-3 text-muted">No applications yet</h5>
            <p className="text-muted small">Browse companies and start applying!</p>
          </div>
        ) : (
          <>
            {/* Summary row */}
            <div className="row g-2 mb-4">
              {Object.entries(STATUS_STYLES).map(([status, style]) => {
                const count = applications.filter(a => a.status === status).length;
                return count > 0 ? (
                  <div key={status} className="col-auto">
                    <span className="badge rounded-pill px-3 py-2" style={{ background: style.bg, color: style.color, fontSize: '0.82rem' }}>
                      {status}: {count}
                    </span>
                  </div>
                ) : null;
              })}
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead style={{ background: '#f1f5f9' }}>
                    <tr>
                      <th className="py-3 ps-4" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>#</th>
                      <th className="py-3" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Company</th>
                      <th className="py-3" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Role</th>
                      <th className="py-3" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Package</th>
                      <th className="py-3" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                      <th className="py-3" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Applied On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, i) => {
                      const style = STATUS_STYLES[app.status] || STATUS_STYLES['Applied'];
                      return (
                        <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="ps-4 text-muted small">{i + 1}</td>
                          <td className="fw-semibold" style={{ color: '#1a1a2e' }}>{app.company_name}</td>
                          <td className="text-muted small">{app.role}</td>
                          <td className="fw-semibold" style={{ color: '#5378ff' }}>₹{app.package} LPA</td>
                          <td>
                            <span className="badge rounded-pill px-3 py-2"
                              style={{ background: style.bg, color: style.color, fontSize: '0.78rem' }}>
                              {app.status}
                            </span>
                          </td>
                          <td className="text-muted small">
                            {new Date(app.applied_at).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
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
