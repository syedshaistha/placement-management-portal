// frontend/src/pages/admin/PlacementAnalytics.jsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, ArcElement,
  Title, Tooltip, Legend,
  defaults,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../../utils/api';
import './PlacementAnalytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
defaults.font.family = "'Inter', system-ui, sans-serif";

/* ── Brand palette (matches globals) ── */
const C = {
  indigo:  '#4f62d4',
  teal:    '#0d9488',
  amber:   '#d97706',
  violet:  '#7c3aed',
  rose:    '#e11d48',
  green:   '#059669',
  sky:     '#0ea5e9',
  slate:   '#64748b',
};

const STATUS_COLORS = {
  'Applied':      C.indigo,
  'Under Review': C.amber,
  'Shortlisted':  C.teal,
  'Selected':     C.violet,
  'Rejected':     C.rose,
};

const BRANCH_PALETTE = [
  C.indigo, C.teal, C.amber, C.rose, C.violet, C.green, C.sky, '#f97316',
];

/* ── Shared chart options ── */
const baseTooltip = {
  backgroundColor: '#fff',
  titleColor: '#0f172a',
  bodyColor: '#475569',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  boxShadow: '0 4px 16px rgba(15,23,42,0.12)',
  titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: '700' },
  bodyFont: { family: "'Inter', sans-serif", size: 12 },
};

const barOpts = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title:  { display: false },
    tooltip: { ...baseTooltip },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 }, maxRotation: 35, minRotation: 0 },
      border: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9', lineWidth: 1 },
      ticks: { color: '#94a3b8', font: { size: 11 }, precision: 0 },
      border: { display: false, dash: [3, 3] },
    },
  },
});

const doughnutOpts = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#475569',
        font: { size: 11, family: "'Inter', sans-serif" },
        padding: 14,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: { ...baseTooltip },
  },
};

/* ── Sub-components ── */
const StatCard = ({ icon, label, value, color, sub, subColor }) => (
  <div className="col-sm-6 col-xl-3">
    <div className="card stat-card h-100" style={{ '--stat-top-color': color }}>
      <div className="card-body">
        <div className="stat-icon" style={{ background: `${color}14` }}>
          <span>{icon}</span>
        </div>
        <div className="stat-value" style={{ color }}>{value ?? '—'}</div>
        <p className="stat-label">{label}</p>
        {sub && <p className="stat-sub" style={{ color: subColor || '#94a3b8' }}>{sub}</p>}
      </div>
    </div>
  </div>
);

const EmptyChart = ({ message }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 200, color: '#94a3b8', fontSize: '0.85rem', flexDirection: 'column', gap: 8,
  }}>
    <span style={{ fontSize: '2rem', opacity: 0.35 }}>📊</span>
    {message || 'No data available'}
  </div>
);

/* ── Main component ── */
const PlacementAnalytics = () => {
  const [overview,    setOverview]    = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [statusData,  setStatusData]  = useState([]);
  const [branchData,  setBranchData]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

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
        setError('Failed to load analytics data. Ensure you are logged in as admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ── Company-wise bar chart ── */
  const companyChartData = companyData.length ? {
    labels: companyData.map(d => d.company_name),
    datasets: [
      {
        label: 'Total Applications',
        data: companyData.map(d => d.total_applications),
        backgroundColor: `${C.indigo}cc`,
        borderColor: C.indigo,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Selected',
        data: companyData.map(d => d.selected),
        backgroundColor: `${C.teal}cc`,
        borderColor: C.teal,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  } : null;

  /* ── Status doughnut ── */
  const statusChartData = statusData.length ? {
    labels: statusData.map(d => d.status),
    datasets: [{
      data: statusData.map(d => d.count),
      backgroundColor: statusData.map(d => STATUS_COLORS[d.status] || C.slate),
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  } : null;

  /* ── Branch doughnut ── */
  const branchChartData = branchData.length ? {
    labels: branchData.map(d => d.branch),
    datasets: [{
      data: branchData.map(d => d.total_applications),
      backgroundColor: branchData.map((_, i) => BRANCH_PALETTE[i % BRANCH_PALETTE.length]),
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  } : null;

  if (loading) return (
    <div className="analytics-spinner">
      <div className="ph-spinner" />
      <span className="ph-loading-text">Loading analytics…</span>
    </div>
  );

  if (error) return (
    <div className="analytics-page">
      <div className="analytics-header"><div className="container analytics-header-inner">
        <h4>📊 Placement Analytics</h4>
      </div></div>
      <div className="container py-5 text-center" style={{ color: '#94a3b8' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 14, opacity: 0.4 }}>⚠️</div>
        {error}
      </div>
    </div>
  );

  const totalApps    = overview?.total_applications  ?? 0;
  const totalSelected = overview?.total_selected     ?? 0;
  const placementRate = overview?.placement_rate     ?? 0;

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">
        <div className="container analytics-header-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h4>📊 Placement Analytics</h4>
              <p>Real-time placement statistics and performance overview</p>
            </div>
            <div style={{
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 600,
            }}>
              🔄 Live Data
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* ── Stat cards ── */}
        <div className="row g-3 mb-4">
          <StatCard
            icon="👥" label="Total Students"
            value={overview?.total_students}
            color={C.indigo}
          />
          <StatCard
            icon="🏢" label="Companies Visiting"
            value={overview?.total_companies}
            color={C.teal}
          />
          <StatCard
            icon="📋" label="Total Applications"
            value={totalApps}
            color={C.amber}
          />
          <StatCard
            icon="🏆" label="Students Selected"
            value={totalSelected}
            color={C.violet}
            sub={`${placementRate}% placement rate`}
            subColor={placementRate >= 70 ? C.green : C.amber}
          />
        </div>

        {/* ── Row 2: Company bar + Status doughnut ── */}
        <div className="row g-3 mb-3">

          {/* Company-wise bar */}
          <div className="col-lg-7">
            <div className="chart-card">
              <div className="card-header">
                <h6>Applications by Company</h6>
                <span>Total vs Selected</span>
              </div>
              <div className="card-body">
                <div className="chart-wrapper" style={{ height: 280 }}>
                  {companyChartData ? (
                    <Bar
                      data={companyChartData}
                      options={{
                        ...barOpts(),
                        plugins: {
                          ...barOpts().plugins,
                          legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                              color: '#475569',
                              font: { size: 11, family: "'Inter', sans-serif" },
                              usePointStyle: true,
                              padding: 14,
                              pointStyleWidth: 8,
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <EmptyChart message="No company data available" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status doughnut */}
          <div className="col-lg-5">
            <div className="chart-card">
              <div className="card-header">
                <h6>Status Distribution</h6>
                <span>{totalApps} total</span>
              </div>
              <div className="card-body">
                <div className="chart-wrapper" style={{ height: 280 }}>
                  {statusChartData ? (
                    <Doughnut data={statusChartData} options={doughnutOpts} />
                  ) : (
                    <EmptyChart message="No application data" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Placement rate + Branch breakdown ── */}
        <div className="row g-3 mb-3">

          {/* Placement rate highlight */}
          <div className="col-lg-4">
            <div className="chart-card h-100">
              <div className="card-header">
                <h6>Overall Placement Rate</h6>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
                {/* Circular rate display */}
                <div style={{
                  width: 140, height: 140,
                  borderRadius: '50%',
                  background: `conic-gradient(${placementRate >= 70 ? C.green : placementRate >= 40 ? C.amber : C.rose} ${placementRate * 3.6}deg, #f1f5f9 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  position: 'relative',
                }}>
                  <div style={{
                    width: 108, height: 108,
                    borderRadius: '50%', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <div className="rate-badge" style={{
                      color: placementRate >= 70 ? C.green : placementRate >= 40 ? C.amber : C.rose,
                    }}>
                      {placementRate}%
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>
                      placed
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600, marginBottom: 4 }}>
                    {totalSelected} of {overview?.total_students ?? 0} students
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>received job offers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Branch-wise table */}
          <div className="col-lg-8">
            <div className="chart-card h-100">
              <div className="card-header">
                <h6>Branch-wise Placement Summary</h6>
                <span>{branchData.length} branches</span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {branchData.length === 0 ? (
                  <EmptyChart message="No branch data available" />
                ) : (
                  <table className="branch-table">
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 20 }}>Branch</th>
                        <th style={{ textAlign: 'center' }}>Applied</th>
                        <th style={{ textAlign: 'center' }}>Selected</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchData.map((row, idx) => {
                        const rate = row.total_applications > 0
                          ? Math.round((row.selected / row.total_applications) * 100)
                          : 0;
                        const rateColor = rate >= 70 ? C.green : rate >= 40 ? C.amber : '#94a3b8';
                        return (
                          <tr key={row.branch}>
                            <td style={{ paddingLeft: 20 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{
                                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                  background: BRANCH_PALETTE[idx % BRANCH_PALETTE.length],
                                  display: 'inline-block',
                                }} />
                                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>{row.branch}</span>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: C.indigo }}>
                              {row.total_applications}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: C.teal }}>
                              {row.selected}
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                  flex: 1, height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden',
                                  maxWidth: 80,
                                }}>
                                  <div style={{
                                    height: '100%', borderRadius: 99,
                                    width: `${rate}%`,
                                    background: rateColor,
                                    transition: 'width 0.6s ease',
                                  }} />
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: rateColor, minWidth: 36 }}>
                                  {rate}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 4: Branch doughnut ── */}
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="chart-card">
              <div className="card-header">
                <h6>Applications by Branch</h6>
                <span>Distribution</span>
              </div>
              <div className="card-body">
                <div className="chart-wrapper" style={{ height: 300 }}>
                  {branchChartData ? (
                    <Doughnut data={branchChartData} options={doughnutOpts} />
                  ) : (
                    <EmptyChart message="No branch data available" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top companies by package */}
          <div className="col-lg-7">
            <div className="chart-card h-100">
              <div className="card-header">
                <h6>Top Companies by Applicants</h6>
                <span>Ranked list</span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {companyData.length === 0 ? (
                  <EmptyChart message="No company data available" />
                ) : (
                  <table className="branch-table">
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 20, width: 40 }}>#</th>
                        <th>Company</th>
                        <th style={{ textAlign: 'center' }}>Applied</th>
                        <th style={{ textAlign: 'center' }}>Selected</th>
                        <th style={{ textAlign: 'right', paddingRight: 20 }}>Package</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...companyData]
                        .sort((a, b) => b.total_applications - a.total_applications)
                        .slice(0, 7)
                        .map((row, idx) => (
                          <tr key={row.company_name}>
                            <td style={{ paddingLeft: 20, color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem' }}>
                              {idx + 1}
                            </td>
                            <td style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                              {row.company_name}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: C.indigo }}>
                              {row.total_applications}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: C.teal }}>
                              {row.selected}
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: 20 }}>
                              <span style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 800, color: C.violet, fontSize: '0.875rem',
                              }}>
                                ₹{row.package ?? '—'} LPA
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacementAnalytics;
