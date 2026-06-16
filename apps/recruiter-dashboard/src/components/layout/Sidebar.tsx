import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',           icon: '▣', label: 'Dashboard'   },
  { to: '/jobs',       icon: '◈', label: 'Jobs'         },
  { to: '/candidates', icon: '◉', label: 'Candidates'   },
  { to: '/ai-tools',   icon: '◆', label: 'AI Tools'     },
];

export function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-56 bg-slate-900 min-h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-black">R</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">RecruitOS</p>
            <p className="text-slate-500 text-xs mt-0.5">AI Platform</p>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div className="px-5 mb-2">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Navigation</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <span className={`text-base transition-all ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {icon}
              </span>
              {label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 pt-4 border-t border-slate-800 mt-4">
        <button onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <span className="text-base">↩</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
