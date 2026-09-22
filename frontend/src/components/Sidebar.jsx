import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  CalendarDays, 
  ShieldAlert, 
  LogOut,
  Stethoscope,
  Star,
  HelpCircle,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenAiChat }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Intake & Directory', icon: Users },
    { id: 'resources', label: 'Hospitality & Equipment', icon: BedDouble },
    { id: 'calendar', label: 'Resource Scheduling', icon: CalendarDays },
    { id: 'feedback', label: 'Feedback & Attender Portal', icon: Star },
    { id: 'queries', label: 'Queries Desk & FAQ', icon: HelpCircle },
    { id: 'concurrency', label: 'Concurrency & Audit Logs', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen fixed left-0 top-0 shadow-xl border-r border-slate-800 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-bold">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-base leading-tight tracking-tight">CarePoint Hub</h1>
          <p className="text-xs text-teal-400 font-medium tracking-wide uppercase">Patient & Resource Manager</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600/90 text-white shadow-md shadow-teal-900/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* AI Assistant Quick Launcher */}
      <div className="px-4 py-2">
        <button
          onClick={onOpenAiChat}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-900/40 flex items-center justify-center gap-2 transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Assistant Bot</span>
        </button>
      </div>

      {/* User Info & Footer */}
      <div className="p-3 m-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-semibold flex items-center justify-center border border-teal-500/30 text-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.fullName || 'Guest User'}</p>
            <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase rounded bg-teal-950 text-teal-400 border border-teal-800/50">
              {user?.role || 'Staff'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded-xl hover:bg-rose-900/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
