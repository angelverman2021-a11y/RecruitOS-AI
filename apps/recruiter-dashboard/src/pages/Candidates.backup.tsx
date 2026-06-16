import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STAGES = ['APPLIED','SCREENING','INTERVIEW','OFFER','HIRED','REJECTED'] as const;
type Stage = typeof STAGES[number];

const STAGE_STYLE: Record<Stage, { header: string; ring: string; dot: string }> = {
  APPLIED:   { header: 'bg-slate-700',   ring: 'ring-slate-200',   dot: 'bg-slate-400'  },
  SCREENING: { header: 'bg-blue-600',    ring: 'ring-blue-100',    dot: 'bg-blue-400'   },
  INTERVIEW: { header: 'bg-amber-500',   ring: 'ring-amber-100',   dot: 'bg-amber-400'  },
  OFFER:     { header: 'bg-violet-600',  ring: 'ring-violet-100',  dot: 'bg-violet-400' },
  HIRED:     { header: 'bg-emerald-600', ring: 'ring-emerald-100', dot: 'bg-emerald-400'},
  REJECTED:  { header: 'bg-red-500',     ring: 'ring-red-100',     dot: 'bg-red-400'    },
};

function ScorePill({ score }: { score: number }) {
  if (!score) return <span className="text-xs text-slate-400">—</span>;
  const cls = score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-red-50 text-red-600 border-red-200';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>{score}%</span>;
}

interface EmailPreview { candidateId:string; candidateName:string; candidateEmail:string; matchScore:number; emailType:string; subject:string; body:string; }
interface HistoryEntry { id: string; fromStatus: string | null; toStatus: string; notes: string | null; createdAt: string; }

function CandidateCard({ candidate, onScore, onEmail, loadingScore, loadingEmail }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiClient.get(`/candidates/${candidate.id}/history`);
      setHistory(res.data);
      setShowHistory(true);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-card-hover transition-all cursor-move">
        {/* Card header */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
              {candidate.name[0].toUpperCase()}
            </div>
            <p className="font-semibold text-slate-900 text-xs truncate">{candidate.name}</p>
          </div>
          <ScorePill score={candidate.matchScore} />
        </div>

        {/* Meta */}
        <p className="text-xs text-indigo-600 font-medium truncate mb-1">{candidate.job?.title}</p>
        <p className="text-xs text-slate-400 truncate mb-1">{candidate.email}</p>
        {candidate.location && <p className="text-xs text-slate-400 mb-1">📍 {candidate.location}</p>}
        {candidate.experience && <p className="text-xs text-slate-400 mb-2">🗂 {candidate.experience}</p>}
        <p className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg truncate border border-slate-100 mb-3">
          {candidate.skills}
        </p>

        {/* AI Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button onClick={() => onScore(candidate)} disabled={loadingScore === candidate.id}
            className="btn-press text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg py-1.5 hover:bg-indigo-100 disabled:opacity-50 transition-all font-semibold">
            {loadingScore === candidate.id ? '...' : '🤖'}
          </button>
          <button onClick={() => onEmail(candidate)} disabled={loadingEmail === candidate.id || !candidate.matchScore}
            title={!candidate.matchScore ? 'Score first' : 'Generate email'}
            className="btn-press text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg py-1.5 hover:bg-emerald-100 disabled:opacity-50 transition-all font-semibold">
            {loadingEmail === candidate.id ? '...' : '✉️'}
          </button>
          <button onClick={loadHistory} disabled={loadingHistory}
            title="View timeline"
            className="btn-press text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-lg py-1.5 hover:bg-amber-100 disabled:opacity-50 transition-all font-semibold">
            {loadingHistory ? '...' : '📜'}
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md max-h-[90vh] flex flex-col fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 rounded-t-2xl flex items-center justify-between border-b bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">📜 Timeline</h3>
                <p className="text-sm text-slate-500 mt-0.5">{candidate.name}</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {history.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No history yet</p>
              ) : (
                <div className="space-y-3">
                  {history.map((h, idx) => (
                    <div key={h.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${STAGE_STYLE[h.toStatus as Stage]?.dot || 'bg-slate-300'}`} />
                        {idx < history.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {h.fromStatus && <span className="text-xs text-slate-400">{h.fromStatus}</span>}
                          {h.fromStatus && <span className="text-slate-300">→</span>}
                          <span className="text-xs font-semibold text-slate-700">{h.toStatus}</span>
                        </div>
                        {h.notes && <p className="text-xs text-slate-500 mb-1">{h.notes}</p>}
                        <p className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DroppableColumn({ stage, candidates, onScore, onEmail, loadingScore, loadingEmail }: any) {
  const { setNodeRef } = useDroppable({ id: stage });
  const st = STAGE_STYLE[stage];
  const ids = candidates.map((c: any) => c.id);

  return (
    <div ref={setNodeRef} className={`flex flex-col w-64 bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden ring-1 ${st.ring}`} style={{ minHeight: '400px' }}>
      {/* Column header */}
      <div className={`${st.header} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
          <span className="text-white font-semibold text-xs uppercase tracking-wide">{stage}</span>
        </div>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{candidates.length}</span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {candidates.length === 0 ? (
          <div className="text-center py-6 text-slate-300 text-xs">Drop here</div>
        ) : (
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {candidates.map((c: any) => (
              <CandidateCard key={c.id} candidate={c} onScore={onScore} onEmail={onEmail} loadingScore={loadingScore} loadingEmail={loadingEmail} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

export function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs]             = useState<any[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [loadingScore, setLoadingScore] = useState<string|null>(null);
  const [loadingEmail, setLoadingEmail] = useState<string|null>(null);
  const [emailPreview, setEmailPreview] = useState<EmailPreview|null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [skills, setSkills]       = useState('');
  const [experience, setExp]      = useState('');
  const [location, setLoc]        = useState('');
  const [jobId, setJobId]         = useState('');
  const [resumeText, setResume]   = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [cr, jr] = await Promise.all([apiClient.get('/candidates'), apiClient.get('/jobs')]);
      setCandidates(cr.data); setJobs(jr.data);
      if (jr.data.length && !jobId) setJobId(jr.data[0].id);
    } catch { console.error('fetch failed'); }
  };

  const handleParse = async () => {
    if (!resumeText.trim()) return;
    setIsParsing(true); setFormError('');
    try {
      const r = await apiClient.post('/ai/parse-resume', { resumeText });
      if (r.data.skills) setSkills(r.data.skills);
      if (r.data.experience) setExp(r.data.experience);
      if (r.data.location) setLoc(r.data.location);
    } catch { setFormError('Resume parsing failed. Fill in manually.'); }
    finally { setIsParsing(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      await apiClient.post('/candidates', { name, email, skills, experience, location, jobId });
      setName(''); setEmail(''); setSkills(''); setExp(''); setLoc(''); setResume(''); setShowForm(false);
      fetchData();
    } catch (err: any) { setFormError(err.response?.data?.error || 'Failed to add candidate'); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try { 
      await apiClient.patch(`/candidates/${id}/status`, { status, notes: `Moved to ${status}` }); 
      fetchData(); 
    }
    catch { console.error('status update failed'); }
  };

  const handleScore = async (c: any) => {
    setLoadingScore(c.id);
    try { await apiClient.post('/ai/score', { candidateId: c.id, jobId: c.job?.id || c.jobId }); fetchData(); }
    catch (err: any) { alert(err.response?.data?.error || 'Scoring failed'); }
    finally { setLoadingScore(null); }
  };

  const handleEmail = async (c: any) => {
    setLoadingEmail(c.id);
    try { const r = await apiClient.post('/ai/generate-email', { candidateId: c.id }); setEmailPreview(r.data); }
    catch (err: any) { alert(err.response?.data?.error || 'Email generation failed'); }
    finally { setLoadingEmail(null); }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const candidateId = active.id as string;
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Check if dropped on a different stage
    const newStage = over.id as string;
    if (STAGES.includes(newStage as Stage) && candidate.status !== newStage) {
      updateStatus(candidateId, newStage);
    }
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  const inp = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 transition-all';

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Candidate Pipeline</h1>
          <p className="text-sm text-slate-500">{candidates.length} total · Drag & drop to move stages</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="btn-press flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          {showForm ? '✕ Cancel' : '+ Add Candidate'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mx-6 mt-4 bg-white border border-slate-100 rounded-2xl shadow-card p-6 flex-shrink-0 fade-in">
          <h2 className="font-bold text-slate-900 mb-4">Add New Candidate</h2>
          {formError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{formError}</div>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className={inp} placeholder="Full Name *" required value={name} onChange={e => setName(e.target.value)} />
              <input type="email" className={inp} placeholder="Email Address *" required value={email} onChange={e => setEmail(e.target.value)} />
              <select className={inp} required value={jobId} onChange={e => setJobId(e.target.value)}>
                {jobs.length === 0 ? <option value="">No jobs — create one first</option>
                  : jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>

            {/* Resume parser */}
            <div className="border border-dashed border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">✨ AI Resume Parser</span>
                <button type="button" onClick={handleParse} disabled={isParsing || !resumeText.trim()}
                  className="btn-press text-xs bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-all">
                  {isParsing ? 'Parsing...' : 'Parse with AI'}
                </button>
              </div>
              <textarea rows={3} value={resumeText} onChange={e => setResume(e.target.value)}
                placeholder="Paste resume text here → click 'Parse with AI' to auto-fill skills, experience & location"
                className="w-full border border-indigo-100 rounded-lg p-3 text-sm bg-white placeholder-slate-400 resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className={inp} placeholder="Skills (comma separated) *" required value={skills} onChange={e => setSkills(e.target.value)} />
              <input className={inp} placeholder="Experience (e.g. 5 years)" value={experience} onChange={e => setExp(e.target.value)} />
              <input className={inp} placeholder="Location" value={location} onChange={e => setLoc(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="btn-press bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm text-sm">
                {submitting ? 'Adding...' : 'Add Candidate'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2.5 rounded-xl hover:bg-slate-100 text-sm transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban with Drag & Drop */}
      <div className="flex-1 overflow-x-auto px-6 py-4">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 h-full" style={{ minWidth: `${STAGES.length * 280}px` }}>
            {STAGES.map(stage => (
              <DroppableColumn 
                key={stage} 
                stage={stage} 
                candidates={candidates.filter(c => c.status === stage)}
                onScore={handleScore}
                onEmail={handleEmail}
                loadingScore={loadingScore}
                loadingEmail={loadingEmail}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCandidate ? (
              <div className="bg-white border-2 border-indigo-500 rounded-xl p-3 shadow-lg opacity-90 w-64">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {activeCandidate.name[0].toUpperCase()}
                  </div>
                  <p className="font-semibold text-slate-900 text-xs">{activeCandidate.name}</p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Email Preview Modal */}
      {emailPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEmailPreview(null)}>
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] flex flex-col fade-in" onClick={e => e.stopPropagation()}>
            <div className={`px-6 py-4 rounded-t-2xl flex items-center justify-between border-b ${
              emailPreview.emailType === 'INTERVIEW_INVITATION'
                ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
            }`}>
              <div>
                <h3 className="font-bold text-slate-900">
                  {emailPreview.emailType === 'INTERVIEW_INVITATION' ? '🎉 Interview Invitation' : '📋 Rejection Email'}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  For <strong>{emailPreview.candidateName}</strong> · <ScorePill score={emailPreview.matchScore} />
                </p>
              </div>
              <button onClick={() => setEmailPreview(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">To</p>
                <p className="text-sm text-slate-700 font-medium">{emailPreview.candidateEmail}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</p>
                <p className="text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">{emailPreview.subject}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Body</p>
                <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl whitespace-pre-wrap leading-relaxed">{emailPreview.body}</div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between rounded-b-2xl bg-slate-50">
              <p className="text-xs text-slate-400">⚠️ AI-generated — review before sending</p>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(`Subject: ${emailPreview.subject}\n\n${emailPreview.body}`); }}
                  className="text-sm border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-50 font-medium">📋 Copy</button>
                <button onClick={() => setEmailPreview(null)}
                  className="text-sm bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 font-medium">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
