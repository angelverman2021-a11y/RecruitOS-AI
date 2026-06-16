import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export function Jobs() {
  const [jobs, setJobs]           = useState<any[]>([]);
  const [title, setTitle]         = useState('');
  const [department, setDept]     = useState('');
  const [location, setLocation]   = useState('');
  const [description, setDesc]    = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try { setLoading(true); const r = await apiClient.get('/jobs'); setJobs(r.data); }
    catch { console.error('Failed to fetch jobs'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await apiClient.post('/jobs', { title, department, location, description });
      setTitle(''); setDept(''); setLocation(''); setDesc(''); setShowForm(false);
      fetchJobs();
    } catch (err: any) { setError(err.response?.data?.error || 'Failed to create job'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job and all its candidates?')) return;
    try { await apiClient.delete(`/jobs/${id}`); fetchJobs(); }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to delete'); }
  };

  const inp = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 transition-all';

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{jobs.length} position{jobs.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="btn-press flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          {showForm ? '✕ Cancel' : '+ Post a Job'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-6 fade-in">
          <h2 className="font-bold text-slate-900 mb-4">New Job Posting</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className={inp} placeholder="Job Title *" required value={title} onChange={e => setTitle(e.target.value)} />
              <input className={inp} placeholder="Department *" required value={department} onChange={e => setDept(e.target.value)} />
              <input className={inp} placeholder="Location *" required value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <textarea className={`${inp} resize-none`} rows={4} required
              placeholder="Job Description — be detailed, AI uses this for candidate scoring *"
              value={description} onChange={e => setDesc(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="btn-press bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-sm text-sm">
                {submitting ? 'Creating...' : 'Create Job'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2.5 rounded-xl hover:bg-slate-100 text-sm transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">💼</p>
          <p className="font-semibold text-slate-700 text-lg">No jobs yet</p>
          <p className="text-slate-400 text-sm mt-1">Post your first job to start building your pipeline</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all">
            + Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id}
              className="bg-white border border-slate-100 rounded-2xl shadow-card hover:shadow-card-hover transition-all p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>{job.status}</span>
                    {job._count?.candidates > 0 && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {job._count.candidates} candidate{job._count.candidates !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-2.5">
                    🏢 <span className="font-medium text-slate-700">{job.department}</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    📍 {job.location}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                </div>
                <button onClick={() => handleDelete(job.id)}
                  className="flex-shrink-0 text-xs text-red-400 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
