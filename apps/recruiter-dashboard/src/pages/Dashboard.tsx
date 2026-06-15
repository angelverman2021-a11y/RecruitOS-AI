import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard/stats');
        setStats(response.data);
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="p-6 flex items-center gap-2 text-gray-500">
      <span className="animate-spin">⏳</span> Loading dashboard...
    </div>
  );
  if (error) return (
    <div className="p-6">
      <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
        <p className="font-bold mb-1">Failed to load dashboard</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">Make sure the backend is running on <code className="bg-red-100 px-1 rounded">http://localhost:5000</code></p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-indigo-900">Dashboard Overview</h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Jobs"
          value={stats?.totalJobs ?? 0}
          color="blue"
          icon="💼"
        />
        <StatCard
          label="Open Jobs"
          value={stats?.openJobs ?? 0}
          color="green"
          icon="🟢"
        />
        <StatCard
          label="Total Candidates"
          value={stats?.totalCandidates ?? 0}
          color="indigo"
          icon="👥"
        />
        <StatCard
          label="Hired"
          value={stats?.hiredCandidates ?? 0}
          color="emerald"
          icon="🎉"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="border border-gray-300 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Job Postings</h2>
            <Link to="/jobs"
              className="text-sm border border-indigo-300 text-indigo-700 p-1 px-3 rounded hover:bg-indigo-50 font-medium">
              View All
            </Link>
          </div>
          {!stats?.recentJobs?.length ? (
            <p className="text-gray-400 italic text-sm p-4 bg-gray-50 rounded">No jobs posted yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recentJobs.map((job: any) => (
                <div key={job.id}
                  className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.department} · {job.location}
                      {job._count?.candidates != null && (
                        <span className="ml-2 text-indigo-600 font-medium">
                          {job._count.candidates} candidate{job._count.candidates !== 1 ? 's' : ''}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-1 rounded uppercase font-bold tracking-wide">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Scored Candidates */}
        <div className="border border-gray-300 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Top Scored Candidates</h2>
            <Link to="/candidates"
              className="text-sm border border-indigo-300 text-indigo-700 p-1 px-3 rounded hover:bg-indigo-50 font-medium">
              View All
            </Link>
          </div>
          {!stats?.topCandidates?.length ? (
            <p className="text-gray-400 italic text-sm p-4 bg-gray-50 rounded">
              No candidates scored yet. Add candidates and run AI scoring.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.topCandidates.map((c: any) => {
                const scoreColor =
                  c.matchScore >= 85 ? 'text-green-700 bg-green-50 border-green-200' :
                  c.matchScore >= 60 ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                                       'text-red-700 bg-red-50 border-red-200';
                return (
                  <div key={c.id}
                    className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{c.job?.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor}`}>
                        {c.matchScore}%
                      </span>
                      <span className="text-xs text-gray-400">{c.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const colors: Record<string, string> = {
    blue:    'border-blue-200 bg-blue-50 text-blue-900',
    green:   'border-green-200 bg-green-50 text-green-900',
    indigo:  'border-indigo-200 bg-indigo-50 text-indigo-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  };
  return (
    <div className={`border p-4 rounded-lg shadow-sm flex flex-col items-center justify-center ${colors[color] ?? colors.blue}`}>
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-3xl font-extrabold">{value}</span>
      <span className="text-xs font-bold uppercase tracking-wider mt-1 opacity-70">{label}</span>
    </div>
  );
}
