import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  Trash2, 
  X, 
  Clock, 
  BedDouble, 
  Grid,
  List,
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CalendarPage({ bookings = [], resources = [], onSelectSlot, onCancelBooking, onOpenBookingModal, onEditBooking }) {
  const [selectedResource, setSelectedResource] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [viewMode, setViewMode] = useState('timegrid'); // 'timegrid', 'fullcalendar', 'timeline'

  // Filter bookings by selected resource & status
  const filteredBookings = bookings.filter(b => {
    const matchesResource = selectedResource === 'All' || b.resourceId === parseInt(selectedResource);
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesResource && matchesStatus;
  });

  // Time grid hours array (Full 24 Hours: 0 to 23)
  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  // Current Week Days (Mon - Sun) with hours zeroed
  const getDaysOfWeek = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    return days;
  };

  const weekDays = getDaysOfWeek();

  // Derive latest active booking for top calendar alert
  const latestBooking = bookings.length > 0
    ? [...bookings].filter(b => b.status !== 'Cancelled').sort((a, b) => new Date(b.createdAt || b.start) - new Date(a.createdAt || a.start))[0]
    : null;

  // Helper to check if a booking falls within a specific hour & day
  const getBookingForCell = (dayDate, hour) => {
    return filteredBookings.find(b => {
      if (b.status === 'Cancelled') return false;
      const bStart = new Date(b.start);
      const bEnd = new Date(b.end);

      const sameDay = 
        bStart.getFullYear() === dayDate.getFullYear() &&
        bStart.getMonth() === dayDate.getMonth() &&
        bStart.getDate() === dayDate.getDate();

      if (!sameDay) return false;

      const bStartHour = bStart.getHours();
      let bEndHour = bEnd.getHours();
      if (bEndHour <= bStartHour) {
        bEndHour = bStartHour + 1;
      }

      return hour >= bStartHour && hour < bEndHour;
    });
  };

  // Convert bookings for FullCalendar with explicit ISO dates
  const calendarEvents = filteredBookings.map((b) => ({
    id: b.id.toString(),
    title: b.title || `${b.patientName} (${b.resourceName})`,
    start: new Date(b.start).toISOString(),
    end: new Date(b.end).toISOString(),
    backgroundColor: b.status === 'Cancelled' ? '#e11d48' : b.status === 'Updated' ? '#2563eb' : '#0d9488',
    borderColor: '#0f766e',
    textColor: '#ffffff',
    extendedProps: { ...b }
  }));

  const handleCellClick = (dayDate, hour) => {
    const start = new Date(dayDate);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(dayDate);
    end.setHours(hour + 1, 0, 0, 0);

    onSelectSlot({
      startStr: start.toISOString(),
      endStr: end.toISOString()
    });
  };

  const handleConfirmCancel = async () => {
    if (selectedBookingDetails) {
      await onCancelBooking(selectedBookingDetails.id);
      setSelectedBookingDetails(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header & View Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Resource Scheduling & Booking Lifecycle</h2>
          <p className="text-xs text-slate-500">Track Booked, Updated / Rescheduled, and Cancelled resource reservations</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Resource Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Resources</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.type}] {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked / Confirmed</option>
              <option value="Updated">Updated / Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('timegrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'timegrid' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('fullcalendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'fullcalendar' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> FullCalendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
          </div>

          <button
            onClick={() => onOpenBookingModal()}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Book Time Slot
          </button>
        </div>
      </div>

      {/* Latest Booking Confirmation Alert Banner */}
      {latestBooking && (
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 rounded-2xl border border-teal-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 shrink-0 shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Latest Confirmed Booking Alert
                </span>
                <span className="text-xs text-slate-400 font-mono">#BK-2026-{latestBooking.id}</span>
              </div>
              <h4 className="font-bold text-base text-slate-100 mt-1">
                {latestBooking.resourceName} • <span className="text-teal-300 font-semibold">{latestBooking.patientName}</span>
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {new Date(latestBooking.start).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} — {new Date(latestBooking.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBookingDetails(latestBooking)}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5"
            >
              View / Change Slot Details
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: WEEKLY TIME-GRID MATRIX */}
      {viewMode === 'timegrid' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <CalendarIcon className="w-4 h-4 text-teal-600" />
              <span>Current Week Resource Scheduling Grid</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click empty slots to reserve</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold border-b border-slate-200">
                  <th className="p-3 w-20 text-center border-r border-slate-200">Time</th>
                  {weekDays.map((d, i) => {
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <th
                        key={i}
                        className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                          isToday ? 'bg-teal-100/60 text-teal-950 font-extrabold' : ''
                        }`}
                      >
                        <div>{d.toLocaleDateString([], { weekday: 'short' })}</div>
                        <div className="text-[11px] font-normal text-slate-500">
                          {d.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {hours.map((hour) => (
                  <tr key={hour} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono text-[11px] text-slate-500 text-center border-r border-slate-200 bg-slate-50/60 font-semibold">
                      {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </td>

                    {weekDays.map((dayDate, dayIdx) => {
                      const booking = getBookingForCell(dayDate, hour);
                      return (
                        <td
                          key={dayIdx}
                          className="p-1 border-r border-slate-200 last:border-r-0 min-h-[84px] h-24 relative align-top"
                        >
                          {booking ? (
                            <button
                              onClick={() => setSelectedBookingDetails(booking)}
                              className={`w-full h-full p-2.5 rounded-xl text-left text-white shadow-md hover:scale-[1.02] transition-all flex flex-col justify-between border ${
                                booking.status === 'Updated'
                                  ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 border-blue-400/50 shadow-blue-900/30'
                                  : 'bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 border-teal-400/50 shadow-teal-900/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold text-xs text-white leading-tight truncate">
                                  👤 {booking.patientName}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold shrink-0 border border-emerald-400/30">
                                  {booking.status === 'Updated' ? 'Updated' : 'Booked'}
                                </span>
                              </div>

                              <div className="text-[11px] text-teal-200 font-semibold truncate mt-1">
                                🏥 {booking.resourceName}
                              </div>

                              <div className="text-[9px] text-slate-300 font-mono font-semibold flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                                <span className="truncate">{new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-teal-400 font-bold">{booking.patientCode ? `(${booking.patientCode})` : '#BK'}</span>
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCellClick(dayDate, hour)}
                              className="w-full h-full rounded-xl border border-dashed border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-colors flex items-center justify-center text-[11px] text-slate-400 hover:text-teal-700 font-semibold group"
                            >
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" /> Book Slot
                              </span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FULLCALENDAR ENGINE */}
      {viewMode === 'fullcalendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[600px]">
          <FullCalendar
            key={viewMode + '-' + calendarEvents.length}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay,dayGridMonth'
            }}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={calendarEvents}
            select={(info) => onSelectSlot({ startStr: info.startStr, endStr: info.endStr })}
            eventClick={(info) => setSelectedBookingDetails(info.event.extendedProps)}
            eventContent={(eventInfo) => {
              const b = eventInfo.event.extendedProps;
              return (
                <div className="p-1.5 leading-tight overflow-hidden text-xs font-semibold text-white bg-slate-900 rounded-lg border border-teal-500/40 shadow-xs h-full flex flex-col justify-between">
                  <div className="font-black text-xs text-emerald-300 truncate">
                    👤 {b.patientName || eventInfo.event.title}
                  </div>
                  <div className="text-[10px] text-teal-100 font-bold truncate">
                    🏥 {b.resourceName || 'Resource'}
                  </div>
                  <div className="text-[9px] text-slate-300 font-mono opacity-90 flex justify-between">
                    <span>⏰ {eventInfo.timeText}</span>
                    <span>{b.status || 'Booked'}</span>
                  </div>
                </div>
              );
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={false}
            height="650px"
            slotDuration="00:30:00"
            expandRows={true}
          />
        </div>
      )}

      {/* VIEW 3: TIMELINE LIST VIEW WITH STATUS BADGES */}
      {viewMode === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">Booking Lifecycle Timeline (Booked, Updated, Cancelled)</h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">{filteredBookings.length} Total Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.length === 0 ? (
              <div className="col-span-full text-center py-6 text-slate-400 text-xs">
                No reservation entries found matching the status filter.
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
                      {b.resourceType}
                    </span>

                    {/* STATUS BADGES: Booked, Updated, Cancelled */}
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : b.status === 'Updated'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {b.status === 'Booked' ? 'Booked / Confirmed' : b.status === 'Updated' ? 'Updated / Rescheduled' : 'Cancelled'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{b.resourceName}</h4>
                  <p className="text-xs text-slate-700 font-semibold">{b.patientName} ({b.patientCode})</p>

                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {new Date(b.start).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - {new Date(b.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {b.updateNotes && (
                    <div className="text-[10px] text-blue-800 bg-blue-50 p-2 rounded border border-blue-200">
                      <strong>Reschedule Note:</strong> {b.updateNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <button
                      onClick={() => onEditBooking(b)}
                      disabled={b.status === 'Cancelled'}
                      className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 disabled:opacity-40"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit / Reschedule
                    </button>
                    <button
                      onClick={() => setSelectedBookingDetails(b)}
                      className="text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Booking Details / Cancellation & Reschedule Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Booking Reservation Details</h3>
              <button onClick={() => setSelectedBookingDetails(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Resource</p>
                  <h4 className="text-sm font-bold text-teal-950 mt-0.5">{selectedBookingDetails.resourceName}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                  selectedBookingDetails.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : selectedBookingDetails.status === 'Updated'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedBookingDetails.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{selectedBookingDetails.patientName} ({selectedBookingDetails.patientCode})</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500">Start Time:</span>
                  <span className="font-mono text-slate-800">{new Date(selectedBookingDetails.start).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500">End Time:</span>
                  <span className="font-mono text-slate-800">{new Date(selectedBookingDetails.end).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="font-semibold text-slate-800">{selectedBookingDetails.purpose || 'Hospitality Reservation'}</span>
                </div>

                {selectedBookingDetails.updateNotes && (
                  <div className="p-2 bg-blue-50 text-blue-900 rounded border border-blue-200">
                    <strong>Update Note:</strong> {selectedBookingDetails.updateNotes}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="px-3 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  Close
                </button>

                {selectedBookingDetails.status !== 'Cancelled' && (
                  <>
                    <button
                      onClick={() => {
                        const target = selectedBookingDetails;
                        setSelectedBookingDetails(null);
                        onEditBooking(target);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit / Reschedule
                    </button>

                    <button
                      onClick={handleConfirmCancel}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancel (204)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
