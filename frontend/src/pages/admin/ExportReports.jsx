// export-reports/ExportReports.jsx
// Drop-in Export Reports page — Admin only
// No extra npm packages needed on the frontend
// CSV download is triggered by a plain fetch with the JWT token

import React, { useState } from 'react';

// ── Token helper ─────────────────────────────────────────
const getToken = () => localStorage.getItem('token');
const BASE_URL  = 'http://localhost:5000/api/export'; // adjust if your port differs

// ── Download helper ──────────────────────────────────────
// Uses fetch so we can attach the Authorization header.
// The browser then downloads the file automatically.
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
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert(`Export failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

// ── Report card sub-component ────────────────────────────
const ReportCard = ({
  icon, title, description, columns,
  endpoint, filename, color, loadingKey, loadingState, setLoading
}) => {
  const isLoading = loadingState === loadingKey;

  return (
    <div className="col-md-6 col-xl-4">
      <div className="card border-0 shadow-sm h-100"
        style={{ borderRadius: '18px', overflow: 'hidden', borderTop: `4px solid ${color}` }}>
        <div className="card-body p-4">
          {/* Icon + Title */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-3 p-2" style={{ background: `${color}15`, fontSize: '1.6rem' }}>
              {icon}
            </div>
            <div>
              <h6 className="fw-bold mb-0" style={{ color: '#1a1a2e' }}>{title}</h6>
              <span className="badge rounded-pill" style={{ background: `${color}18`, color, fontSize: '0.7rem' }}>CSV</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>{description}</p>

          {/* Columns preview */}
          <div className="mb-4">
            <p className="fw-semibold small mb-2" style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
              Columns included
            </p>
            <div className="d-flex flex-wrap gap-1">
              {columns.map(col => (
                <span key={col} className="badge rounded-pill px-2 py-1"
                  style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem', fontWeight: 500 }}>
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Export button */}
          <button
            className="btn w-100 fw-semibold"
            style={{
              background: isLoading ? '#e2e8f0' : color,
              color: isLoading ? '#94a3b8' : '#fff',
              borderRadius: '12px',
              padding: '10px',
              border: 'none',
              transition: 'all 0.2s',
              cursor: isLoading ? 'wait' : 'pointer',
            }}
            disabled={isLoading || !!loadingState}
            onClick={() => downloadCsv(endpoint, filename, (val) =>
              setLoading(val ? loadingKey : null)
            )}
          >
            {isLoading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Exporting...</>
            ) : (
              <>⬇️ Export {title}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────
const ExportReports = () => {
  const [loadingState, setLoading] = useState(null);

  const reports = [
    {
      icon: '👥',
      title: 'Students Report',
      description: 'Complete list of all registered students with CGPA, branch, and placement outcome.',
      columns: ['ID', 'Name', 'Email', 'Branch', 'CGPA', 'Applications', 'Placed', 'Registered On'],
      endpoint: 'students',
      filename: `students_report_${new Date().toISOString().slice(0,10)}.csv`,
      color: '#5378ff',
      loadingKey: 'students',
    },
    {
      icon: '🏢',
      title: 'Companies Report',
      description: 'All visiting companies with package details, applicant count, and selection numbers.',
      columns: ['ID', 'Company', 'Role', 'Package', 'Min CGPA', 'Applicants', 'Selected', 'Added On'],
      endpoint: 'companies',
      filename: `companies_report_${new Date().toISOString().slice(0,10)}.csv`,
      color: '#10b981',
      loadingKey: 'companies',
    },
    {
      icon: '📋',
      title: 'Applications Report',
      description: 'Full applications log with student details, company, role, and current status.',
      columns: ['App ID', 'Student', 'Email', 'Branch', 'CGPA', 'Company', 'Role', 'Package', 'Status', 'Applied On'],
      endpoint: 'applications',
      filename: `applications_report_${new Date().toISOString().slice(0,10)}.csv`,
      color: '#f59e0b',
      loadingKey: 'applications',
    },
  ];

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: '#fff', padding: '28px 0 24px' }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1">📥 Export Reports</h4>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
              Download placement data as CSV files — admin only
            </p>
          </div>
          <span className="badge rounded-pill px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.8rem' }}>
            Format: CSV
          </span>
        </div>
      </div>

      <div className="container py-4">

        {/* Info banner */}
        <div className="alert border-0 rounded-3 mb-4 d-flex align-items-start gap-3"
          style={{ background: '#eff6ff', borderLeft: '4px solid #5378ff !important' }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>ℹ️</span>
          <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
            <strong>How it works:</strong> Click any export button below. The server queries the live database
            and streams a <strong>CSV file</strong> directly to your browser — no intermediate file is stored on the server.
            Files are timestamped so multiple exports don't overwrite each other.
          </div>
        </div>

        {/* Report cards */}
        <div className="row g-4">
          {reports.map(report => (
            <ReportCard
              key={report.loadingKey}
              {...report}
              loadingState={loadingState}
              setLoading={setLoading}
            />
          ))}
        </div>

        {/* Quick tips */}
        <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>💡 Tips for exported CSV files</h6>
            <div className="row g-3">
              {[
                { icon: '📊', tip: 'Open in Microsoft Excel or Google Sheets for filtering, sorting, and pivot tables.' },
                { icon: '🖨️', tip: 'Use the Applications report for department viva / placement coordinator review.' },
                { icon: '🔄', tip: 'Re-export anytime to get the latest data — each download reflects the current database state.' },
                { icon: '🔒', tip: 'Reports are only accessible when logged in as admin. The JWT token is sent with each export request.' },
              ].map((item, i) => (
                <div key={i} className="col-sm-6">
                  <div className="d-flex gap-3 align-items-start">
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                    <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExportReports;
