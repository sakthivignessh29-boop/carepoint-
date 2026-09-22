import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, X, ShieldAlert } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const isConflict = toast.type === 'conflict' || toast.isConflict;
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-bounce-in">
      <div
        className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3.5 transition-all duration-300 ${
          isConflict
            ? 'bg-rose-950 text-rose-50 border-rose-600 shadow-rose-900/40'
            : isSuccess
            ? 'bg-slate-900 text-emerald-400 border-emerald-500/50 shadow-emerald-900/20'
            : 'bg-slate-900 text-slate-100 border-slate-700 shadow-slate-900/40'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isConflict ? (
            <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
          ) : isSuccess ? (
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          )}
        </div>

        <div className="flex-1">
          <h4 className={`text-sm font-bold tracking-tight ${isConflict ? 'text-rose-300' : isSuccess ? 'text-emerald-300' : 'text-slate-200'}`}>
            {isConflict ? 'HTTP 409 Double-Booking Conflict' : isSuccess ? 'Operation Successful' : 'Notice'}
          </h4>
          <p className="text-xs mt-1 leading-relaxed opacity-95">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
