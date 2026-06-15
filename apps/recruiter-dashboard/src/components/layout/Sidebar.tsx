import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',          label: '📊 Dashboard'   },
  { to: '/jobs',      label: '💼 Jobs'         },
  { to: '/candidates',label: '👥 Candidates'   },
  { to: '/ai-tools',  label: '🤖 AI Tools'     },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-extrabold text-indigo-700 tracking-tight">RecruitOS</h1>
        <p className="text-xs text-gray-400 mt-0.5">AI Recruiting Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
