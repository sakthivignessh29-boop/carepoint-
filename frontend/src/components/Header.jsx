import React from 'react';
import { Bell, ShieldCheck, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onRefresh, isRefreshing, title }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Serializable Lock Guard Active</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
        </button>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-semibold text-slate-700">{user?.fullName}</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
}
