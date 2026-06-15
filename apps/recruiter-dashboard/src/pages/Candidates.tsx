import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const;
type Stage = typeof STAGES[number];

const STAGE_COLORS: Record<Stage, { bg: string; border: string; header: string; badge: string }> = {
  APPLIED:   { bg: 'bg-gray-50',   border: 'border-gray-300',  header: 'bg-gray-100',   badge: 'bg-gray-200 text-gray-700' },
  SCREENING: { bg: 'bg-blue-50',   border: 'border-blue-200',  header: 'bg-blue-100',   badge: 'bg-blue-200 text-blue-800' },
  INTERVIEW: { bg: 'bg-yellow-50', border: 'border-yellow-200',header: 'bg-yellow-100', badge: 'bg-yellow-200 text-yellow-800' },
  OFFER:     { bg: 'bg-purple-50', border: 'border-purple-200',header: 'bg-purple-100', badge: 'bg-purple-200 text-purple-800' },
  HIRED:     { bg: 'bg-green-50',  border: 'border-green-200', header: 'bg-green-100',  badge: 'bg-green-200 text-green-800' },
  REJECTED:  { bg: 'bg-red-50',    border: 'border-red-200',   header: 'bg-red-100',    badge: 'bg-red-200 text-red-700' },
};

function ScoreBadge({ score }: { score: number }) {
  if (score === 0) return <span className="text-xs text-gray-400 italic">Not scored</span>;
  const color =
    score >= 85 ? 'bg-green-100 text-green-800 border-green-200' :
    score >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-red-100 text-red-700 border-red-200';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {score}% match
    </span>
  );
}

interface EmailPreview {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  matchScore: number;
  emailType: 'INTERVIEW_INVITATION' | 'REJECTION';
  subject: string;
  body: string;
}

export function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingScore, setLoadingScore] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [emailPreview, setEmailPreview] = useState<EmailPreview | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [jobId, setJobId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candRes, jobRes] = await Promise.all([
        apiClient.get('/candidates'),
        apiClient.get('/jobs'),
      ]);
      setCandidates(candRes.data);
      setJobs(jobRes.data);
      if (jobRes.data.length > 0 && !jobId) setJobId(jobRes.data[0].id);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleParseResume = async () => {
    if (!resumeText.trim()) return;
    setIsParsing(true);
    setFormError('');
    try {
      const res = await apiClient.post('/ai/parse-resume', { resumeText });
      const { skills: parsedSkills, experience: parsedExp, location: parsedLoc } = res.data;
      if (parsedSkills) setSkills(parsedSkills);
      if (parsedExp) setExperience(parsedExp);
      if (parsedLoc) setLocation(parsedLoc);
    } catch (err: any) {
      setFormError('Resume parsing failed. Please fill in skills manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      await apiClient.post('/candidates', { name, email, skills, experience, location, jobId });
      setName(''); setEmail(''); setSkills(''); setExperience(''); setLocation(''); setResumeText('');
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to add candidate');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/candidates/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleScore = async (candidate: any) => {
    setLoadingScore(candidate.id);
    try {
      await apiClient.post('/ai/score', { candidateId: candidate.id, jobId: candidate.jobId });
      fetchData();
    } catch (err) {
      console.error('Scoring failed', err);
    } finally {
      setLoadingScore(null);
    }
  };

  const handleGenerateEmail = async (candidate: any) => {
    setLoadingEmail(candidate.id);
    try {
      const res = await apiClient.post('/ai/generate-email', { candidateId: candidate.id });
      setEmailPreview(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Email generation failed');
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900 flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-indigo-900 shrink-0">Candidates Pipeline</h1>

      {/* Add Candidate Form */}
      <div className="border border-gray-300 p-6 bg-white rounded-lg shadow-sm mb-6 shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Candidate</h2>
        {formError && (
          <div className="border border-red-200 bg-red-50 text-red-700 p-2 rounded mb-4 text-sm">{formError}</div>
        )}
        <form onSubmit={handleAddCandidate} className="space-y-4">
          {/* Basic info row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Full Name" required
              className="border p-2 bg-gray-100 text-black placeholder-gray-500 rounded"
              value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email Address" required
              className="border p-2 bg-gray-100 text-black placeholder-gray-500 rounded"
              value={email} onChange={e => setEmail(e.target.value)} />
            <select required className="border p-2 bg-gray-100 text-black rounded"
              value={jobId} onChange={e => setJobId(e.target.value)}>
              {jobs.length === 0 && <option value="">No jobs available</option>}
              {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
            </select>
          </div>

          {/* Resume Paste — Phase 3 */}
          <div className="border border-dashed border-indigo-300 rounded-lg p-4 bg-indigo-50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-indigo-800">
                📄 AI Resume Parser — Paste resume text to auto-fill skills
              </label>
              <button type="button" onClick={handleParseResume}
                disabled={isParsing || !resumeText.trim()}
                className="text-xs border border-indigo-400 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold">
                {isParsing ? '⏳ Parsing...' : '✨ Parse with AI'}
              </button>
            </div>
            <textarea rows={3} placeholder="Paste resume text here and click 'Parse with AI'..."
              className="w-full border p-2 bg-white text-black placeholder-gray-400 rounded text-sm"
              value={resumeText} onChange={e => setResumeText(e.target.value)} />
          </div>

          {/* Auto-filled or manual skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Skills (comma separated)" required
              className="border p-2 bg-gray-100 text-black placeholder-gray-500 rounded"
              value={skills} onChange={e => setSkills(e.target.value)} />
            <input type="text" placeholder="Experience (e.g. 5 years)"
              className="border p-2 bg-gray-100 text-black placeholder-gray-500 rounded"
              value={experience} onChange={e => setExperience(e.target.value)} />
            <input type="text" placeholder="Location"
              className="border p-2 bg-gray-100 text-black placeholder-gray-500 rounded"
              value={location} onChange={e => setLocation(e.target.value)} />
          </div>

          <button type="submit"
            className="border border-indigo-300 bg-indigo-600 text-white font-bold px-6 py-2 rounded hover:bg-indigo-700">
            Add Candidate
          </button>
        </form>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4 h-full items-start">
          {STAGES.map(stage => {
            const colors = STAGE_COLORS[stage];
            const stageCandidates = candidates.filter(c => c.status === stage);
            return (
              <div key={stage}
                className={`w-80 border ${colors.border} ${colors.bg} rounded-lg shadow-sm flex flex-col max-h-[65vh]`}>
                <div className={`p-3 border-b ${colors.border} ${colors.header} rounded-t-lg flex justify-between items-center`}>
                  <h3 className="font-bold text-gray-800 text-sm">{stage}</h3>
                  <span className={`${colors.badge} px-2 py-0.5 rounded-full text-xs font-bold`}>
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {stageCandidates.map(candidate => (
                    <div key={candidate.id}
                      className="border border-gray-200 p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{candidate.name}</h4>
                        <ScoreBadge score={candidate.matchScore} />
                      </div>
                      <p className="text-xs text-indigo-600 font-medium mb-1 truncate">
                        {candidate.job?.title || 'Unknown Job'}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">{candidate.email}</p>
                      {candidate.location && (
                        <p className="text-xs text-gray-400 mb-1">📍 {candidate.location}</p>
                      )}
                      {candidate.experience && (
                        <p className="text-xs text-gray-400 mb-1">🗂 {candidate.experience}</p>
                      )}
                      <p className="text-xs text-gray-500 bg-gray-50 p-1 rounded truncate border border-gray-200 mb-3">
                        {candidate.skills}
                      </p>

                      {/* Stage selector */}
                      <select
                        className="text-xs border border-gray-300 bg-gray-50 text-gray-700 p-1 rounded w-full mb-2"
                        value={candidate.status}
                        onChange={(e) => updateStatus(candidate.id, e.target.value)}>
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>

                      {/* AI Actions */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleScore(candidate)}
                          disabled={loadingScore === candidate.id}
                          className="flex-1 text-xs border border-indigo-200 bg-indigo-50 text-indigo-700 p-1 rounded hover:bg-indigo-100 disabled:opacity-50 font-medium">
                          {loadingScore === candidate.id ? '⏳' : '🤖'} Score
                        </button>
                        <button
                          onClick={() => handleGenerateEmail(candidate)}
                          disabled={loadingEmail === candidate.id || candidate.matchScore === 0}
                          title={candidate.matchScore === 0 ? 'Score candidate first' : 'Generate AI email'}
                          className="flex-1 text-xs border border-green-200 bg-green-50 text-green-700 p-1 rounded hover:bg-green-100 disabled:opacity-50 font-medium">
                          {loadingEmail === candidate.id ? '⏳' : '✉️'} Email
                        </button>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <p className="text-center text-xs text-gray-400 italic py-4">No candidates</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Preview Modal — Phase 4 */}
      {emailPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className={`p-4 rounded-t-xl flex items-center justify-between ${
              emailPreview.emailType === 'INTERVIEW_INVITATION'
                ? 'bg-green-100 border-b border-green-200'
                : 'bg-red-50 border-b border-red-200'
            }`}>
              <div>
                <h2 className="font-bold text-lg text-gray-900">
                  {emailPreview.emailType === 'INTERVIEW_INVITATION' ? '🎉 Interview Invitation' : '📋 Rejection Email'}
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  For <span className="font-semibold">{emailPreview.candidateName}</span>
                  {' · '}
                  <ScoreBadge score={emailPreview.matchScore} />
                </p>
              </div>
              <button onClick={() => setEmailPreview(null)}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold">✕</button>
            </div>

            {/* Modal body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">To</label>
                <p className="text-sm text-gray-800 mt-1">{emailPreview.candidateEmail}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                <p className="text-sm font-semibold text-gray-900 mt-1 border border-gray-200 p-2 rounded bg-gray-50">
                  {emailPreview.subject}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Body</label>
                <div className="text-sm text-gray-800 mt-1 border border-gray-200 p-3 rounded bg-gray-50 whitespace-pre-wrap leading-relaxed">
                  {emailPreview.body}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-xs text-gray-400 italic">
                ⚠️ Review before sending — this is AI-generated content
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Subject: ${emailPreview.subject}\n\n${emailPreview.body}`);
                  }}
                  className="text-sm border border-indigo-300 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-50 font-medium">
                  📋 Copy
                </button>
                <button onClick={() => setEmailPreview(null)}
                  className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 font-medium">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
