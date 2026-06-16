import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const inp = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 transition-all';

// ─── Resume Parser ────────────────────────────────────────────────────────────
function ResumeParser() {
  const [text, setText]     = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handle = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { const r = await apiClient.post('/ai/parse-resume', { resumeText: text }); setResult(r.data); }
    catch (e: any) { setError(e.response?.data?.error || 'Parsing failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <textarea className={`${inp} resize-none`} rows={9}
        placeholder={`Paste any resume text here...\n\nExample:\nJane Doe | jane@email.com | San Francisco, CA\n\nEXPERIENCE\nSenior Engineer @ Stripe (2020–2024)\n- Built payment APIs with Node.js...\n\nSKILLS\nTypeScript, React, Node.js, PostgreSQL, AWS`}
        value={text} onChange={e => setText(e.target.value)} />

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">{error}</p>}

      <button onClick={handle} disabled={loading || !text.trim()}
        className="btn-press bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-sm text-sm">
        {loading ? '⏳ Parsing resume...' : '✨ Parse with AI'}
      </button>

      {result && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5 fade-in">
          <p className="text-sm font-bold text-emerald-800 mb-3">✅ Extracted successfully</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[['Skills', result.skills], ['Experience', result.experience], ['Location', result.location]].map(([k, v]) => (
              <div key={k} className="bg-white border border-emerald-100 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{k}</p>
                <p className="text-sm text-slate-800 font-medium">{v || '—'}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigator.clipboard.writeText(`Skills: ${result.skills}\nExperience: ${result.experience}\nLocation: ${result.location}`)}
            className="mt-3 text-xs text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 font-medium">
            📋 Copy all
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Scoring ───────────────────────────────────────────────────────────────
function AIScoringPanel({ candidates, onRefresh }: { candidates: any[]; onRefresh: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const score = async (c: any) => {
    setLoadingId(c.id);
    try { await apiClient.post('/ai/score', { candidateId: c.id, jobId: c.job?.id || c.jobId }); onRefresh(); }
    catch (e: any) { alert(e.response?.data?.error || 'Scoring failed'); }
    finally { setLoadingId(null); }
  };

  const scoreAll = async () => {
    const unscored = candidates.filter(c => c.matchScore === 0);
    setLoadingAll(true);
    for (const c of unscored) { await score(c); }
    setLoadingAll(false);
  };

  if (!candidates.length) return (
    <div className="text-center py-12 text-slate-400">
      <p className="text-4xl mb-2">🤖</p>
      <p className="font-medium text-slate-600">No candidates yet</p>
      <p className="text-sm mt-1">Add candidates in the Candidates section first</p>
    </div>
  );

  const unscored = candidates.filter(c => c.matchScore === 0).length;

  return (
    <div className="space-y-4">
      {unscored > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
          <p className="text-sm text-indigo-700 font-medium">{unscored} candidate{unscored !== 1 ? 's' : ''} not scored yet</p>
          <button onClick={scoreAll} disabled={loadingAll}
            className="btn-press text-sm bg-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all">
            {loadingAll ? 'Scoring...' : '⚡ Score All'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {candidates.map(c => {
          const s = c.matchScore;
          const barColor = s >= 85 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-400' : s > 0 ? 'bg-red-400' : 'bg-slate-200';
          const badgeColor = s >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : s >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200'
            : s > 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200';
          return (
            <div key={c.id} className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:shadow-card transition-all">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                {c.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                <p className="text-xs text-slate-400 truncate">{c.job?.title} · {c.status}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[120px]">
                    <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${s}%` }} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {s > 0 ? `${s}%` : 'Not scored'}
                  </span>
                </div>
              </div>
              <button onClick={() => score(c)} disabled={loadingId === c.id}
                className="btn-press flex-shrink-0 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-3 py-2 rounded-xl hover:bg-indigo-100 disabled:opacity-50 transition-all">
                {loadingId === c.id ? '...' : s > 0 ? '↻ Re-score' : '🤖 Score'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Email Generator ──────────────────────────────────────────────────────────
function EmailGenerator({ candidates }: { candidates: any[] }) {
  const [candId, setCandId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [copied, setCopied] = useState(false);

  const scored = candidates.filter(c => c.matchScore > 0);

  const handle = async () => {
    if (!candId) return;
    setLoading(true); setError(''); setResult(null);
    try { const r = await apiClient.post('/ai/generate-email', { candidateId: candId }); setResult(r.data); }
    catch (e: any) { setError(e.response?.data?.error || 'Generation failed'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (!scored.length) return (
    <div className="text-center py-12 text-slate-400">
      <p className="text-4xl mb-2">✉️</p>
      <p className="font-medium text-slate-600">No scored candidates</p>
      <p className="text-sm mt-1">Go to the <strong>AI Scoring</strong> tab first to score your candidates</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select className={`flex-1 ${inp}`} value={candId} onChange={e => { setCandId(e.target.value); setResult(null); }}>
          <option value="">— Select a scored candidate —</option>
          {scored.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.job?.title} · {c.matchScore}% {c.matchScore >= 85 ? '🟢 Invite' : c.matchScore < 60 ? '🔴 Reject' : '🟡 Review'}
            </option>
          ))}
        </select>
        <button onClick={handle} disabled={loading || !candId}
          className="btn-press bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-sm text-sm whitespace-nowrap">
          {loading ? 'Generating...' : '✉️ Generate'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">{error}</p>}

      {result && (
        <div className={`border rounded-2xl overflow-hidden fade-in ${result.emailType === 'INTERVIEW_INVITATION' ? 'border-emerald-200' : 'border-red-200'}`}>
          <div className={`px-5 py-3.5 flex items-center justify-between ${result.emailType === 'INTERVIEW_INVITATION' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div>
              <span className="font-bold text-sm text-slate-900">
                {result.emailType === 'INTERVIEW_INVITATION' ? '🎉 Interview Invitation' : '📋 Rejection Email'}
              </span>
              <span className="text-xs text-slate-400 ml-2">→ {result.candidateEmail}</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              result.matchScore >= 85 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
            }`}>{result.matchScore}% match</span>
          </div>
          <div className="p-5 bg-white space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</p>
              <p className="text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">{result.subject}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Body</p>
              <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl whitespace-pre-wrap leading-relaxed">{result.body}</div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button onClick={copy}
                className="btn-press text-sm border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-50 font-medium transition-all">
                {copied ? '✅ Copied!' : '📋 Copy Email'}
              </button>
              <p className="text-xs text-slate-400">⚠️ AI-generated — review before sending</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cover Letter Generator ───────────────────────────────────────────────────
function CoverLetterGenerator({ candidates }: { candidates: any[] }) {
  const [candId, setCandId]   = useState('');
  const [company, setCompany] = useState('');
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);

  const handle = async () => {
    if (!candId) return;
    setLoading(true); setError(''); setResult(null);
    try { const r = await apiClient.post('/ai/cover-letter', { candidateId: candId, companyName: company || 'Your Company' }); setResult(r.data); }
    catch (e: any) { setError(e.response?.data?.error || 'Generation failed'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(result.coverLetter);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (!candidates.length) return (
    <div className="text-center py-12 text-slate-400">
      <p className="text-4xl mb-2">📝</p>
      <p className="font-medium text-slate-600">No candidates yet</p>
      <p className="text-sm mt-1">Add candidates in the Candidates section first</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select className={inp} value={candId} onChange={e => { setCandId(e.target.value); setResult(null); }}>
          <option value="">— Select a candidate —</option>
          {candidates.map(c => <option key={c.id} value={c.id}>{c.name} · {c.job?.title}</option>)}
        </select>
        <input className={inp} placeholder="Company name (e.g. Google, Stripe, Apple...)"
          value={company} onChange={e => setCompany(e.target.value)} />
      </div>

      <button onClick={handle} disabled={loading || !candId}
        className="btn-press bg-violet-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-violet-700 disabled:opacity-40 transition-all shadow-sm text-sm">
        {loading ? '✍️ Writing cover letter...' : '📝 Generate Cover Letter'}
      </button>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">{error}</p>}

      {result && (
        <div className="border border-violet-200 rounded-2xl overflow-hidden fade-in">
          <div className="bg-violet-50 px-5 py-3.5 flex items-center justify-between border-b border-violet-100">
            <div>
              <span className="font-bold text-sm text-slate-900">📝 Cover Letter</span>
              <span className="text-xs text-slate-400 ml-2">{result.candidateName} → {result.jobTitle} at {result.companyName}</span>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 px-5 py-4 rounded-xl whitespace-pre-wrap leading-relaxed font-serif min-h-48">
              {result.coverLetter}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button onClick={copy}
                className="btn-press text-sm border border-violet-200 text-violet-700 px-4 py-2 rounded-xl hover:bg-violet-50 font-medium transition-all">
                {copied ? '✅ Copied!' : '📋 Copy Letter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Tab = 'resume' | 'score' | 'email' | 'cover';

const TABS: { id: Tab; icon: string; label: string; desc: string }[] = [
  { id: 'resume', icon: '📄', label: 'Resume Parser',   desc: 'Extract skills from any resume'        },
  { id: 'score',  icon: '🤖', label: 'AI Scoring',      desc: 'Match candidates to job descriptions'  },
  { id: 'email',  icon: '✉️', label: 'Email Generator', desc: 'Invite or reject with one click'       },
  { id: 'cover',  icon: '📝', label: 'Cover Letter',    desc: 'Personalized letters in seconds'       },
];

export function AITools() {
  const [tab, setTab]             = useState<Tab>('resume');
  const [candidates, setCandidates] = useState<any[]>([]);

  const refresh = () => apiClient.get('/candidates').then(r => setCandidates(r.data)).catch(console.error);
  useEffect(() => { refresh(); }, []);

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Tab picker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); refresh(); }}
            className={`btn-press text-left p-4 rounded-2xl border transition-all ${
              tab === t.id
                ? 'bg-indigo-600 border-indigo-600 shadow-sm'
                : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-card shadow-card'
            }`}>
            <span className="text-xl block mb-1.5">{t.icon}</span>
            <p className={`font-bold text-sm ${tab === t.id ? 'text-white' : 'text-slate-900'}`}>{t.label}</p>
            <p className={`text-xs mt-0.5 ${tab === t.id ? 'text-indigo-200' : 'text-slate-400'}`}>{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-slate-900 mb-1">{TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}</h2>
        <p className="text-sm text-slate-400 mb-5">{TABS.find(t => t.id === tab)?.desc}</p>

        {tab === 'resume' && <ResumeParser />}
        {tab === 'score'  && <AIScoringPanel candidates={candidates} onRefresh={refresh} />}
        {tab === 'email'  && <EmailGenerator candidates={candidates} />}
        {tab === 'cover'  && <CoverLetterGenerator candidates={candidates} />}
      </div>
    </div>
  );
}
