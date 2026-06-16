// placement-analytics/PlacementAnalytics.jsx
// Drop-in Analytics Dashboard — Admin only, read-only
// Dependencies: chart.js, react-chartjs-2  (npm install chart.js react-chartjs-2)

import React, { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, ArcElement,
  Title, Tooltip, Legend,
  defaults
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import api from '../../utils/api';     // your existing Axios instance
import './PlacementAnalytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, ArcElement,
  Title, Tooltip, Legend
);
defaults.font.family = "'Segoe UI', sans-serif";

// ── Colour palettes ──────────────────────────────────────
const PALETTE = {
  blue:   '#5378ff',
  green:  '#10b981',
  amber:  '#f59e0b',
  purple: '#6366f1',
  rose:   '#f43f5e',
  teal:   '#14b8a6',
  indigo: '#6366f1',
  sky:    '#0ea5e9',
};

const STATUS_COLORS = {
  'Applied':      '#5378ff',
  'Under Review': '#f59e0b',
  'Shortlisted':  '#10b981',
  'Selected':     '#6366f1',
  'Rejected':     '#f43f5e',
};

const BRANCH_COLORS = [
  '#5378ff','#10b981','#f59e0b','#f43f5e',
  '#14b8a6','#6366f1','#0ea5e9','#a855f7',
];

// ── Stat card sub-component ──────────────────────────────
const StatCard = ({ icon, label, value, color, sub, subColor }) => (
  <div className="col-sm-6 col-xl-3">
    <div className="card stat-card h-100">
      <div className="card-body">
        <div className="stat-icon" style={{ background: `${color}18` }}>
          <span>{icon}</span>
        </div>
        <div className="stat-value" style={{ color }}>{value ?? '—'}</div>
        <p className="stat-label">{label}</p>
        {sub && (
          <p className="stat-sub" style={{ color: subColor || '#94a3b8' }}>{sub}</p>
        )}
      </div>
    </div>
  </div>
);

// ── Main component ───────────────────────────────────────
const PlacementAnalytics = () => {
  const [overview,   setOverview]   = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [statusData,  setStatusData]  = useState([]);
  const [branchData,  setBranchData]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ov, co, st, br] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/company-wise'),
          api.get('/analytics/status-wise'),
          api.get('/analytics/branch-wise'),
        ]);
        setOverview(ov.data);
        setCompanyData(co.data.data);
        setStatusData(st.data.data);
        setBranchData(br.data.data);
      } catch (err) {
        setError('Failed to load analytics data. Make sure you are logged in as admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Chart: Company-wise Applications (Grouped Bar) ────
  const companyBarData = {
    labels: companyData.map(r => r.company_name),
    datasets: [
      {
        label: 'Total Applied',
        data: companyData.map(r => r.total_applications),
        backgroundColor: '#5378ff',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Shortlisted',
        data: companyData.map(r => r.shortlisted),
        backgroundColor: '#10b981',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Selected',
        data: companyData.map(r => r.selected),
        backgroundColor: '#6366f1',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 } } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 11 } },
        grid: { color: '#f1f5f9' },
      },
    },
  };

  // ── Chart: Application Status (Pie) ──────────────────
  const statusPieData = {
    labels: statusData.map(r => r.status),
    datasets: [{
      data: statusData.map(r => r.count),
      backgroundColor: statusData.map(r => STATUS_COLORS[r.status] || '#94a3b8'),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 6,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 }, padding: 14 } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct   = total ? Math.round((ctx.parsed / total) * 100) : 0;
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
          }
        }
      }
    },
  };

  // ── Chart: Branch-wise Students (Doughnut) ───────────
  const branchDoughnutData = {
    labels: branchData.map(r => r.branch),
    datasets: [{
      data: branchData.map(r => r.total_students),
      backgroundColor: BRANCH_COLORS.slice(0, branchData.length),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 6,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 }, padding: 14 } },
    },
  };

  // ── Loading ──────────────────────────────────────────
  if (loading) return (
    <div className="analytics-spinner">
      <div className="spinner-border" style={{ color: '#5378ff', width: '2.5rem', height: '2.5rem' }} />
    </div>
  );

  // ── Error ────────────────────────────────────────────
  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger rounded-3">{error}</div>
    </div>
  );

  return (
    <div className="analytics-page">

      {/* ── Header ── */}
      <div className="analytics-header">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4>📊 Placement Analytics</h4>
            <p>Live insights from placement data — read-only view</p>
          </div>
          <span className="badge rounded-pill px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.8rem' }}>
            🟢 Live Data
          </span>
        </div>
      </div>

      <div className="container py-4">

        {/* ── Stat Cards ── */}
        <div className="row g-3 mb-4">
          <StatCard
            icon="👥" label="Total Students"
            value={overview.totalStudents}
            color="#5378ff"
            sub={`Avg CGPA: ${overview.avgCgpa}`}
          />
          <StatCard
            icon="🏢" label="Companies Visiting"
            value={overview.totalCompanies}
            color="#10b981"
            sub={`Highest: ₹${overview.highestPackage} LPA`}
          />
          <StatCard
            icon="📋" label="Total Applications"
            value={overview.totalApplications}
            color="#f59e0b"
            sub={`Across all companies`}
          />
          <StatCard
            icon="🏆" label="Students Placed"
            value={overview.placedStudents}
            color="#6366f1"
            sub={`Placement rate: ${overview.placementRate}%`}
            subColor="#10b981"
          />
        </div>

        {/* ── Placement Rate Banner ── */}
        <div className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderLeft: '5px solid #10b981' }}>
          <div className="card-body py-3 px-4 d-flex align-items-center gap-3 flex-wrap">
            <div className="rate-badge">{overview.placementRate}%</div>
            <div>
              <div className="fw-bold" style={{ color: '#065f46' }}>Overall Placement Rate</div>
              <div className="text-muted small">
                {overview.placedStudents} out of {overview.totalStudents} students received job offers
              </div>
            </div>
            <div className="ms-auto">
              <div className="progress" style={{ width: '180px', height: '10px', borderRadius: '10px', background: '#a7f3d0' }}>
                <div className="progress-bar"
                  style={{ width: `${overview.placementRate}%`, background: '#10b981', borderRadius: '10px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 1: Company-wise Bar Chart (full width) ── */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card chart-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>🏢 Company-wise Applications</h6>
                <span>Applied vs Shortlisted vs Selected per company</span>
              </div>
              <div className="card-body">
                {companyData.length === 0 ? (
                  <p className="text-muted text-center py-4">No company data available.</p>
                ) : (
                  <div className="chart-wrapper" style={{ height: '320px' }}>
                    <Bar data={companyBarData} options={barOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Status Pie + Branch Doughnut ── */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card chart-card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>📌 Application Status Distribution</h6>
                <span>All applications</span>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {statusData.length === 0 ? (
                  <p className="text-muted">No application data.</p>
                ) : (
                  <div className="chart-wrapper" style={{ height: '280px' }}>
                    <Pie data={statusPieData} options={pieOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card chart-card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>🎓 Branch-wise Student Distribution</h6>
                <span>By department</span>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {branchData.length === 0 ? (
                  <p className="text-muted">No branch data.</p>
                ) : (
                  <div className="chart-wrapper" style={{ height: '280px' }}>
                    <Doughnut data={branchDoughnutData} options={doughnutOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Branch-wise Detail Table ── */}
        <div className="row g-3">
          <div className="col-12">
            <div className="card chart-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>📋 Branch-wise Placement Summary</h6>
                <span>{branchData.length} branches</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table branch-table mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Branch</th>
                        <th>Total Students</th>
                        <th>Average CGPA</th>
                        <th>Students Placed</th>
                        <th>Placement %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchData.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-4 text-muted">No data.</td></tr>
                      ) : branchData.map((row, i) => {
                        const pct = row.total_students > 0
                          ? Math.round((row.placed_students / row.total_students) * 100)
                          : 0;
                        return (
                          <tr key={i}>
                            <td className="text-muted">{i + 1}</td>
                            <td>
                              <span className="fw-semibold">{row.branch}</span>
                            </td>
                            <td>{row.total_students}</td>
                            <td>
                              <span className="fw-semibold"
                                style={{ color: parseFloat(row.avg_cgpa) >= 8 ? '#10b981' : '#f59e0b' }}>
                                {row.avg_cgpa}
                              </span>
                            </td>
                            <td>{row.placed_students}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: '10px', background: '#e2e8f0', minWidth: '60px' }}>
                                  <div className="progress-bar"
                                    style={{ width: `${pct}%`, background: pct >= 60 ? '#10b981' : pct >= 30 ? '#f59e0b' : '#f43f5e', borderRadius: '10px' }} />
                                </div>
                                <span className="fw-semibold" style={{ fontSize: '0.82rem', minWidth: '36px' }}>{pct}%</span>
                              </div>
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
        </div>

      </div>
    </div>
  );
};

export default PlacementAnalytics;
