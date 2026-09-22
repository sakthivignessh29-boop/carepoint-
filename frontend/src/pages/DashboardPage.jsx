import React from 'react';
import { 
  Users, 
  BedDouble, 
  CalendarDays, 
  Activity, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage({ patients = [], resources = [], bookings = [], onOpenBooking, onOpenPatient }) {
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed').length;
  const totalPatientsCount = patients.length;
  const totalResourcesCount = resources.length;
  const availableResourcesCount = resources.filter(r => r.status === 'Available').length;
  const utilizationRate = totalResourcesCount > 0 
    ? Math.round(((totalResourcesCount - availableResourcesCount) / totalResourcesCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Concurrency Guard Protected
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hospitality & Resource Center</h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Real-time management for patient intake, specialized rooms, critical care beds, and medical equipment with race-condition-safe scheduling.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
            >
              <CalendarDays className="w-4 h-4" /> Schedule Resource Slot
            </button>
            <button
              onClick={onOpenPatient}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-teal-400" /> New Patient Intake
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Registered Patients</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalPatientsCount}</h3>
            <span className="text-[11px] text-teal-600 font-semibold inline-flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Active Intake Catalog
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Bookings</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{activeBookingsCount}</h3>
            <span className="text-[11px] text-blue-600 font-semibold inline-flex items-center gap-0.5 mt-0.5">
              <Clock className="w-3 h-3" /> Scheduled Slots
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Resource Inventory</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{availableResourcesCount} / {totalResourcesCount}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-0.5 mt-0.5">
              Available Now
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Facility Occupancy</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{utilizationRate}%</h3>
            <span className="text-[11px] text-indigo-600 font-semibold inline-flex items-center gap-0.5 mt-0.5">
              Current Utilization
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Intakes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900">Recent Patient Intakes</h3>
            <span className="text-xs text-slate-500 font-medium">Hospitality Requirements</span>
          </div>

          <div className="divide-y divide-slate-100">
            {patients.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-700 text-xs flex items-center justify-center border border-slate-200">
                    {p.fullName.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{p.fullName}</h4>
                    <p className="text-xs text-slate-500 font-mono">{p.patientCode} • {p.medicalSpecialty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    {p.accommodationType}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                    {p.dietaryPreferences}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Today's Reservations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4">Active Reservations</h3>
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-teal-800 mb-1">
                  <span>{b.resourceName}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Confirmed</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{b.patientName}</p>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(b.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
