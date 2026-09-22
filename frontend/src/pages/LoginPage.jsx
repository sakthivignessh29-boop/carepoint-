import React, { useState } from 'react';
import { Stethoscope, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: 'admin@hospitality.org',
    password: 'Admin@123',
    role: 'Admin'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData.fullName, formData.email, formData.password, formData.role);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (role, email, pass) => {
    setFormData({
      ...formData,
      role,
      email,
      password: pass
    });
    setIsRegister(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
            <Stethoscope className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">CarePoint Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Hospitality & Patient Resource Management</p>
        </div>

        {/* Preset Quick Logins */}
        <div className="mb-6 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Quick Demo Preset Logins</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setPreset('Admin', 'admin@hospitality.org', 'Admin@123')}
              className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-colors ${formData.email === 'admin@hospitality.org' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Admin
            </button>
            <button
              onClick={() => setPreset('Staff', 'staff@hospitality.org', 'Staff@123')}
              className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-colors ${formData.email === 'staff@hospitality.org' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Nurse / Staff
            </button>
            <button
              onClick={() => setPreset('Patient', 'patient@hospitality.org', 'Patient@123')}
              className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-colors ${formData.email === 'patient@hospitality.org' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Patient
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Dr. Alexander Wright"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@hospitality.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">System Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 px-3 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Patient">Patient / Guest</option>
                <option value="Staff">Nurse / Staff</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-teal-400 hover:underline font-medium"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
}
