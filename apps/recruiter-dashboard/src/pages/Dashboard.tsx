import { useEffect } from 'react';

export function Dashboard() {
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
            <div className="hidden md:block"></div>
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
              <div className="h-44 bg-surface-container-highest rounded-t-lg border-2 border-dashed border-outline-variant"></div>
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
  );
}
