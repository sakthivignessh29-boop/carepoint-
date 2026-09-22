import React, { useState } from 'react';
import { BedDouble, Stethoscope, Activity, Plus, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResourcesPage({ resources = [], onAddResource }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newResource, setNewResource] = useState({
    name: '',
    type: 'Room',
    category: 'Hospitality',
    description: '',
    status: 'Available'
  });

  const filteredResources = resources.filter((r) => {
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    onAddResource(newResource);
    setShowAddModal(false);
    setNewResource({
      name: '',
      type: 'Room',
      category: 'Hospitality',
      description: '',
      status: 'Available'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Hospitality Rooms & Specialized Equipment Inventory</h2>
          <p className="text-xs text-slate-500">Track real-time status and Optimistic Concurrency Tokens for resource scheduling</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Facility Resource
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Type Filter:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {['All', 'Room', 'Bed', 'Medical Equipment'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === t ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 font-bold shrink-0">
                {r.type === 'Room' ? <BedDouble className="w-5 h-5" /> : r.type === 'Bed' ? <Activity className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                r.status === 'Available'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : r.status === 'Maintenance'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {r.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {r.category}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1.5">{r.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.description || 'No specific notes recorded.'}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 font-mono text-[10px]" title="EF Core OCC Concurrency Token">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="truncate max-w-[140px]">Token: {r.concurrencyToken?.slice(0, 12)}...</span>
              </div>
              <span className="font-semibold text-slate-700">ID #{r.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="font-bold text-base text-slate-900 mb-4">Add Facility Resource</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-semibold mb-1">Resource Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Consultation Room 302"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Resource Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Room">Room</option>
                    <option value="Bed">Bed</option>
                    <option value="Medical Equipment">Medical Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Radiology, ICU, Hospitality"
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Facility specifications and equipment details..."
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Create Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
