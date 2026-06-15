import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/jobs');
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/jobs', { title, department, location, description });
      setTitle(''); setDepartment(''); setLocation(''); setDescription('');
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create job');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job and all its candidates?')) return;
    try {
      await apiClient.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete job');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-indigo-900">Jobs Management</h1>

      {/* Create Form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Post a New Job</h2>
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
        )}
        <form className="space-y-4" onSubmit={handleCreateJob}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text" placeholder="Job Title" required
              className="border border-gray-300 p-2.5 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={title} onChange={e => setTitle(e.target.value)}
            />
            <input
              type="text" placeholder="Department" required
              className="border border-gray-300 p-2.5 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={department} onChange={e => setDepartment(e.target.value)}
            />
            <input
              type="text" placeholder="Location" required
              className="border border-gray-300 p-2.5 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={location} onChange={e => setLocation(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Job Description (be detailed — AI uses this for scoring)" required rows={4}
            className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={description} onChange={e => setDescription(e.target.value)}
          />
          <button type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
            + Create Job
          </button>
        </form>
      </div>

      {/* Jobs List */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          All Positions <span className="text-gray-400 font-normal text-sm">({jobs.length})</span>
        </h2>
        {loading ? (
          <p className="text-gray-400 italic">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
            <p className="text-lg">No jobs yet.</p>
            <p className="text-sm mt-1">Create your first job posting above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                        job.status === 'OPEN'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>{job.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      🏢 {job.department} &nbsp;·&nbsp; 📍 {job.location}
                      {job._count?.candidates != null && (
                        <span className="ml-3 text-indigo-600 font-medium">
                          👥 {job._count.candidates} candidate{job._count.candidates !== 1 ? 's' : ''}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="ml-4 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
