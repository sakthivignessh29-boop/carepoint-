import React, { useState } from 'react';
import { Search, Plus, UserCheck, Utensils, Accessibility, Bed, Stethoscope, Trash2, Edit } from 'lucide-react';

export default function PatientsPage({ patients = [], onAddPatient, onEditPatient, onDeletePatient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [accommodationFilter, setAccommodationFilter] = useState('All');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicalSpecialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesAccommodation = accommodationFilter === 'All' || p.accommodationType === accommodationFilter;

    return matchesSearch && matchesStatus && matchesAccommodation;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Patient Intake & Requirements Directory</h2>
          <p className="text-xs text-slate-500">Manage patient demographics, hospitality accommodations, and dietary needs</p>
        </div>

        <button
          onClick={onAddPatient}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Register New Patient Intake
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, code (PAT-2026-...), or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>

        {/* Accommodation Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Accommodation:</span>
          <select
            value={accommodationFilter}
            onChange={(e) => setAccommodationFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Accommodations</option>
            <option value="Standard Room">Standard Room</option>
            <option value="Deluxe Suite">Deluxe Suite</option>
            <option value="ICU / Specialized Bed">ICU / Specialized Bed</option>
            <option value="Day Ward">Day Ward</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Patient Code & Name</th>
                <th className="p-4">Demographics</th>
                <th className="p-4">Hospitality Accommodation</th>
                <th className="p-4">Dietary & Catering</th>
                <th className="p-4">Accessibility Needs</th>
                <th className="p-4">Attending Physician</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 font-normal">
                    No patient intake records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{p.fullName}</div>
                      <span className="font-mono text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {p.patientCode}
                      </span>
                    </td>

                    <td className="p-4">
                      <div>{p.gender}, DOB: {p.dateOfBirth ? p.dateOfBirth.split('T')[0] : 'N/A'}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{p.contactInfo || 'No Phone'}</div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        <Bed className="w-3.5 h-3.5 text-teal-600" />
                        {p.accommodationType}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        p.dietaryPreferences === 'Diabetic' || p.dietaryPreferences === 'Low Sodium'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        <Utensils className="w-3.5 h-3.5 text-slate-500" />
                        {p.dietaryPreferences}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        p.accessibilityNeeds !== 'None'
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          : 'bg-slate-50 text-slate-600'
                      }`}>
                        <Accessibility className="w-3.5 h-3.5 text-indigo-600" />
                        {p.accessibilityNeeds}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{p.attendingPhysician}</div>
                      <div className="text-[11px] text-slate-500">{p.medicalSpecialty}</div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        p.status === 'Admitted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : p.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditPatient(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-colors"
                          title="Edit Patient"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePatient(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
