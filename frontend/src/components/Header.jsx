import React from 'react';
import { Bell, ShieldCheck, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onRefresh, isRefreshing, title, bookings = [], feedbacks = [] }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Derive notifications from recent bookings and feedback
  const notifications = [
    ...(bookings || []).slice(0, 4).map(b => ({
      id: `b-${b.id}`,
      type: 'booking',
      title: `Slot Booked: ${b.resourceName}`,
      detail: `Patient ${b.patientName} • Status: ${b.status}`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
    })),
    ...(feedbacks || []).slice(0, 3).map(f => ({
      id: `f-${f.id}`,
      type: 'feedback',
      title: `Feedback: ${f.category} (${f.rating}★)`,
      detail: `${f.patientName} (${f.attenderName || 'Attender'}): "${f.comments ? f.comments.slice(0, 40) : ''}..."`,
      time: f.createdAt ? new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
    }))
  ];

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

        {/* Notifications Center Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="View Booking Notifications & Feedback"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Notifications & Alerts</h4>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  {notifications.length} New
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No recent notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs hover:bg-teal-50/50 transition-colors">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className={n.type === 'booking' ? 'text-teal-700' : 'text-amber-700'}>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{n.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
