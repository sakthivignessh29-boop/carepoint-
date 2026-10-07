import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BedDouble, UserCheck, AlertTriangle, Edit3, CheckCircle2, BadgeCheck, Ticket, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatToLocalISO = (dateValue) => {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '';
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function BookingModal({ isOpen, onClose, onSubmit, patients = [], resources = [], prefilledSlot = null, initialData = null }) {
  const { user } = useAuth();
  
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isCustomName, setIsCustomName] = useState(true);

  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: 'Hospitality Stay & Monitoring',
    status: 'Booked',
    updateNotes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmedBooking(null);
      setSubmitting(false);

      if (initialData) {
        setPatientId(initialData.patientId || '');
        setPatientName(initialData.patientName || (user?.fullName || ''));
        setIsCustomName(!initialData.patientId);

        setFormData({
          resourceId: initialData.resourceId || (resources.length > 0 ? resources[0].id : ''),
          startTime: initialData.start ? formatToLocalISO(initialData.start) : '',
          endTime: initialData.end ? formatToLocalISO(initialData.end) : '',
          purpose: initialData.purpose || 'Hospitality Stay & Monitoring',
          status: initialData.status || 'Booked',
          updateNotes: initialData.updateNotes || 'Rescheduled slot'
        });
      } else {
        // Newly logged-in patient or new booking default
        const defaultName = user?.role === 'Patient' ? (user?.fullName || '') : (user?.fullName || '');
        setPatientName(defaultName);
        setPatientId('');
        setIsCustomName(true);

        const defaultResource = resources.length > 0 ? resources[0].id : '';

        let start = prefilledSlot?.startStr ? formatToLocalISO(prefilledSlot.startStr) : '';
        let end = prefilledSlot?.endStr ? formatToLocalISO(prefilledSlot.endStr) : '';

        if (!start) {
          const now = new Date();
          now.setMinutes(0);
          now.setSeconds(0);
          start = formatToLocalISO(new Date(now.getTime() + 30 * 60 * 1000));
          end = formatToLocalISO(new Date(now.getTime() + 2.5 * 60 * 60 * 1000));
        }

        setFormData({
          resourceId: defaultResource,
          startTime: start,
          endTime: end,
          purpose: 'Hospitality Stay & Monitoring',
          status: 'Booked',
          updateNotes: ''
        });
      }
    }
  }, [isOpen, prefilledSlot, initialData, patients, resources, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const selectedResource = resources.find(r => r.id === parseInt(formData.resourceId));

    const bookingPayload = {
      id: initialData?.id,
      patientId: isCustomName ? null : parseInt(patientId),
      patientName: patientName || (user?.fullName || 'Registered Patient'),
      resourceId: parseInt(formData.resourceId),
      resourceName: selectedResource?.name || 'Assigned Resource',
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      purpose: formData.purpose,
      status: formData.status,
      updateNotes: formData.updateNotes
    };

    const result = await onSubmit(bookingPayload);
    setSubmitting(false);

    if (result && result.success) {
      // Show Booking Confirmed Screen!
      setConfirmedBooking({
        id: result.data?.id || Math.floor(1000 + Math.random() * 9000),
        patientName: bookingPayload.patientName,
        resourceName: selectedResource?.name || 'Hospitality Suite / Bed',
        resourceType: selectedResource?.type || 'Room',
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        status: 'CONFIRMED & BOOKED'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transition-all duration-300">
        
        {/* Render Booking Confirmed Screen if confirmedBooking is set */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-300">
                <BadgeCheck className="w-4 h-4 text-emerald-600" /> STATUS: CONFIRMED
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">🎉 Slot Booking Confirmed!</h2>
              <p className="text-xs text-slate-500 mt-1">Your reservation has been registered and locked in database.</p>
            </div>

            {/* Ticket Card Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Booking Ref Ticket</span>
                <span className="font-mono font-bold text-teal-700 text-sm">#BK-2026-{confirmedBooking.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
                  <span className="font-bold text-slate-900 text-sm">{confirmedBooking.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Resource</span>
                  <span className="font-bold text-teal-800 text-sm">{confirmedBooking.resourceName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">From (Start)</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(confirmedBooking.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">To (End)</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(confirmedBooking.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              {confirmedBooking.purpose && (
                <div className="pt-2 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Purpose</span>
                  <span className="text-slate-700 italic">{confirmedBooking.purpose}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Done & Return to Calendar</span>
            </button>
          </div>
        ) : (
          /* Normal Booking Form */
          <>
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  {initialData ? <Edit3 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">
                    {initialData ? 'Update & Reschedule Booking' : 'Book Patient Resource Slot'}
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
              {/* Patient Name Section (Newly logged-in patient or input) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Patient Name *</label>
                  {patients.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomName(!isCustomName)}
                      className="text-[11px] text-teal-600 hover:underline font-semibold"
                    >
                      {isCustomName ? 'Choose Existing Patient' : 'Type Patient Name'}
                    </button>
                  )}
                </div>

                {isCustomName ? (
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Patient Full Name..."
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-900 text-xs"
                    />
                  </div>
                ) : (
                  <select
                    required
                    value={patientId}
                    onChange={(e) => {
                      setPatientId(e.target.value);
                      const selected = patients.find(p => p.id === parseInt(e.target.value));
                      if (selected) setPatientName(selected.fullName);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-xs"
                  >
                    <option value="" disabled>Select Recorded Patient...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.patientCode} - {p.accommodationType})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Target Resource */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Resource (Room / Equipment) *</label>
                <select
                  required
                  value={formData.resourceId}
                  onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-teal-900 text-xs"
                >
                  <option value="" disabled>Select Resource...</option>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.type}] {r.name} - {r.category} ({r.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Pickers */}
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-teal-800 text-xs"
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
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
                >
                  {submitting ? 'Booking Slot...' : initialData ? 'Save Rescheduled Booking' : 'Confirm & Book Slot'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
