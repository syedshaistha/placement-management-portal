// frontend/src/pages/admin/ExportReports.jsx
import React, { useState } from 'react';

const getToken  = () => localStorage.getItem('token');
const BASE_URL  = 'http://localhost:5000/api/export';

const downloadCsv = async (endpoint, filename, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${response.status}`);
    }
    const blob = await response.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert(`Export failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

const REPORTS = [
  {
    key: 'students',
    icon: '👥',
    title: 'Student Data',
    description: 'Complete list of all registered students with academic details and application counts.',
    columns: ['ID', 'Name', 'Email', 'Branch', 'CGPA', 'Registered On', 'Applications'],
    endpoint: 'students',
    filename: 'students_report.csv',
    color: '#4f62d4',
  },
  {
    key: 'companies',
    icon: '🏢',
    title: 'Company Data',
    description: 'All visiting companies with package details, eligibility criteria, and applicant counts.',
    columns: ['ID', 'Company', 'Role', 'Package (LPA)', 'Min CGPA', 'Applicants', 'Added On'],
    endpoint: 'companies',
    filename: 'companies_report.csv',
    color: '#0d9488',
  },
  {
    key: 'applications',
    icon: '📋',
    title: 'Applications',
    description: 'Full application data across all students and companies including current status.',
    columns: ['App ID', 'Student', 'Email', 'Branch', 'CGPA', 'Company', 'Role', 'Package', 'Status', 'Applied On'],
    endpoint: 'applications',
    filename: 'applications_report.csv',
    color: '#d97706',
  },
  {
    key: 'placed',
    icon: '🏆',
    title: 'Placed Students',
    description: 'Only students who received a "Selected" status — ideal for placement records.',
    columns: ['Name', 'Email', 'Branch', 'CGPA', 'Company', 'Role', 'Package (LPA)', 'Selected On'],
    endpoint: 'placed-students',
    filename: 'placed_students_report.csv',
    color: '#7c3aed',
  },
  {
    key: 'analytics',
    icon: '📊',
    title: 'Analytics Summary',
    description: 'Aggregated placement statistics — branch-wise and company-wise breakdowns.',
    columns: ['Branch / Company', 'Total Applied', 'Shortlisted', 'Selected', 'Placement Rate'],
    endpoint: 'analytics-summary',
    filename: 'analytics_summary.csv',
    color: '#059669',
  },
];

const ReportCard = ({ report, loadingKey, setLoading }) => {
  const isLoading = loadingKey === report.key;
  return (
    <div className="col-md-6 col-xl-4">
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 18,
        overflow: 'hidden',
        height: '100%',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: '0 2px 8px rgba(15,23,42,0.07)',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 10px 28px rgba(15,23,42,0.11)';
          e.currentTarget.style.borderColor = `${report.color}30`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.07)';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: report.color, borderRadius: '18px 18px 0 0', flexShrink: 0 }} />

        <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{
              width: 48, height: 48,
              background: `${report.color}12`,
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0,
            }}>
              {report.icon}
            </div>
            <div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, color: '#0f172a',
                fontSize: '0.95rem', marginBottom: 4, letterSpacing: '-0.2px',
              }}>
                {report.title}
              </div>
              <span style={{
                padding: '2px 9px',
                background: `${report.color}14`, color: report.color,
                borderRadius: 99, fontSize: '0.65rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                CSV Export
              </span>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.62, marginBottom: 16, flex: 1 }}>
            {report.description}
          </p>

          {/* Columns */}
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: '0.67rem', fontWeight: 700, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8,
            }}>
              Columns included
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {report.columns.map(col => (
                <span key={col} style={{
                  padding: '2px 8px',
                  background: '#f1f5f9', color: '#475569',
                  borderRadius: 99, fontSize: '0.69rem', fontWeight: 500,
                }}>
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={() => downloadCsv(report.endpoint, report.filename, (v) => setLoading(v ? report.key : null))}
            disabled={isLoading}
            style={{
              width: '100%', padding: '10px 16px',
              background: isLoading ? '#f1f5f9' : report.color,
              color: isLoading ? '#94a3b8' : '#fff',
              border: 'none', borderRadius: 11,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem', fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.18s ease',
              boxShadow: isLoading ? 'none' : `0 2px 8px ${report.color}28`,
            }}
          >
            {isLoading ? (
              <><span className="spinner-border spinner-border-sm" /> Exporting…</>
            ) : (
              <>⬇ Download CSV</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ExportReports = () => {
  const [loadingKey, setLoading] = useState(null);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Header */}
      <div className="ph-page-header">
        <div className="container ph-page-header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 5 }}>📤 Export Reports</h4>
              <p className="subtitle">Download placement data as CSV for offline analysis and records</p>
            </div>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 10,
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600,
            }}>
              📁 {REPORTS.length} report types
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Info banner */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 12,
          padding: '13px 18px',
          marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: '0.83rem', color: '#1e40af',
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
          <span>
            All exports are generated in real time from the database.
            Files open in Excel, Google Sheets, or any CSV viewer.
          </span>
        </div>

        {/* Report cards */}
        <div className="row g-3">
          {REPORTS.map(report => (
            <ReportCard
              key={report.key}
              report={report}
              loadingKey={loadingKey}
              setLoading={setLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportReports;
