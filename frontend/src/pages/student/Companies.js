// frontend/src/pages/student/Companies.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const Companies = () => {
  const [companies, setCompanies]     = useState([]);
  const [studentCgpa, setStudentCgpa] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [applyingId, setApplyingId]   = useState(null);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');

  const fetchCompanies = () => {
    api.get('/student/companies')
      .then(res => { setCompanies(res.data.companies); setStudentCgpa(res.data.studentCgpa); })
      .catch(() => toast.error('Failed to load companies'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchCompanies(); }, []);

  const handleApply = async (companyId, companyName) => {
    setApplyingId(companyId);
    try {
      await api.post(`/student/apply/${companyId}`);
      toast.success(`Successfully applied to ${companyName}!`);
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplyingId(null);
    }
  };

  const displayed = companies
    .filter(c => filter === 'eligible' ? c.eligible : true)
    .filter(c => !search ||
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return (
    <div className="ph-loading">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading companies…</span>
    </div>
  );

  const eligibleCount = companies.filter(c => c.eligible).length;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Header */}
      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 6 }}>🏢 Visiting Companies</h4>
              <p className="subtitle">
                Your CGPA: <strong style={{ color: '#7cb9ff' }}>{studentCgpa}</strong>
                &nbsp;·&nbsp;
                <strong style={{ color: '#6ee7b7' }}>{eligibleCount}</strong> of {companies.length} companies eligible
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <div className="ph-search-wrap" style={{ maxWidth: 260, width: '100%' }}>
                <span className="ph-search-icon">🔍</span>
                <input
                  type="text"
                  className="form-control ph-search-input"
                  placeholder="Search companies or roles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.22)', color: '#fff' }}
                />
              </div>
              <div className="ph-filter-pills">
                <button className={`ph-filter-pill${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
                  All ({companies.length})
                </button>
                <button className={`ph-filter-pill${filter === 'eligible' ? ' active' : ''}`} onClick={() => setFilter('eligible')}>
                  Eligible ({eligibleCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {displayed.length === 0 ? (
          <div className="ph-empty">
            <span className="ph-empty-icon">🔍</span>
            <h6>No companies found</h6>
            <p>{search ? 'Try a different search term.' : 'Check back later for new listings.'}</p>
          </div>
        ) : (
          <div className="row g-3">
            {displayed.map(company => (
              <div key={company.id} className="col-md-6 col-xl-4">
                <div className="ph-company-card">
                  {/* Accent bar */}
                  <div className="ph-company-card-accent"
                    style={{ background: company.eligible ? 'linear-gradient(90deg, #059669, #0d9488)' : '#e2e8f0' }}
                  />
                  <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 3, letterSpacing: '-0.2px' }}>
                          {company.company_name}
                        </div>
                        <div style={{ fontSize: '0.79rem', color: '#64748b' }}>{company.role}</div>
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: 999, fontSize: '0.69rem', fontWeight: 700, flexShrink: 0,
                        background: company.eligible ? '#d1fae5' : '#f1f5f9',
                        color: company.eligible ? '#065f46' : '#94a3b8',
                        whiteSpace: 'nowrap',
                      }}>
                        {company.eligible ? '✓ Eligible' : '✗ Ineligible'}
                      </span>
                    </div>

                    {/* Package highlight */}
                    <div style={{
                      background: 'linear-gradient(135deg, #eef0fb, #f4f5fc)',
                      border: '1px solid #e0e4f9',
                      borderRadius: 11,
                      padding: '11px 15px',
                      marginBottom: 14,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Package</span>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, color: '#4f62d4', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                        ₹{company.package} LPA
                      </span>
                    </div>

                    {/* Min CGPA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: company.description ? 10 : 16 }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 500 }}>Minimum CGPA:</span>
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#334155' }}>{company.min_cgpa}</span>
                    </div>

                    {/* Description */}
                    {company.description && (
                      <p style={{ fontSize: '0.79rem', color: '#64748b', lineHeight: 1.58, marginBottom: 16, flex: 1 }}>
                        {company.description.length > 100 ? company.description.slice(0, 100) + '…' : company.description}
                      </p>
                    )}

                    {/* Action */}
                    <div style={{ marginTop: 'auto' }}>
                      {company.already_applied ? (
                        <div style={{
                          padding: '10px 14px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: 10,
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#166534',
                          display: 'flex', alignItems: 'center', gap: 7,
                        }}>
                          <span>✓</span>
                          Applied &nbsp;·&nbsp;
                          <span style={{ color: '#4f62d4' }}>{company.application_status}</span>
                        </div>
                      ) : company.eligible ? (
                        <button
                          className="ph-btn ph-btn-primary"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => handleApply(company.id, company.company_name)}
                          disabled={applyingId === company.id}
                        >
                          {applyingId === company.id
                            ? <><span className="spinner-border spinner-border-sm" /> Applying…</>
                            : 'Apply Now →'
                          }
                        </button>
                      ) : (
                        <div style={{
                          padding: '10px 14px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          fontSize: '0.79rem',
                          color: '#94a3b8',
                          textAlign: 'center',
                          fontWeight: 500,
                        }}>
                          Requires {company.min_cgpa} CGPA (yours: {studentCgpa})
                        </div>
                      )}
                    </div>
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
