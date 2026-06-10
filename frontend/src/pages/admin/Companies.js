// frontend/src/pages/admin/Companies.js

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const emptyForm = { company_name: '', role: '', package: '', min_cgpa: '', description: '' };

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
    if (!window.confirm(`Delete ${name}? This will also remove all related applications.`)) return;
    try {
      await api.delete(`/admin/companies/${id}`);
      toast.success(`${name} deleted.`);
      fetchCompanies();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

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
            <h4 className="fw-bold mb-1">🏢 Companies</h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>{companies.length} companies listed</p>
          </div>
          <button className="btn btn-sm fw-semibold"
            style={{ background: '#5378ff', color: '#fff', borderRadius: '30px', padding: '6px 18px' }}
            onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Company'}
          </button>
        </div>
      </div>

      <div className="container py-4">
        {/* Add company form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', borderLeft: '4px solid #5378ff' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>➕ Add New Company</h6>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Company Name *</label>
                    <input type="text" name="company_name" className="form-control" placeholder="e.g. Google"
                      value={form.company_name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Job Role *</label>
                    <input type="text" name="role" className="form-control" placeholder="e.g. Software Engineer"
                      value={form.role} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Package (LPA) *</label>
                    <input type="number" name="package" className="form-control" placeholder="e.g. 12.5"
                      value={form.package} onChange={handleChange} required min="0" step="0.01" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Minimum CGPA *</label>
                    <input type="number" name="min_cgpa" className="form-control" placeholder="e.g. 7.5"
                      value={form.min_cgpa} onChange={handleChange} required min="0" max="10" step="0.01" />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea name="description" className="form-control" rows={2}
                      placeholder="Brief about the company and role..."
                      value={form.description} onChange={handleChange} />
                  </div>
                </div>
                <div className="mt-4">
                  <button type="submit" className="btn fw-semibold px-4"
                    style={{ background: '#5378ff', color: '#fff', borderRadius: '10px' }}
                    disabled={submitting}>
                    {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Adding...</> : 'Add Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Companies table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: '#f1f5f9' }}>
                <tr>
                  {['#', 'Company', 'Role', 'Package', 'Min CGPA', 'Applicants', 'Actions'].map(h => (
                    <th key={h} className="py-3 ps-3 fw-semibold" style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-5 text-muted">No companies yet. Add one above.</td></tr>
                ) : companies.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="ps-3 text-muted small">{i + 1}</td>
                    <td className="ps-3 fw-semibold" style={{ color: '#1a1a2e' }}>{c.company_name}</td>
                    <td className="ps-3 text-muted small">{c.role}</td>
                    <td className="ps-3 fw-bold" style={{ color: '#5378ff' }}>₹{c.package} LPA</td>
                    <td className="ps-3">
                      <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.8rem' }}>
                        {c.min_cgpa}+
                      </span>
                    </td>
                    <td className="ps-3">
                      <span className="badge rounded-pill" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                        {c.applicant_count}
                      </span>
                    </td>
                    <td className="ps-3">
                      <button className="btn btn-sm"
                        style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.78rem' }}
                        onClick={() => handleDelete(c.id, c.company_name)}>
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
