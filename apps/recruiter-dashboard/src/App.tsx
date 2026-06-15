
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const kpiCards = document.querySelectorAll('.glass-panel');
    kpiCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            (card as HTMLElement).style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', () => {
            (card as HTMLElement).style.transform = 'translateY(0)';
        });
    });

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        (row as HTMLElement).style.opacity = '0';
        (row as HTMLElement).style.transform = 'translateY(10px)';
        (row as HTMLElement).style.transition = `all 0.4s ease ${index * 0.1}s`;
        setTimeout(() => {
            (row as HTMLElement).style.opacity = '1';
            (row as HTMLElement).style.transform = 'translateY(0)';
        }, 100);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#131315] text-[#e5e1e4]">
      

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

<a className="flex items-center gap-3 px-4 py-3 text-primary dark:text-primary font-bold border-r-2 border-primary transition-all duration-200 ease-in-out bg-primary/5 rounded-l-lg" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</a>

<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
<span className="material-symbols-outlined">work</span>
<span className="font-label-md text-label-md">Jobs</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
<span className="material-symbols-outlined">group</span>
<span className="font-label-md text-label-md">Candidates</span>
</a>
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
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
<span className="material-symbols-outlined">mail</span>
<span className="font-label-md text-label-md">Messages</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
<span className="material-symbols-outlined">analytics</span>
<span className="font-label-md text-label-md">Analytics</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out rounded-lg" href="#">
<span className="material-symbols-outlined">smart_toy</span>
<span className="font-label-md text-label-md">AI Copilot</span>
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
<main className="flex-1 flex flex-col min-w-0 bg-surface">

<header className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-40 bg-surface/80 backdrop-blur-md">
<div className="flex items-center gap-8">
<div className="relative group">
<span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant/50">
<span className="material-symbols-outlined text-[18px]">search</span>
</span>
<input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-body-sm font-body-sm w-64 focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search workspace..." type="text"/>
</div>
<nav className="hidden md:flex gap-6">
<a className="font-body-md text-body-md text-primary dark:text-primary border-b-2 border-primary pb-1" href="#">Workspace</a>
<a className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Direct Hire</a>
<a className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Contracting</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="flex gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-100">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-100">
<span className="material-symbols-outlined">apps</span>
</button>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex items-center gap-3 cursor-pointer group">
<div className="text-right">
<p className="font-label-md text-label-md font-bold">Alex Rivera</p>
<p className="text-[10px] text-on-surface-variant">Senior Recruiter</p>
</div>
<img alt="User Profile" className="w-10 h-10 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors object-cover" data-alt="A professional headshot of a modern talent acquisition specialist, male, mid-30s with a clean-cut appearance. He is set against a blurred high-end office background with deep navy and charcoal tones. The lighting is crisp and cinematic, emphasizing a professional yet tech-forward persona. The image follows a dark-mode minimalism aesthetic consistent with premium AI enterprise tools." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6ehR4xIM8pCdwSDpnE_G3dRksknwJNwLQ5awCDsbwdqIV_w_npB8KODLgCZRedFfWj3o0Gy7-orNI__40Ony2ee9W_8B19RD0NvvY0pqVRFvLWY5dGEr02q-bRGmWFNfOkcshS_-1HmLtRS6TXdSTfQmerUv3w0qBds3S3_wOytgbu3PywdmHPh_lMHDgoCddj6vA92Ai5XdsHh4f7Xvdgtytyi8AVeY8Wz9u0w8WgtWlm9rQ__4jzEQKCoJJJ-7o3F2bdGiA2M6I"/>
</div>
</div>
</header>

<div className="p-6 space-y-6 max-w-7xl mx-auto w-full">

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

<div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined text-[20px]">assignment</span>
</div>
<span className="text-xs font-mono text-tertiary font-bold">+12% ↑</span>
</div>
<h3 className="text-on-surface-variant text-body-sm mb-1">Open Positions</h3>
<p className="text-2xl font-bold font-headline-md">48</p>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-primary/20 h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[65%]"></div>
</div>
</div>
</div>

<div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
<span className="material-symbols-outlined text-[20px]">group_add</span>
</div>
<span className="text-xs font-mono text-tertiary font-bold">+24% ↑</span>
</div>
<h3 className="text-on-surface-variant text-body-sm mb-1">Applications Today</h3>
<p className="text-2xl font-bold font-headline-md">156</p>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-tertiary/20 h-2 rounded-full overflow-hidden">
<div className="bg-tertiary h-full w-[82%]"></div>
</div>
</div>
</div>

<div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-secondary-container/10 rounded-lg text-secondary-container">
<span className="material-symbols-outlined text-[20px]">calendar_month</span>
</div>
<span className="text-xs font-mono text-on-surface-variant font-bold">Stable</span>
</div>
<h3 className="text-on-surface-variant text-body-sm mb-1">Upcoming Interviews</h3>
<p className="text-2xl font-bold font-headline-md">12</p>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-secondary-container/20 h-2 rounded-full overflow-hidden">
<div className="bg-secondary-container h-full w-[40%]"></div>
</div>
</div>
</div>

<div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-outline/10 rounded-lg text-outline">
<span className="material-symbols-outlined text-[20px]">database</span>
</div>
<span className="text-xs font-mono text-tertiary font-bold">+2k ↑</span>
</div>
<h3 className="text-on-surface-variant text-body-sm mb-1">Total Candidates</h3>
<p className="text-2xl font-bold font-headline-md">8,492</p>
<div className="mt-4 h-8 flex items-end gap-1">
<div className="flex-1 bg-outline/20 h-2 rounded-full overflow-hidden">
<div className="bg-outline h-full w-[95%]"></div>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-8 glass-panel ai-glow rounded-2xl p-6 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
<h2 className="font-headline-md text-[18px] font-bold">AI Intelligence Report</h2>
</div>
<div className="grid md:grid-cols-2 gap-6">
<div className="space-y-4">
<div className="p-4 bg-surface-container-highest rounded-xl border-l-4 border-tertiary">
<p className="text-body-sm font-medium mb-1">Weekly Momentum</p>
<p className="text-headline-md font-bold gradient-text">Candidate matching is up 12%</p>
<p className="text-body-sm text-on-surface-variant/70 mt-2">Enhanced semantic analysis has identified high-quality leads for 3 core technical tracks.</p>
</div>
<div className="p-4 bg-surface-container-highest rounded-xl border-l-4 border-primary">
<p className="text-body-sm font-medium mb-1">Priority Alert</p>
<p className="text-body-sm text-on-surface-variant leading-relaxed">Recommended action: Review <span className="text-primary font-bold">Java Developers</span> for the <span className="text-primary font-bold">Fintech Engineering</span> role. 4 candidates meet 95%+ criteria.</p>
</div>
</div>
<div className="hidden md:block">

</div>
</div>
</div>

<div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col">
<div className="flex justify-between items-center mb-6">
<h2 className="font-headline-md text-[18px] font-bold">AI Activity</h2>
<button className="text-primary text-[12px] font-bold uppercase tracking-wider">View All</button>
</div>
<div className="space-y-5 flex-1 custom-scrollbar overflow-y-auto">
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
</div>
<div>
<p className="text-body-sm font-medium">AI Copilot screened <span className="text-primary">42 candidates</span></p>
<p className="text-[12px] text-on-surface-variant">Senior Frontend Engineer • 2m ago</p>
</div>
</div>
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-tertiary text-[18px]">auto_awesome</span>
</div>
<div>
<p className="text-body-sm font-medium">Auto-scheduled <span className="text-tertiary">5 interviews</span></p>
<p className="text-[12px] text-on-surface-variant">Product Design Team • 15m ago</p>
</div>
</div>
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-secondary text-[18px]">mark_as_unread</span>
</div>
<div>
<p className="text-body-sm font-medium">Outreach sequence initiated</p>
<p className="text-[12px] text-on-surface-variant">Cloud Architects (Batch B) • 1h ago</p>
</div>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-7 glass-panel rounded-2xl p-6 overflow-hidden">
<div className="flex justify-between items-center mb-8">
<div>
<h2 className="font-headline-md text-[18px] font-bold">Hiring Pipeline</h2>
<p className="text-body-sm text-on-surface-variant">Real-time throughput across all roles</p>
</div>
<div className="flex gap-2">
<div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest rounded-full text-xs font-medium">
<span className="w-2 h-2 rounded-full bg-tertiary"></span> High Volume
                            </div>
</div>
</div>
<div className="relative flex items-center h-48 gap-1">
<div className="flex-1 pipeline-node bg-surface-container-highest flex flex-col items-center justify-center relative group cursor-pointer hover:bg-surface-variant transition-colors">
<span className="text-2xl font-bold">1.2k</span>
<span className="text-[10px] uppercase font-bold text-on-surface-variant">Applied</span>
</div>
<div className="flex-1 pipeline-node bg-primary-container/20 flex flex-col items-center justify-center relative group cursor-pointer hover:bg-primary-container/30 transition-colors">
<span className="text-2xl font-bold text-primary">342</span>
<span className="text-[10px] uppercase font-bold text-primary">Screened</span>
</div>
<div className="flex-1 pipeline-node bg-tertiary-container/20 flex flex-col items-center justify-center relative group cursor-pointer hover:bg-tertiary-container/30 transition-colors">
<span className="text-2xl font-bold text-tertiary">84</span>
<span className="text-[10px] uppercase font-bold text-tertiary">Interviews</span>
</div>
<div className="flex-1 pipeline-node bg-surface-container-highest/50 flex flex-col items-center justify-center relative group cursor-pointer hover:bg-surface-variant transition-colors">
<span className="text-2xl font-bold">21</span>
<span className="text-[10px] uppercase font-bold text-on-surface-variant">Offers</span>
</div>
<div className="flex-1 pipeline-node bg-gradient-to-r from-tertiary to-primary flex flex-col items-center justify-center relative group cursor-pointer hover:scale-105 transition-all">
<span className="text-2xl font-bold text-surface">18</span>
<span className="text-[10px] uppercase font-bold text-surface/80">Hired</span>
</div>
</div>
</div>

<div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col">
<div className="flex justify-between items-center mb-6">
<h2 className="font-headline-md text-[18px] font-bold">Growth Forecast</h2>
<div className="flex gap-4 text-[12px]">
<div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Actual</div>
<div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-outline-variant"></span> Target</div>
</div>
</div>
<div className="flex-1 flex items-end justify-between gap-4 pb-2">

<div className="flex-1 space-y-2">
<div className="h-24 bg-surface-container-highest rounded-t-lg relative">
<div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-tertiary/40 to-tertiary rounded-t-lg"></div>
</div>
<p className="text-center text-[10px] text-on-surface-variant">Oct</p>
</div>
<div className="flex-1 space-y-2">
<div className="h-32 bg-surface-container-highest rounded-t-lg relative">
<div className="absolute bottom-0 w-full h-[85%] bg-gradient-to-t from-tertiary/40 to-tertiary rounded-t-lg"></div>
</div>
<p className="text-center text-[10px] text-on-surface-variant">Nov</p>
</div>
<div className="flex-1 space-y-2">
<div className="h-40 bg-surface-container-highest rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-tertiary/40 to-tertiary rounded-t-lg"></div>
<div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
</div>
<p className="text-center text-[10px] text-on-surface-variant">Dec</p>
</div>
<div className="flex-1 space-y-2 opacity-50">
<div className="h-44 bg-surface-container-highest rounded-t-lg border-2 border-dashed border-outline-variant">
</div>
<p className="text-center text-[10px] text-on-surface-variant">Jan (est)</p>
</div>
</div>
</div>
</div>

<div className="glass-panel rounded-2xl overflow-hidden">
<div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
<h2 className="font-headline-md text-[18px] font-bold">Top Recommendations</h2>
<div className="flex items-center gap-3">
<span className="text-body-sm text-on-surface-variant">Sort by: AI Match Score</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">filter_list</span>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="text-label-md text-on-surface-variant uppercase tracking-wider bg-surface-container-lowest/50">
<th className="px-6 py-4 font-bold">Candidate</th>
<th className="px-6 py-4 font-bold">Role Applied</th>
<th className="px-6 py-4 font-bold">Experience</th>
<th className="px-6 py-4 font-bold">Match Score</th>
<th className="px-6 py-4 font-bold">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
<tr className="hover:bg-surface-variant transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">SM</div>
<div>
<p className="font-bold text-body-sm">Sarah Miller</p>
<p className="text-[12px] text-on-surface-variant">London, UK</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-body-sm">Senior Frontend Engineer</td>
<td className="px-6 py-4">
<div className="flex gap-2">
<span className="px-2 py-0.5 bg-surface-container-highest text-on-surface text-[10px] rounded uppercase font-bold">React</span>
<span className="px-2 py-0.5 bg-surface-container-highest text-on-surface text-[10px] rounded uppercase font-bold">Next.js</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 bg-surface-container-highest h-1.5 rounded-full w-24">
<div className="bg-tertiary h-full rounded-full" style={{ width: "98%" }}></div>
</div>
<span className="font-mono text-tertiary font-bold">98%</span>
</div>
</td>
<td className="px-6 py-4">
<button className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20 hover:bg-primary hover:text-surface transition-all">Review</button>
</td>
</tr>
<tr className="hover:bg-surface-variant transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary font-bold">DK</div>
<div>
<p className="font-bold text-body-sm">David Kim</p>
<p className="text-[12px] text-on-surface-variant">San Francisco, CA</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-body-sm">Cloud Infrastructure Lead</td>
<td className="px-6 py-4">
<div className="flex gap-2">
<span className="px-2 py-0.5 bg-surface-container-highest text-on-surface text-[10px] rounded uppercase font-bold">AWS</span>
<span className="px-2 py-0.5 bg-surface-container-highest text-on-surface text-[10px] rounded uppercase font-bold">Kubernetes</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="flex-1 bg-surface-container-highest h-1.5 rounded-full w-24">
<div className="bg-tertiary h-full rounded-full" style={{ width: "92%" }}></div>
</div>
<span className="font-mono text-tertiary font-bold">92%</span>
</div>
</td>
<td className="px-6 py-4">
<button className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20 hover:bg-primary hover:text-surface transition-all">Review</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>

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

export default App;
