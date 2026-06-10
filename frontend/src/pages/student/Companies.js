// frontend/src/pages/student/Companies.js

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [studentCgpa, setStudentCgpa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'eligible'

  const fetchCompanies = () => {
    api.get('/student/companies')
      .then(res => {
        setCompanies(res.data.companies);
        setStudentCgpa(res.data.studentCgpa);
      })
      .catch(() => toast.error('Failed to load companies'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleApply = async (companyId, companyName) => {
    setApplyingId(companyId);
    try {
      await api.post(`/student/apply/${companyId}`);
      toast.success(`Successfully applied to ${companyName}!`);
      fetchCompanies(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplyingId(null);
    }
  };

  const displayed = filter === 'eligible'
    ? companies.filter(c => c.eligible)
    : companies;

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#5378ff' }} />
    </div>
  );

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff' }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1">🏢 Visiting Companies</h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Your CGPA: <strong style={{ color: '#7c9dff' }}>{studentCgpa}</strong> · {companies.filter(c => c.eligible).length} companies eligible
            </p>
          </div>
          <div className="btn-group">
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setFilter('all')}>
              All ({companies.length})
            </button>
            <button className={`btn btn-sm ${filter === 'eligible' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setFilter('eligible')}>
              Eligible ({companies.filter(c => c.eligible).length})
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {displayed.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <p className="mt-2">No companies found.</p>
          </div>
        ) : (
          <div className="row g-3">
            {displayed.map(company => (
              <div key={company.id} className="col-md-6 col-xl-4">
                <div className="card border-0 shadow-sm h-100" style={{
                  borderRadius: '16px',
                  borderLeft: `4px solid ${company.eligible ? '#10b981' : '#e5e7eb'}`,
                }}>
                  <div className="card-body p-4">
                    {/* Company name + eligibility badge */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e' }}>{company.company_name}</h5>
                        <span className="text-muted small">{company.role}</span>
                      </div>
                      {company.eligible
                        ? <span className="badge rounded-pill" style={{ background: '#dcfce7', color: '#166534', fontSize: '0.72rem' }}>✓ Eligible</span>
                        : <span className="badge rounded-pill" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem' }}>✗ Not Eligible</span>
                      }
                    </div>

                    {/* Package */}
                    <div className="mb-3">
                      <span className="fw-bold" style={{ color: '#5378ff', fontSize: '1.3rem' }}>₹{company.package} LPA</span>
                    </div>

                    {/* Details */}
                    <div className="d-flex gap-3 mb-3" style={{ fontSize: '0.82rem' }}>
                      <div>
                        <span className="text-muted">Min. CGPA </span>
                        <span className="fw-semibold">{company.min_cgpa}</span>
                      </div>
                    </div>

                    {company.description && (
                      <p className="text-muted small mb-3" style={{ lineHeight: '1.5' }}>
                        {company.description.length > 90 ? company.description.slice(0, 90) + '...' : company.description}
                      </p>
                    )}

                    {/* Action button */}
                    {company.already_applied ? (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-pill px-3 py-2"
                          style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.8rem' }}>
                          ✓ Applied · {company.application_status}
                        </span>
                      </div>
                    ) : company.eligible ? (
                      <button
                        className="btn btn-sm fw-semibold w-100"
                        style={{ background: '#5378ff', color: '#fff', borderRadius: '10px' }}
                        onClick={() => handleApply(company.id, company.company_name)}
                        disabled={applyingId === company.id}
                      >
                        {applyingId === company.id
                          ? <><span className="spinner-border spinner-border-sm me-1" />Applying...</>
                          : 'Apply Now'
                        }
                      </button>
                    ) : (
                      <button className="btn btn-sm w-100 disabled"
                        style={{ background: '#f3f4f6', color: '#9ca3af', borderRadius: '10px', cursor: 'not-allowed' }}>
                        Not Eligible (Need {company.min_cgpa} CGPA)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
