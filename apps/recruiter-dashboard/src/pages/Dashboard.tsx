import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  OPEN:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-500 border-slate-200',
  DRAFT:  'bg-amber-50 text-amber-700 border-amber-200',
};

const STAGE_COLORS: Record<string, string> = {
  APPLIED:   'bg-slate-100 text-slate-600 border-slate-200',
  SCREENING: 'bg-blue-50 text-blue-700 border-blue-200',
  INTERVIEW: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  OFFER:     'bg-purple-50 text-purple-700 border-purple-200',
  HIRED:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED:  'bg-red-50 text-red-600 border-red-200',
};

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function Dashboard() {
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    apiClient.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (error) return (
    <div className="p-8">
      <div className="max-w-md bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="font-semibold text-red-800 mb-1">Connection error</p>
        <p className="text-sm text-red-600">{error}</p>
        <p className="text-xs text-red-400 mt-2">Make sure the backend is running on localhost:5000</p>
      </div>
    </div>
  );

  const metrics = [
    { label: 'Total Jobs',  value: stats?.totalJobs ?? 0,       icon: '◈', color: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-700' },
    { label: 'Open Jobs',   value: stats?.openJobs ?? 0,        icon: '◉', color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Candidates',  value: stats?.totalCandidates ?? 0, icon: '◆', color: 'bg-violet-500', light: 'bg-violet-50 text-violet-700' },
    { label: 'Hired',       value: stats?.hiredCandidates ?? 0, icon: '★', color: 'bg-amber-500', light: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon, color, light }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</span>
              <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                {icon}
              </div>
            </div>
            {loading
              ? <Skeleton className="h-8 w-16 mb-1" />
              : <p className="text-3xl font-black text-slate-900">{value}</p>
            }
            <div className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium border ${light}`}>
              {loading ? '—' : value === 0 ? 'None yet' : 'Active'}
            </div>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="font-bold text-slate-900">Recent Jobs</h2>
            <Link to="/jobs" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold">View all →</Link>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="space-y-2 p-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : !stats?.recentJobs?.length ? (
              <div className="text-center py-10 text-slate-400">
                <p className="text-3xl mb-2">💼</p>
                <p className="text-sm font-medium">No jobs yet</p>
                <Link to="/jobs" className="text-xs text-indigo-600 mt-1 inline-block">Post your first job →</Link>
              </div>
            ) : (
              <div className="space-y-1">
                {stats.recentJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{job.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {job.department} · {job.location}
                        {job._count?.candidates > 0 &&
                          <span className="text-indigo-500 ml-1.5">· {job._count.candidates} candidates</span>
                        }
                      </p>
                    </div>
                    <span className={`ml-3 flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[job.status] ?? STATUS_COLORS.OPEN}`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Candidates */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="font-bold text-slate-900">Top AI-Scored Candidates</h2>
            <Link to="/candidates" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold">View all →</Link>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="space-y-2 p-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : !stats?.topCandidates?.length ? (
              <div className="text-center py-10 text-slate-400">
                <p className="text-3xl mb-2">🤖</p>
                <p className="text-sm font-medium">No scored candidates yet</p>
                <Link to="/ai-tools" className="text-xs text-indigo-600 mt-1 inline-block">Run AI scoring →</Link>
              </div>
            ) : (
              <div className="space-y-1">
                {stats.topCandidates.map((c: any) => {
                  const score = c.matchScore;
                  const bar = score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-red-400';
                  const badge = score >= 85
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : score >= 60
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-600 border-red-200';
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[80px]">
                            <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${score}%` }} />
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge}`}>{score}%</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${STAGE_COLORS[c.status] ?? STAGE_COLORS.APPLIED}`}>
                        {c.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/jobs',       icon: '◈', label: 'Post a Job',        sub: 'Add new position',          bg: 'hover:bg-indigo-50 hover:border-indigo-200' },
          { to: '/candidates', icon: '◉', label: 'Add Candidate',     sub: 'Manage pipeline',           bg: 'hover:bg-violet-50 hover:border-violet-200' },
          { to: '/ai-tools',   icon: '◆', label: 'Parse Resume',      sub: 'AI extraction',             bg: 'hover:bg-emerald-50 hover:border-emerald-200' },
          { to: '/ai-tools',   icon: '✉', label: 'Generate Email',    sub: 'Interview / rejection',     bg: 'hover:bg-amber-50 hover:border-amber-200' },
        ].map(({ to, icon, label, sub, bg }) => (
          <Link key={label} to={to}
            className={`bg-white border border-slate-100 rounded-2xl p-4 shadow-card transition-all ${bg} group`}>
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform inline-block">{icon}</div>
            <p className="font-semibold text-slate-800 text-sm">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
