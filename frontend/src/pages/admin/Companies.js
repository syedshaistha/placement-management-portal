// frontend/src/pages/admin/Companies.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const emptyForm = { company_name: '', role: '', package: '', min_cgpa: '', description: '' };

const AdminCompanies = () => {
  const [companies, setCompanies]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);

  const fetchCompanies = () => {
    api.get('/admin/companies')
      .then(res => setCompanies(res.data.companies))
      .catch(() => toast.error('Failed to load companies'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchCompanies(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/companies', form);
      toast.success(`${form.company_name} added successfully!`);
      setForm(emptyForm);
      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? All related applications will also be removed.`)) return;
    try {
      await api.delete(`/admin/companies/${id}`);
      toast.success(`${name} deleted.`);
      fetchCompanies();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return (
    <div className="ph-loading">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading companies…</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Header */}
      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 5 }}>🏢 Companies</h4>
              <p className="subtitle">{companies.length} companies listed for placement</p>
            </div>
            <button
              className={`ph-btn ph-btn-sm ${showForm ? 'ph-btn-secondary' : 'ph-btn-primary'}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Add Company'}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Add form */}
        {showForm && (
          <div className="ph-card mb-4" style={{ borderTop: '3px solid #4f62d4', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px' }}>
              <div className="ph-section-title" style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>➕</span> Add New Company
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Company Name *</label>
                    <input type="text" name="company_name" className="form-control"
                      placeholder="e.g. Google"
                      value={form.company_name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Job Role *</label>
                    <input type="text" name="role" className="form-control"
                      placeholder="e.g. Software Engineer"
                      value={form.role} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Package (LPA) *</label>
                    <input type="number" name="package" className="form-control"
                      placeholder="e.g. 12.5"
                      value={form.package} onChange={handleChange} required min="0" step="0.01" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Minimum CGPA *</label>
                    <input type="number" name="min_cgpa" className="form-control"
                      placeholder="e.g. 7.5"
                      value={form.min_cgpa} onChange={handleChange} required min="0" max="10" step="0.01" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows={2}
                      placeholder="Brief description about the company and role…"
                      value={form.description} onChange={handleChange} />
                  </div>
                </div>
                <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
                  <button type="submit" className="ph-btn ph-btn-primary" disabled={submitting}>
                    {submitting ? <><span className="spinner-border spinner-border-sm" /> Adding…</> : 'Add Company'}
                  </button>
                  <button type="button" className="ph-btn ph-btn-secondary"
                    onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="ph-table-wrap">
          <div className="table-responsive">
            <table className="ph-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 22 }}>#</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Min CGPA</th>
                  <th>Applicants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '56px', color: '#94a3b8' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 10, opacity: 0.4 }}>🏢</div>
                      No companies yet. Click &quot;+ Add Company&quot; to get started.
                    </td>
                  </tr>
                ) : companies.map((c, i) => (
                  <tr key={c.id}>
                    <td data-label="#" style={{ paddingLeft: 22, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>{i + 1}</td>
                    <td data-label="Company">
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{c.company_name}</div>
                    </td>
                    <td data-label="Role">
                      <span style={{ color: '#64748b', fontSize: '0.84rem' }}>{c.role}</span>
                    </td>
                    <td data-label="Package">
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, color: '#4f62d4', fontSize: '0.9rem'
                      }}>
                        ₹{c.package} LPA
                      </span>
                    </td>
                    <td data-label="Min CGPA">
                      <span style={{ padding: '3px 10px', background: '#fef3c7', color: '#92400e', borderRadius: 999, fontSize: '0.74rem', fontWeight: 700 }}>
                        {c.min_cgpa}+
                      </span>
                    </td>
                    <td data-label="Applicants">
                      <span style={{ padding: '3px 10px', background: '#eef0fb', color: '#4338ca', borderRadius: 999, fontSize: '0.74rem', fontWeight: 600 }}>
                        {c.applicant_count} applied
                      </span>
                    </td>
                    <td data-label="Actions">
                      <button
                        className="ph-btn ph-btn-danger ph-btn-sm"
                        onClick={() => handleDelete(c.id, c.company_name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompanies;
