import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Send, 
  User, 
  ShieldCheck, 
  BadgeCheck, 
  CheckCircle2, 
  Phone, 
  HeartHandshake,
  Filter,
  Sparkles,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FeedbackPage({ feedbacks = [], patients = [], onSubmitFeedback, onRespondFeedback }) {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'Admin' || user?.role === 'Staff';

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State with Attender Details
  const [formData, setFormData] = useState({
    patientId: patients.length > 0 ? patients[0].id : '',
    attenderName: '',
    attenderRelationship: 'Spouse',
    attenderContact: '',
    attenderBadgeId: '',
    rating: 5,
    category: 'Hospitality Suite',
    comments: ''
  });

  // Staff Response Form state
  const [replyText, setReplyText] = useState({});
  const [replyStatus, setReplyStatus] = useState({});

  const filteredFeedbacks = categoryFilter === 'All'
    ? feedbacks
    : feedbacks.filter(f => f.category === categoryFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback({
      patientId: parseInt(formData.patientId),
      attenderName: formData.attenderName,
      attenderRelationship: formData.attenderRelationship,
      attenderContact: formData.attenderContact,
      attenderBadgeId: formData.attenderBadgeId,
      rating: parseInt(formData.rating),
      category: formData.category,
      comments: formData.comments
    });
    setShowSubmitModal(false);
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      attenderName: '',
      attenderRelationship: 'Spouse',
      attenderContact: '',
      attenderBadgeId: '',
      rating: 5,
      category: 'Hospitality Suite',
      comments: ''
    });
  };

  const handleSendReply = (feedbackId) => {
    const text = replyText[feedbackId];
    const status = replyStatus[feedbackId] || 'Action Taken';
    if (!text) return;

    onRespondFeedback(feedbackId, { staffResponse: text, status });
    setReplyText({ ...replyText, [feedbackId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Feedback & Patient Attender Registry</h2>
          <p className="text-xs text-slate-500">
            {isAdminOrStaff
              ? 'Review patient & attender satisfaction ratings, attender contact details, and publish staff responses'
              : 'Submit feedback for hospitality accommodations, dietary catering, and nursing care'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Categories</option>
              <option value="Hospitality Suite">Hospitality Suite</option>
              <option value="Catering & Dietary">Catering & Dietary</option>
              <option value="Nursing Care">Nursing Care</option>
              <option value="Facilities & Cleanliness">Facilities & Cleanliness</option>
            </select>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Submit Feedback & Attender Info
          </button>
        </div>
      </div>

      {/* List of Feedback Submissions */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No feedback entries found. Click "Submit Feedback & Attender Info" to add one.
          </div>
        ) : (
          filteredFeedbacks.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              {/* Top Row: Patient, Rating, Category, Status */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-200">
                    {f.patientName ? f.patientName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{f.patientName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{f.patientCode} • {f.accommodationType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < f.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-900 ml-1">{f.rating}/5</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800">
                    {f.category}
                  </span>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    f.status === 'Action Taken'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : f.status === 'Reviewed'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {f.status}
                  </span>
                </div>
              </div>

              {/* Patient Attender Details Box (CRITICAL REQUIREMENT) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Attender Details: <strong className="text-teal-950">{f.attenderName}</strong> ({f.attenderRelationship})</span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" /> {f.attenderContact || 'N/A'}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border text-teal-800 font-mono font-semibold">
                    Badge: {f.attenderBadgeId || 'ATT-2026'}
                  </span>
                </div>
              </div>

              {/* Feedback Comments */}
              <div className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                "{f.comments}"
              </div>

              {/* Staff Response Section */}
              {f.staffResponse ? (
                <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-teal-950">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-teal-600" /> Response from Staff & Administration
                    </span>
                    <span className="text-[10px] text-teal-700 font-mono">{f.status}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">{f.staffResponse}</p>
                </div>
              ) : isAdminOrStaff ? (
                /* Inline Staff Reply Box */
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Administrator / Staff Response:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write response or action taken..."
                      value={replyText[f.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [f.id]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendReply(f.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Publish Answer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  Awaiting response from hospital administration...
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Feedback Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Submit Feedback & Attender Information</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
              {/* Select Patient */}
              <div>
                <label className="block font-semibold mb-1">Target Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode})</option>
                  ))}
                </select>
              </div>

              {/* Patient Attender Details Fields */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                <h4 className="font-bold text-teal-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" /> Patient Attender Details
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attender Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Vance"
                      value={formData.attenderName}
                      onChange={(e) => setFormData({ ...formData, attenderName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                    <select
                      value={formData.attenderRelationship}
                      onChange={(e) => setFormData({ ...formData, attenderRelationship: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Relative">Relative</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone / Email</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.attenderContact}
                      onChange={(e) => setFormData({ ...formData, attenderContact: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attender Badge ID</label>
                    <input
                      type="text"
                      placeholder="ATT-2026-1089A"
                      value={formData.attenderBadgeId}
                      onChange={(e) => setFormData({ ...formData, attenderBadgeId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Rating & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Satisfaction Rating</label>
                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1"
                      >
                        <Star className={`w-5 h-5 ${star <= formData.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Service Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Hospitality Suite">Hospitality Suite</option>
                    <option value="Catering & Dietary">Catering & Dietary</option>
                    <option value="Nursing Care">Nursing Care</option>
                    <option value="Facilities & Cleanliness">Facilities & Cleanliness</option>
                  </select>
                </div>
              </div>

              {/* Feedback Comments */}
              <div>
                <label className="block font-semibold mb-1">Feedback Comments *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe your hospitality experience, dietary satisfaction, or care quality..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
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
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
