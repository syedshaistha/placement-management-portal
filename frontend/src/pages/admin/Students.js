// frontend/src/pages/admin/Students.js

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/students')
      .then(res => setStudents(res.data.students))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

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
            <h4 className="fw-bold mb-1">👥 Students</h4>
            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.7)' }}>{students.length} students registered</p>
          </div>
          <input
            type="text" className="form-control form-control-sm" placeholder="Search by name, branch, email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '280px', borderRadius: '30px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div className="container py-4">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: '#f1f5f9' }}>
                <tr>
                  {['#', 'Name', 'Email', 'Branch', 'CGPA', 'Applications', 'Joined'].map(h => (
                    <th key={h} className="py-3 ps-3 fw-semibold" style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">No students found.</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="ps-3 text-muted small">{i + 1}</td>
                    <td className="ps-3 fw-semibold" style={{ color: '#1a1a2e' }}>{s.name}</td>
                    <td className="ps-3 text-muted small">{s.email}</td>
                    <td className="ps-3">
                      <span className="badge rounded-pill" style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem' }}>
                        {s.branch}
                      </span>
                    </td>
                    <td className="ps-3">
                      <span className="fw-bold" style={{ color: parseFloat(s.cgpa) >= 8 ? '#10b981' : parseFloat(s.cgpa) >= 6 ? '#f59e0b' : '#ef4444' }}>
                        {s.cgpa}
                      </span>
                    </td>
                    <td className="ps-3">
                      <span className="badge rounded-pill" style={{ background: '#f0fdf4', color: '#166534' }}>
                        {s.application_count}
                      </span>
                    </td>
                    <td className="ps-3 text-muted small">
                      {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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

export default Students;
