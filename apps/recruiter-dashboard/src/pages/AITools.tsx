import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

// ─── Resume Parser ────────────────────────────────────────────────────────────
function ResumeParser() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!resumeText.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await apiClient.post('/ai/parse-resume', { resumeText });
      setResult(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to parse resume');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📄</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Resume Parser</h2>
          <p className="text-sm text-gray-500">Paste any resume text — AI extracts skills, experience & location instantly</p>
        </div>
      </div>

      <textarea
        rows={8}
        placeholder="Paste resume text here...&#10;&#10;Example:&#10;John Doe | john@email.com | New York, NY&#10;&#10;EXPERIENCE&#10;Senior Software Engineer at TechCorp (2019–2024)&#10;- Built scalable React applications...&#10;&#10;SKILLS&#10;React, TypeScript, Node.js, AWS, PostgreSQL..."
        className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
        value={resumeText}
        onChange={e => setResumeText(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 p-2 rounded">{error}</p>}

      <button
        onClick={handleParse}
        disabled={loading || !resumeText.trim()}
        className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">
        {loading ? '⏳ Parsing...' : '✨ Parse Resume with AI'}
      </button>

      {result && (
        <div className="mt-4 border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
          <p className="font-semibold text-green-800 text-sm">✅ Resume parsed successfully!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-green-200 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Skills</p>
              <p className="text-sm text-gray-800">{result.skills || '—'}</p>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm text-gray-800">{result.experience || '—'}</p>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm text-gray-800">{result.location || '—'}</p>
            </div>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(`Skills: ${result.skills}\nExperience: ${result.experience}\nLocation: ${result.location}`)}
            className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50">
            📋 Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Email Generator ───────────────────────────────────────────────────────
function EmailGenerator({ candidates }: { candidates: any[] }) {
  const [candidateId, setCandidateId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const scoredCandidates = candidates.filter(c => c.matchScore > 0);

  const handleGenerate = async () => {
    if (!candidateId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await apiClient.post('/ai/generate-email', { candidateId });
      setResult(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to generate email');
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">✉️</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Email Generator</h2>
          <p className="text-sm text-gray-500">Auto-writes interview invitations (score ≥85%) or rejection emails (score &lt;60%)</p>
        </div>
      </div>

      {scoredCandidates.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          ⚠️ No scored candidates yet. Go to <strong>Candidates</strong> → add a candidate → click <strong>🤖 Score</strong> first.
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-4">
            <select
              className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={candidateId}
              onChange={e => { setCandidateId(e.target.value); setResult(null); }}>
              <option value="">— Select a scored candidate —</option>
              {scoredCandidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.job?.title} — Score: {c.matchScore}%
                  {c.matchScore >= 85 ? ' 🟢 Invite' : c.matchScore < 60 ? ' 🔴 Reject' : ' 🟡 Review'}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerate}
              disabled={loading || !candidateId}
              className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap">
              {loading ? '⏳ Generating...' : '✉️ Generate Email'}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 p-2 rounded">{error}</p>}

          {result && (
            <div className={`border rounded-lg overflow-hidden ${result.emailType === 'INTERVIEW_INVITATION' ? 'border-green-200' : 'border-red-200'}`}>
              <div className={`px-4 py-3 flex items-center justify-between ${result.emailType === 'INTERVIEW_INVITATION' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div>
                  <span className="font-bold text-sm">
                    {result.emailType === 'INTERVIEW_INVITATION' ? '🎉 Interview Invitation' : '📋 Rejection Email'}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">→ {result.candidateEmail}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  result.matchScore >= 85 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-700 border-red-300'
                }`}>{result.matchScore}% match</span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-2 rounded">{result.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Body</p>
                  <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-2 rounded whitespace-pre-wrap leading-relaxed">{result.body}</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleCopy}
                    className="text-sm border border-indigo-300 text-indigo-700 px-4 py-1.5 rounded-lg hover:bg-indigo-50 font-medium">
                    {copied ? '✅ Copied!' : '📋 Copy Email'}
                  </button>
                  <p className="text-xs text-gray-400 self-center">⚠️ Review before sending</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Cover Letter Generator ───────────────────────────────────────────────────
function CoverLetterGenerator({ candidates }: { candidates: any[] }) {
  const [candidateId, setCandidateId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!candidateId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await apiClient.post('/ai/cover-letter', { candidateId, companyName: companyName || 'Your Company' });
      setResult(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to generate cover letter');
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📝</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Cover Letter Generator</h2>
          <p className="text-sm text-gray-500">Generates a personalized cover letter tailored to the job description and candidate's profile</p>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          ⚠️ No candidates yet. Go to <strong>Candidates</strong> and add candidates first.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <select
              className="border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={candidateId}
              onChange={e => { setCandidateId(e.target.value); setResult(null); }}>
              <option value="">— Select a candidate —</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.job?.title}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Company name (e.g. Google, Stripe...)"
              className="border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !candidateId}
            className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm mb-4">
            {loading ? '⏳ Writing...' : '📝 Generate Cover Letter'}
          </button>

          {error && <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 p-2 rounded">{error}</p>}

          {result && (
            <div className="border border-purple-200 rounded-lg overflow-hidden">
              <div className="bg-purple-50 px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-purple-900">Cover Letter</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {result.candidateName} → {result.jobTitle} at {result.companyName}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded whitespace-pre-wrap leading-relaxed font-serif min-h-[200px]">
                  {result.coverLetter}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleCopy}
                    className="text-sm border border-purple-300 text-purple-700 px-4 py-1.5 rounded-lg hover:bg-purple-50 font-medium">
                    {copied ? '✅ Copied!' : '📋 Copy Letter'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── AI Scoring Panel ────────────────────────────────────────────────────────
function AIScoringPanel({ candidates }: { candidates: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Record<string, number>>({});

  const handleScore = async (candidate: any) => {
    setLoadingId(candidate.id);
    try {
      const res = await apiClient.post('/ai/score', { candidateId: candidate.id, jobId: candidate.job?.id || candidate.jobId });
      setUpdated(prev => ({ ...prev, [candidate.id]: res.data.score }));
    } catch (e: any) {
      alert(e.response?.data?.error || 'Scoring failed');
    } finally { setLoadingId(null); }
  };

  const scoreAll = async () => {
    const unscored = candidates.filter(c => c.matchScore === 0);
    for (const c of unscored) {
      await handleScore(c);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI Match Scoring</h2>
            <p className="text-sm text-gray-500">Scores candidates against their job description using AI</p>
          </div>
        </div>
        {candidates.some(c => c.matchScore === 0) && (
          <button
            onClick={scoreAll}
            disabled={loadingId !== null}
            className="text-sm bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40">
            ⚡ Score All Unscored
          </button>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          ⚠️ No candidates yet. Add candidates in the <strong>Candidates</strong> section first.
        </div>
      ) : (
        <div className="space-y-2">
          {candidates.map(c => {
            const score = updated[c.id] ?? c.matchScore;
            const scoreColor =
              score === 0 ? 'text-gray-400' :
              score >= 85 ? 'text-green-700 bg-green-50 border-green-200' :
              score >= 60 ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                            'text-red-700 bg-red-50 border-red-200';
            return (
              <div key={c.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-2.5 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.job?.title} · {c.status}</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  {score > 0 ? (
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${scoreColor}`}>
                      {score}% match
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Not scored</span>
                  )}
                  <button
                    onClick={() => handleScore(c)}
                    disabled={loadingId === c.id}
                    className="text-xs border border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-100 disabled:opacity-50 font-medium whitespace-nowrap">
                    {loadingId === c.id ? '⏳' : '🤖'} {score > 0 ? 'Re-score' : 'Score'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main AI Tools Page ───────────────────────────────────────────────────────
export function AITools() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'resume' | 'score' | 'email' | 'cover'>('resume');

  useEffect(() => {
    apiClient.get('/candidates').then(r => setCandidates(r.data)).catch(console.error);
  }, []);

  const tabs = [
    { id: 'resume', label: '📄 Resume Parser' },
    { id: 'score',  label: '🤖 AI Scoring' },
    { id: 'email',  label: '✉️ Email Generator' },
    { id: 'cover',  label: '📝 Cover Letter' },
  ] as const;

  // Refresh candidates after scoring
  const refreshCandidates = () => {
    apiClient.get('/candidates').then(r => setCandidates(r.data)).catch(console.error);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">AI Tools</h1>
        <p className="text-sm text-gray-500 mt-1">
          Powered by OpenAI — resume parsing, match scoring, email generation & cover letters
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-200 p-1 rounded-lg mb-6 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); if (tab.id !== 'resume') refreshCandidates(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-4xl">
        {activeTab === 'resume' && <ResumeParser />}
        {activeTab === 'score'  && <AIScoringPanel candidates={candidates} />}
        {activeTab === 'email'  && <EmailGenerator candidates={candidates} />}
        {activeTab === 'cover'  && <CoverLetterGenerator candidates={candidates} />}
      </div>
    </div>
  );
}
