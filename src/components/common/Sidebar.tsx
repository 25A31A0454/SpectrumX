import React from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { NavTab } from '../../types/spectrum';
import { 
  LayoutDashboard, 
  Radio, 
  Cpu, 
  AlertTriangle, 
  Clock, 
  Server, 
  Info, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, systemHealth } = useSpectrum();

  const activeAlertsCount = alerts.filter(a => a.status !== 'Resolved').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'spectrum', label: 'Spectrum', icon: <Radio className="w-4 h-4" /> },
    { id: 'signals', label: 'Signals', icon: <Layers className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Analysis', icon: <Cpu className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: activeAlertsCount },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Server className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-[#18274E] bg-[#070D1F] flex flex-col justify-between shrink-0 font-mono text-xs z-20 h-[calc(100vh-4rem)]">
      {/* Top: Section Header & Navigation */}
      <div className="p-4 space-y-6 overflow-y-auto">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3 px-2">
            INTELLIGENCE CONSOLE
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition-all duration-150 group ${
                    isActive
                      ? 'bg-cyan-950/60 border-l-2 border-cyan-400 text-cyan-300 font-bold glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {item.icon}
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-red-500 text-white shadow-[0_0_8px_#ef4444]' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick SDR Sensor Status Mini-Panel */}
        <div className="p-3 rounded border border-slate-800 bg-[#091024]/60 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
            <span>SDR Sensor Node</span>
            <span className="text-emerald-400 font-bold">● {systemHealth.sdrStatus}</span>
          </div>
          <div className="text-[11px] text-slate-300 font-medium truncate">
            {systemHealth.sdrDevice}
          </div>
          <div className="text-[10px] text-slate-500">
            Band: <span className="text-slate-400">{systemHealth.scanRange}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sidebar: System Operational Status & Official Motto */}
      <div className="p-4 border-t border-[#18274E] bg-[#050811] space-y-3">
        {/* System Operational Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold tracking-wider">
            SYSTEM OPERATIONAL
          </span>
        </div>

        {/* Official SIH Tagline */}
        <div className="text-center pt-1">
          <div className="text-xs font-bold text-slate-300 tracking-wider">SpectrumX</div>
          <div className="text-[10px] text-slate-500 italic mt-0.5 leading-snug">
            “Protecting the Spectrum<br />Securing Tomorrow”
          </div>
        </div>
      </div>
    </aside>
  );
};
