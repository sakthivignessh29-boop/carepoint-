import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BedDouble, UserCheck, AlertTriangle, Edit3 } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, onSubmit, patients = [], resources = [], prefilledSlot = null, initialData = null }) {
  const [formData, setFormData] = useState({
    patientId: '',
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: 'Hospitality Stay & Monitoring',
    status: 'Booked',
    updateNotes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          patientId: initialData.patientId || (patients.length > 0 ? patients[0].id : ''),
          resourceId: initialData.resourceId || (resources.length > 0 ? resources[0].id : ''),
          startTime: initialData.start ? new Date(initialData.start).toISOString().slice(0, 16) : '',
          endTime: initialData.end ? new Date(initialData.end).toISOString().slice(0, 16) : '',
          purpose: initialData.purpose || 'Hospitality Stay & Monitoring',
          status: initialData.status || 'Updated',
          updateNotes: initialData.updateNotes || 'Rescheduled slot'
        });
      } else {
        const defaultPatient = patients.length > 0 ? patients[0].id : '';
        const defaultResource = resources.length > 0 ? resources[0].id : '';

        let start = prefilledSlot?.startStr ? new Date(prefilledSlot.startStr).toISOString().slice(0, 16) : '';
        let end = prefilledSlot?.endStr ? new Date(prefilledSlot.endStr).toISOString().slice(0, 16) : '';

        if (!start) {
          const now = new Date();
          now.setMinutes(0);
          now.setSeconds(0);
          start = new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
          end = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
        }

        setFormData({
          patientId: defaultPatient,
          resourceId: defaultResource,
          startTime: start,
          endTime: end,
          purpose: 'Hospitality Stay & Monitoring',
          status: 'Booked',
          updateNotes: ''
        });
      }
    }
  }, [isOpen, prefilledSlot, initialData, patients, resources]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      patientId: parseInt(formData.patientId),
      resourceId: parseInt(formData.resourceId),
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      purpose: formData.purpose,
      status: formData.status,
      updateNotes: formData.updateNotes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              {initialData ? <Edit3 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Update & Reschedule Booking' : 'Book Patient Resource'}
              </h3>
              <p className="text-xs text-slate-400">Concurrency-protected reservation engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-700 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Patient *</label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
            >
              <option value="" disabled>Select Patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.patientCode} - {p.accommodationType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Resource (Room / Equipment) *</label>
            <select
              required
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-teal-900"
            >
              <option value="" disabled>Select Resource...</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.type}] {r.name} - {r.category} ({r.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">End Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {initialData && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Booking Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-teal-800"
                >
                  <option value="Booked">Booked / Confirmed</option>
                  <option value="Updated">Updated / Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Update Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Rescheduled on physician request"
                  value={formData.updateNotes}
                  onChange={(e) => setFormData({ ...formData, updateNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose & Special Medical Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. VIP Suite Stay, Cardiac Scan, Post-op Monitoring"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Concurrency Check Active:</strong> Rescheduled slots are checked against existing DB bookings. Overlaps trigger an <code>HTTP 409 Conflict</code> rollback.
            </span>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all"
            >
              {initialData ? 'Save Rescheduled Booking' : 'Confirm & Book Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
