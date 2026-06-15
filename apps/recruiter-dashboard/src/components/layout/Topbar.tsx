export function Topbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{user.name || 'Recruiter'}</p>
          <p className="text-xs text-gray-400">{user.email || ''}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
          {(user.name || 'R')[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
