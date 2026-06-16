import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/':           { title: 'Dashboard',  subtitle: 'Overview of your recruiting pipeline' },
  '/jobs':       { title: 'Jobs',       subtitle: 'Manage your open positions'            },
  '/candidates': { title: 'Candidates', subtitle: 'Pipeline & hiring stages'             },
  '/ai-tools':   { title: 'AI Tools',   subtitle: 'Resume parsing, scoring & email generation' },
};

export function Topbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const page = pageTitles[location.pathname] ?? { title: 'RecruitOS', subtitle: '' };
  const initial = (user.name || 'R')[0].toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-none">{page.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{page.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-800 leading-none">{user.name || 'Recruiter'}</p>
          <p className="text-xs text-slate-400 mt-0.5">{user.email || ''}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
          {initial}
        </div>
      </div>
    </header>
  );
}
