import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, UserCheck, Clock, Filter, Lock, CheckCircle2 } from 'lucide-react';

export default function ConcurrencyAuditPage({ resources = [], patients = [] }) {
  const [activityFilter, setActivityFilter] = useState('All');

  // Realistic System Activity Audit Stream for Staff & Patients
  const systemActivities = [
    {
      id: 1,
      actor: 'Nurse Sarah Connor (Staff)',
      role: 'Staff',
      action: 'Published Staff Response to Attender Query #Q-2026-1',
      target: 'Patient Eleanor Vance (PAT-2026-1089)',
      timestamp: 'Today at 09:30 AM',
      status: 'VERIFIED & LOGGED',
      category: 'Staff Action'
    },
    {
      id: 2,
      actor: 'Robert Vance (Patient Attender)',
      role: 'Patient / Attender',
      action: 'Submitted 5-Star Hospitality Feedback & Badge ATT-2026-1089A',
      target: 'Deluxe Suite 101 - VIP Bed',
      timestamp: 'Today at 09:15 AM',
      status: 'RECORDED',
      category: 'Patient Activity'
    },
    {
      id: 3,
      actor: 'Dr. Alexander Wright (Admin)',
      role: 'Admin',
      action: 'Executed Optimistic Concurrency Token Verification',
      target: 'ICU Specialized Bed 04',
      timestamp: 'Today at 08:45 AM',
      status: 'SYSTEM LOCK SAFE',
      category: 'Administrative Lock'
    },
    {
      id: 4,
      actor: 'Claire Pendelton (Patient Attender)',
      role: 'Patient / Attender',
      action: 'Registered Dietary Requirement Query (Diabetic Low-Sugar)',
      target: 'Patient Arthur Pendelton (PAT-2026-2144)',
      timestamp: 'Today at 08:00 AM',
      status: 'RECORDED',
      category: 'Patient Activity'
    },
    {
      id: 5,
      actor: 'Nurse Sarah Connor (Staff)',
      role: 'Staff',
      action: 'Updated Patient Intake Record & Attending Physician Assignment',
      target: 'Sophia Martinez (PAT-2026-3091)',
      timestamp: 'Yesterday at 05:20 PM',
      status: 'VERIFIED & LOGGED',
      category: 'Staff Action'
    }
  ];

  const filteredActivities = activityFilter === 'All'
    ? systemActivities
    : systemActivities.filter(a => a.role.includes(activityFilter) || a.category.includes(activityFilter));

  return (
    <div className="space-y-6">
      {/* Top Monitor Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 mb-2 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrative Monitor Only
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Administrative Activity & Concurrency Audit Logs</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time security surveillance monitoring patient submissions, attender activity, staff responses, and database isolation lock states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Concurrency Lock</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active & Guarded
            </span>
          </div>
        </div>
      </div>

      {/* Activity Filter & Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm">System Activity Stream</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">Filter Activity:</span>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Activities</option>
              <option value="Staff">Staff Actions</option>
              <option value="Patient">Patient & Attender Activities</option>
              <option value="Administrative">Administrative Locks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="space-y-3">
        {filteredActivities.map((act) => (
          <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 hover:border-teal-300 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                act.role.includes('Staff')
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : act.role.includes('Admin')
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {act.role.includes('Staff') ? <UserCheck className="w-5 h-5" /> : act.role.includes('Admin') ? <Lock className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{act.actor}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-700">
                    {act.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-0.5">{act.action}</p>
                <p className="text-[11px] text-slate-500 mt-1">Target: <strong className="text-slate-800">{act.target}</strong></p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block mb-1">
                {act.status}
              </span>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-slate-400" /> {act.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
