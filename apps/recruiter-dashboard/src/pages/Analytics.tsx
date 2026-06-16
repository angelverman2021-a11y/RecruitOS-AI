import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';
import {
  Chart, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
  BarController, LineController
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler, BarController, LineController);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS  = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];

function useChart(ref: React.RefObject<HTMLCanvasElement | null>, build: () => any, deps: any[]) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, build());
    return () => chart.destroy();
  }, deps);
}

function StatBadge({ label, value, change, prefix = '', suffix = '' }:
  { label: string; value: string|number; change: number; prefix?: string; suffix?: string }) {
  const up = change >= 0;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</p>
      <p className={`text-xs font-semibold mt-1 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
        {up ? '▲' : '▼'} {Math.abs(change)}% vs last year
      </p>
    </div>
  );
}

// ── Demand Trend Line Chart ──────────────────────────────────────────────────
function DemandChart({ data }: { data: any[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useChart(ref, () => ({
    type: 'line',
    data: {
      labels: data.map(d => d.year),
      datasets: [{
        label: 'Demand Index',
        data: data.map(d => d.avgDemand),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.08)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => ` Demand: ${c.raw}/100` } } },
      scales: {
        y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  }), [data]);
  return <canvas ref={ref} />;
}

// ── Job Postings Bar Chart ───────────────────────────────────────────────────
function PostingsChart({ data }: { data: any[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useChart(ref, () => ({
    type: 'bar',
    data: {
      labels: data.map(d => d.year),
      datasets: [{
        label: 'Total Job Postings',
        data: data.map(d => d.totalPostings),
        backgroundColor: data.map((_, i) => i === data.length - 1 ? '#6366f1' : 'rgba(99,102,241,0.3)'),
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => ` ${c.raw.toLocaleString()} postings` } } },
      scales: {
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 }, callback: (v: any) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  }), [data]);
  return <canvas ref={ref} />;
}

// ── Salary Trend Line Chart ──────────────────────────────────────────────────
function SalaryChart({ data }: { data: any[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useChart(ref, () => ({
    type: 'line',
    data: {
      labels: data.map(d => d.year),
      datasets: [{
        label: 'Avg Salary (USD)',
        data: data.map(d => d.avgSalary),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => ` $${c.raw.toLocaleString()}` } } },
      scales: {
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 }, callback: (v: any) => `$${(v/1000).toFixed(0)}k` } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  }), [data]);
  return <canvas ref={ref} />;
}

// ── Monthly Postings Chart ───────────────────────────────────────────────────
function MonthlyChart({ data }: { data: any[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useChart(ref, () => ({
    type: 'bar',
    data: {
      labels: data.map(d => MONTHS[d.month - 1]),
      datasets: [{
        label: 'Job Postings',
        data: data.map(d => d.jobPostings),
        backgroundColor: 'rgba(99,102,241,0.6)',
        borderRadius: 5,
        borderSkipped: false,
      }, {
        label: 'Demand Index',
        data: data.map(d => d.demandIndex * 60),
        type: 'line' as any,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        yAxisID: 'y1',
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } },
      scales: {
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, callback: (v: any) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v } },
        y1: { display: false },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    },
  }), [data]);
  return <canvas ref={ref} />;
}

// ── Compare Multi-role Chart ─────────────────────────────────────────────────
function CompareChart({ data }: { data: any[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const years = data[0]?.yearlyTrend.map((y: any) => y.year) ?? [];
  useChart(ref, () => ({
    type: 'line',
    data: {
      labels: years,
      datasets: data.map((r, i) => ({
        label: r.role,
        data: r.yearlyTrend.map((y: any) => y.avgDemand),
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 4,
      })),
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 16 } } },
      scales: {
        y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  }), [data]);
  return <canvas ref={ref} />;
}

// ── Main Analytics Page ──────────────────────────────────────────────────────
export function Analytics() {
  const [roles, setRoles]           = useState<string[]>([]);
  const [selectedRole, setRole]     = useState('');
  const [data, setData]             = useState<any>(null);
  const [loading, setLoading]       = useState(false);
  const [compareMode, setCompare]   = useState(false);
  const [compareRoles, setCompRoles]= useState<string[]>([]);
  const [compareData, setCompData]  = useState<any[]>([]);
  const [compLoading, setCompLoad]  = useState(false);

  useEffect(() => {
    apiClient.get('/analytics/roles').then(r => {
      setRoles(r.data);
      if (r.data.length) { setRole(r.data[0]); }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedRole) return;
    setLoading(true); setData(null);
    apiClient.get(`/analytics/roles/${encodeURIComponent(selectedRole)}`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRole]);

  const runCompare = async () => {
    if (compareRoles.length < 2) return;
    setCompLoad(true);
    try {
      const r = await apiClient.get(`/analytics/compare?roles=${compareRoles.map(encodeURIComponent).join(',')}`);
      setCompData(r.data);
    } catch { console.error('compare failed'); }
    finally { setCompLoad(false); }
  };

  const toggleCompareRole = (role: string) => {
    setCompRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header + Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[220px]"
          value={selectedRole} onChange={e => setRole(e.target.value)}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={() => { setCompare(v => !v); setCompData([]); setCompRoles([]); }}
          className={`btn-press text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${compareMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'}`}>
          ⚡ Compare Roles
        </button>
        {compareMode && (
          <button onClick={runCompare} disabled={compareRoles.length < 2 || compLoading}
            className="btn-press text-sm font-semibold px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-all">
            {compLoading ? 'Comparing...' : `Compare ${compareRoles.length} roles`}
          </button>
        )}
      </div>

      {/* Compare role picker */}
      {compareMode && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card">
          <p className="text-sm font-semibold text-slate-700 mb-3">Select 2–4 roles to compare demand over time:</p>
          <div className="flex flex-wrap gap-2">
            {roles.map(r => (
              <button key={r} onClick={() => toggleCompareRole(r)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${compareRoles.includes(r) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compare chart */}
      {compareMode && compareData.length >= 2 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
          <h3 className="font-bold text-slate-900 mb-1">Demand Index Comparison (2019–2024)</h3>
          <p className="text-xs text-slate-400 mb-4">Higher = more job market demand for that role</p>
          <div className="h-64"><CompareChart data={compareData} /></div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      )}

      {/* Main data */}
      {!loading && data && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBadge label="Demand Index" value={`${data.summary.currentDemandIndex}/100`} change={data.summary.demandChange} />
            <StatBadge label="Avg Salary" value={`$${Math.round(data.summary.currentAvgSalary / 1000)}k`} change={data.summary.salaryChange} />
            <StatBadge label="Job Postings" value={data.summary.currentPostings.toLocaleString()} change={data.summary.postingsChange} suffix="/yr" />
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 shadow-card text-white">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Role</p>
              <p className="text-lg font-black leading-tight">{data.role}</p>
              <p className="text-xs opacity-70 mt-1">Data: 2019 – {data.summary.latestYear}</p>
            </div>
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-0.5">Demand Trend</h3>
              <p className="text-xs text-slate-400 mb-4">Demand index (0–100) year over year</p>
              <div className="h-52"><DemandChart data={data.yearlyTrend} /></div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-0.5">Job Postings Volume</h3>
              <p className="text-xs text-slate-400 mb-4">Total annual job postings</p>
              <div className="h-52"><PostingsChart data={data.yearlyTrend} /></div>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-0.5">Salary Trend</h3>
              <p className="text-xs text-slate-400 mb-4">Average annual salary in USD</p>
              <div className="h-52"><SalaryChart data={data.salaryTrend} /></div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-0.5">Monthly Hiring Pattern ({data.summary.latestYear})</h3>
              <p className="text-xs text-slate-400 mb-4">Postings by month — spot hiring seasons</p>
              <div className="h-52"><MonthlyChart data={data.monthlyLatest} /></div>
            </div>
          </div>

          {/* Skills + Companies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-4">🔧 Most Required Skills</h3>
              <div className="space-y-2.5">
                {data.topSkills.map((skill: string, i: number) => (
                  <div key={skill} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{skill}</span>
                        <span className="text-xs text-slate-400">{100 - i * 10}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${100 - i * 10}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-4">🏢 Top Hiring Companies</h3>
              <div className="grid grid-cols-2 gap-2">
                {data.topCompanies.map((company: string, i: number) => (
                  <div key={company} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}>
                      {company[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">{company}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
