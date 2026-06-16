// frontend/src/pages/admin/Students.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const cgpaColor = (cgpa) => {
  const v = parseFloat(cgpa);
  if (v >= 8) return { color: '#059669', bg: '#d1fae5' };
  if (v >= 6) return { color: '#d97706', bg: '#fef3c7' };
  return { color: '#e11d48', bg: '#ffe4e6' };
};

const Students = () => {
  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [sortField, setSortField]   = useState('name');
  const [sortDir, setSortDir]       = useState('asc');
  const [branchFilter, setBranchFilter] = useState('All');

  useEffect(() => {
    api.get('/admin/students')
      .then(res => setStudents(res.data.students))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const branches = ['All', ...Array.from(new Set(students.map(s => s.branch))).sort()];

  const filtered = students
    .filter(s =>
      (branchFilter === 'All' || s.branch === branchFilter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
       s.branch.toLowerCase().includes(search.toLowerCase()) ||
       s.email.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = a[sortField] ?? '';
      const vb = b[sortField] ?? '';
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ color: '#cbd5e1', marginLeft: 4, fontSize: '0.7rem' }}>↕</span>;
    return <span style={{ color: '#4f62d4', marginLeft: 4, fontSize: '0.7rem' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) return (
    <div className="ph-loading">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading students…</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 5 }}>👥 Students</h4>
              <p className="subtitle">{students.length} registered students</p>
            </div>
            <div className="ph-search-wrap" style={{ maxWidth: 280, width: '100%' }}>
              <span className="ph-search-icon">🔍</span>
              <input
                type="text" className="form-control ph-search-input"
                placeholder="Search name, branch, email…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.22)', color: '#fff' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Branch filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Showing <strong style={{ color: '#1e293b' }}>{filtered.length}</strong> of {students.length} students
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {branches.map(b => (
              <button
                key={b}
                onClick={() => setBranchFilter(b)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 99,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  border: '1.5px solid',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: branchFilter === b ? '#4f62d4' : 'transparent',
                  color: branchFilter === b ? '#fff' : '#64748b',
                  borderColor: branchFilter === b ? '#4f62d4' : '#e2e8f0',
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="ph-table-wrap">
          <div className="table-responsive">
            <table className="ph-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 22 }}>#</th>
                  <th className="th-sortable" onClick={() => toggleSort('name')}>
                    Name <SortIcon field="name" />
                  </th>
                  <th>Email</th>
                  <th className="th-sortable" onClick={() => toggleSort('branch')}>
                    Branch <SortIcon field="branch" />
                  </th>
                  <th className="th-sortable" onClick={() => toggleSort('cgpa')}>
                    CGPA <SortIcon field="cgpa" />
                  </th>
                  <th>Applications</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '56px', color: '#94a3b8' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 10, opacity: 0.4 }}>👥</div>
                      No students found.
                    </td>
                  </tr>
                ) : filtered.map((s, i) => {
                  const c = cgpaColor(s.cgpa);
                  return (
                    <tr key={s.id}>
                      <td data-label="#" style={{ paddingLeft: 22, color: '#94a3b8', fontWeight: 500, fontSize: '0.8rem' }}>{i + 1}</td>
                      <td data-label="Name">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, flexShrink: 0,
                            background: 'linear-gradient(135deg, #4f62d4, #7c3aed)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.68rem', fontWeight: 800, color: '#fff',
                          }}>
                            {s.name[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{s.name}</span>
                        </div>
                      </td>
                      <td data-label="Email" style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.email}</td>
                      <td data-label="Branch">
                        <span style={{ padding: '3px 10px', background: '#eef0fb', color: '#4338ca', borderRadius: 999, fontSize: '0.73rem', fontWeight: 600 }}>
                          {s.branch}
                        </span>
                      </td>
                      <td data-label="CGPA">
                        <span style={{
                          padding: '3px 10px',
                          background: c.bg, color: c.color,
                          borderRadius: 999, fontSize: '0.78rem', fontWeight: 800,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                          {s.cgpa}
                        </span>
                      </td>
                      <td data-label="Applications">
                        <span style={{ padding: '3px 10px', background: '#f0fdf4', color: '#166534', borderRadius: 999, fontSize: '0.73rem', fontWeight: 600 }}>
                          {s.application_count}
                        </span>
                      </td>
                      <td data-label="Joined" style={{ fontSize: '0.79rem', color: '#94a3b8' }}>
                        {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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

export default Students;
