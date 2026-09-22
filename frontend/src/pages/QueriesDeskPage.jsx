import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, Clock, MessageSquare, Plus, Filter, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function QueriesDeskPage({ queries = [], patients = [], onSubmitQuery, onAnswerQuery }) {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'Admin' || user?.role === 'Staff';

  const [statusFilter, setStatusFilter] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [formData, setFormData] = useState({
    patientId: patients.length > 0 ? patients[0].id : '',
    attenderName: '',
    subject: '',
    question: '',
    category: 'General Inquiry'
  });

  const [replyText, setReplyText] = useState({});

  const filteredQueries = statusFilter === 'All'
    ? queries
    : queries.filter(q => q.status === statusFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitQuery({
      patientId: formData.patientId ? parseInt(formData.patientId) : null,
      attenderName: formData.attenderName,
      subject: formData.subject,
      question: formData.question,
      category: formData.category
    });
    setShowSubmitModal(false);
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      attenderName: '',
      subject: '',
      question: '',
      category: 'General Inquiry'
    });
  };

  const handleSendAnswer = (queryId) => {
    const text = replyText[queryId];
    if (!text) return;

    onAnswerQuery(queryId, { answer: text, status: 'Resolved' });
    setReplyText({ ...replyText, [queryId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Hospitality & Medical Queries Desk</h2>
          <p className="text-xs text-slate-500">Submit inquiries regarding room allocations, dietary plans, visiting hours, or medical protocols</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Ask New Inquiry
          </button>
        </div>
      </div>

      {/* Query List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No queries found. Click "Ask New Inquiry" to post a question to the staff desk.
          </div>
        ) : (
          filteredQueries.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-teal-800">
                    {q.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{q.subject}</h3>
                  <p className="text-xs text-slate-500">
                    Asked by: <strong className="text-slate-800">{q.attenderName || q.patientName || 'Guest'}</strong> • {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  q.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                }`}>
                  {q.status}
                </span>
              </div>

              {/* Question Text */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
                "{q.question}"
              </div>

              {/* Answer Box */}
              {q.answer ? (
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-teal-950">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" /> Answered by {q.answeredBy || 'Nursing Staff'}
                    </span>
                    <span className="text-[10px] text-teal-700 font-mono">
                      {q.answeredAt ? new Date(q.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">{q.answer}</p>
                </div>
              ) : isAdminOrStaff ? (
                /* Inline Answer Form for Admin/Staff */
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Staff Desk Answer:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type response to answer query..."
                      value={replyText[q.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendAnswer(q.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Resolve & Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  Awaiting response from medical staff desk...
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Query Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Ask Queries Desk</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-semibold mb-1">Assigned Patient (Optional)</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">General Inquiry (No Patient)</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Your Name / Attender Name</label>
                <input
                  type="text"
                  placeholder="e.g. Robert Vance"
                  value={formData.attenderName}
                  onChange={(e) => setFormData({ ...formData, attenderName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Room Allocation">Room Allocation</option>
                  <option value="Dietary & Catering">Dietary & Catering</option>
                  <option value="Visiting Hours">Visiting Hours</option>
                  <option value="Medical Specialty">Medical Specialty</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overnight stay policies for Deluxe Suite"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Question Details *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Type your question or request details..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
