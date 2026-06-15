import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="flex flex-col h-screen sticky top-0 bg-surface-container-low dark:bg-surface-container-low docked left-0 w-64 border-r border-outline-variant/30 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center">
          <span className="material-symbols-outlined text-surface font-bold text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">RecruitOS AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Enterprise Tier</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-primary dark:text-primary font-bold border-r-2 border-primary transition-all duration-200 ease-in-out bg-primary/5 rounded-l-lg">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg">
          <span className="material-symbols-outlined">work</span>
          <span className="font-label-md text-label-md">Jobs</span>
        </Link>
        <Link to="/candidates" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg">
          <span className="material-symbols-outlined">group</span>
          <span className="font-label-md text-label-md">Candidates</span>
        </Link>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
          <span className="material-symbols-outlined">psychology</span>
          <span className="font-label-md text-label-md">AI Matching</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
          <span className="material-symbols-outlined">event</span>
          <span className="font-label-md text-label-md">Interviews</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
          <span className="material-symbols-outlined">assessment</span>
          <span className="font-label-md text-label-md">Reports</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg mt-auto" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </a>
      </nav>
      <div className="p-4">
        <button className="w-full py-3 bg-gradient-to-r from-secondary-container to-primary-container text-on-primary-container font-label-md text-label-md rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          Quick Create
        </button>
      </div>
    </aside>
  );
}
