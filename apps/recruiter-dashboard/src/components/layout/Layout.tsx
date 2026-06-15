import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#131315] text-[#e5e1e4]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-surface">
        <Topbar />
        
        <Outlet />

      </main>

      {/* Global AI FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-gradient-to-tr from-primary to-tertiary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group" id="ai-trigger">
          <span className="material-symbols-outlined text-surface font-bold text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-tertiary"></span>
          </span>
        </button>

        <div className="absolute bottom-20 right-0 w-64 glass-panel p-4 rounded-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
          <p className="font-bold text-tertiary mb-1">AI Copilot Active</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">I've analyzed 12 new applicants while you were away. Would you like a summary?</p>
        </div>
      </div>
    </div>
  );
}
