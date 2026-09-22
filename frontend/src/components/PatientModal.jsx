import React, { useState, useEffect } from 'react';
import { X, UserPlus, FileText, HeartPulse, Bed, Utensils, Accessibility, Stethoscope } from 'lucide-react';

export default function PatientModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '1990-01-01',
    gender: 'Female',
    contactInfo: '',
    emergencyContact: '',
    accommodationType: 'Standard Room',
    dietaryPreferences: 'None',
    accessibilityNeeds: 'None',
    medicalSpecialty: 'General Medicine',
    attendingPhysician: 'Dr. Sarah Jenkins',
    specialNotes: '',
    status: 'Admitted'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '1990-01-01',
        gender: initialData.gender || 'Female',
        contactInfo: initialData.contactInfo || '',
        emergencyContact: initialData.emergencyContact || '',
        accommodationType: initialData.accommodationType || 'Standard Room',
        dietaryPreferences: initialData.dietaryPreferences || 'None',
        accessibilityNeeds: initialData.accessibilityNeeds || 'None',
        medicalSpecialty: initialData.medicalSpecialty || 'General Medicine',
        attendingPhysician: initialData.attendingPhysician || 'Dr. Sarah Jenkins',
        specialNotes: initialData.specialNotes || '',
        status: initialData.status || 'Admitted'
      });
    } else {
      setFormData({
        fullName: '',
        dateOfBirth: '1990-01-01',
        gender: 'Female',
        contactInfo: '',
        emergencyContact: '',
        accommodationType: 'Standard Room',
        dietaryPreferences: 'None',
        accessibilityNeeds: 'None',
        medicalSpecialty: 'General Medicine',
        attendingPhysician: 'Dr. Sarah Jenkins',
        specialNotes: '',
        status: 'Admitted'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Patient Intake & Requirements' : 'New Patient Intake Registration'}
              </h3>
              <p className="text-xs text-slate-400">Specify medical requirements & hospitality accommodation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Section 1: Basic Info */}
          <div>
            <h4 className="font-semibold text-xs text-teal-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> 1. Patient Demographics & Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara Oswald"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-teal-800"
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Phone / Email</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  placeholder="Name & Relationship (+1 555...)"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 2: Hospitality & Requirements */}
          <div>
            <h4 className="font-semibold text-xs text-teal-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Bed className="w-4 h-4" /> 2. Hospitality Center & Accommodation Preferences
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Accommodation Type</label>
                <select
                  value={formData.accommodationType}
                  onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="Standard Room">Standard Room</option>
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="ICU / Specialized Bed">ICU / Specialized Bed</option>
                  <option value="Day Ward">Day Ward</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dietary & Catering</label>
                <select
                  value={formData.dietaryPreferences}
                  onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="None">Standard Menu (No Restrictions)</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Diabetic">Diabetic (Low Sugar)</option>
                  <option value="Low Sodium">Low Sodium (Cardiac Care)</option>
                  <option value="Allergies">Severe Food Allergies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobility & Accessibility</label>
                <select
                  value={formData.accessibilityNeeds}
                  onChange={(e) => setFormData({ ...formData, accessibilityNeeds: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="None">None (Independent)</option>
                  <option value="Wheelchair Accessible">Wheelchair Accessible</option>
                  <option value="Oxygen Supply">Continuous Oxygen Feed</option>
                  <option value="Nurse Assistance">24/7 Nurse Assistance Required</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Medical Specialty</label>
                <select
                  value={formData.medicalSpecialty}
                  onChange={(e) => setFormData({ ...formData, medicalSpecialty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="ICU">ICU / Critical Care</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Attending Physician</label>
              <input
                type="text"
                placeholder="Dr. Sarah Jenkins"
                value={formData.attendingPhysician}
                onChange={(e) => setFormData({ ...formData, attendingPhysician: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Special Notes & Hospitality Requests</label>
              <textarea
                rows="2"
                placeholder="Specify guest preferences, medical equipment requests, or dietary details..."
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Modal Footer */}
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
              {initialData ? 'Save Changes' : 'Complete Intake Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
