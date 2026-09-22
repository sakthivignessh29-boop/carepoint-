import React, { useState } from 'react';
import { ShieldAlert, Zap, CheckCircle2, XCircle, RefreshCw, Layers } from 'lucide-react';
import { bookingsApi } from '../services/api';

export default function ConcurrencyAuditPage({ resources = [], patients = [], onBookingCreated }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const handleSimulateConflict = async () => {
    if (resources.length === 0 || patients.length === 0) return;

    setIsSimulating(true);
    const targetResource = resources[0];
    const targetPatient = patients[0];

    // Pick a slot 2 hours in future
    const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const end = new Date(Date.now() + 4 * 60 * 60 * 1000);

    const payload = {
      patientId: targetPatient.id,
      resourceId: targetResource.id,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      purpose: 'Simulated Parallel Concurrency Race Condition'
    };

    // Append log start
    addLog(`🚀 Firing 2 parallel HTTP POST /api/bookings requests for Resource ID #${targetResource.id}...`);

    try {
      // Fire simultaneous requests
      const [res1, res2] = await Promise.all([
        bookingsApi.create(payload),
        bookingsApi.create(payload)
      ]);

      if (res1.success) {
        addLog(`✅ Request #1 Succeeded (HTTP 201 Created). Booking saved & ConcurrencyToken updated.`);
      } else if (res1.isConflict) {
        addLog(`⚠️ Request #1 Rejected: ${res1.message}`);
      }

      if (res2.success) {
        addLog(`✅ Request #2 Succeeded (HTTP 201 Created).`);
      } else if (res2.isConflict) {
        addLog(`⚠️ Request #2 Rollback Guard Triggered! HTTP 409 Conflict ("⚠️ Conflict: This slot was just booked by another user. Please refresh and pick an alternate time.").`);
      }

      onBookingCreated();
    } catch (err) {
      addLog(`❌ Simulation Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-6 h-6 text-teal-400" />
          <h2 className="text-lg font-bold">Real-Time Concurrency Guard Architecture</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          The backend enforces strict isolation to eliminate double-booking race conditions:
        </p>
        <ul className="mt-3 space-y-1 text-xs text-slate-400 list-disc list-inside font-mono">
          <li><strong>Database Isolation:</strong> Executes inside a <code>Serializable</code> transaction level.</li>
          <li><strong>Time Overlap Rule:</strong> <code>(NewStart &lt; ExistingEnd) AND (NewEnd &gt; ExistingStart)</code>.</li>
          <li><strong>Optimistic Concurrency Control (OCC):</strong> EF Core <code>ConcurrencyCheck</code> token on Resource.</li>
          <li><strong>HTTP Status Code:</strong> Returns <code>HTTP 409 Conflict</code> on overlap or <code>DbUpdateConcurrencyException</code>.</li>
        </ul>
      </div>

      {/* Simulator Action Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Live Double-Booking Collision Simulator</h3>
          <p className="text-xs text-slate-500">Executes 2 simultaneous HTTP POST calls at the exact same millisecond</p>
        </div>

        <button
          onClick={handleSimulateConflict}
          disabled={isSimulating}
          className="px-5 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/20 flex items-center gap-2 transition-all"
        >
          {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
          <span>Simulate Parallel Race Condition</span>
        </button>
      </div>

      {/* Live Audit Log Stream */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl font-mono text-xs text-slate-300">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
            <h4 className="font-bold text-slate-100">Live Transaction Audit Console Log</h4>
          </div>
          <button
            onClick={() => setAuditLogs([])}
            className="text-[11px] text-slate-500 hover:text-slate-300"
          >
            Clear Console
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {auditLogs.length === 0 ? (
            <p className="text-slate-600 italic">Click "Simulate Parallel Race Condition" above to execute collision test.</p>
          ) : (
            auditLogs.map((log, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg border ${
                  log.includes('409') || log.includes('Rejected')
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                    : log.includes('Succeeded')
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
