import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastNotification from './components/ToastNotification';
import PatientModal from './components/PatientModal';
import BookingModal from './components/BookingModal';
import AiChatbotModal from './components/AiChatbotModal';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import ResourcesPage from './pages/ResourcesPage';
import CalendarPage from './pages/CalendarPage';
import ConcurrencyAuditPage from './pages/ConcurrencyAuditPage';
import FeedbackPage from './pages/FeedbackPage';
import QueriesDeskPage from './pages/QueriesDeskPage';

import { patientsApi, resourcesApi, bookingsApi, feedbackApi, queriesApi } from './services/api';
import { Bot } from 'lucide-react';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  // Data states
  const [patients, setPatients] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [queries, setQueries] = useState([]);

  // Modal states
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [prefilledSlot, setPrefilledSlot] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Fetch all initial data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [pData, rData, bData, fData, qData] = await Promise.all([
        patientsApi.getAll().catch(() => []),
        resourcesApi.getAll().catch(() => []),
        bookingsApi.getAll().catch(() => []),
        feedbackApi.getAll().catch(() => []),
        queriesApi.getAll().catch(() => [])
      ]);
      setPatients(pData);
      setResources(rData);
      setBookings(bData);
      setFeedbacks(fData);
      setQueries(qData);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const showToast = (message, type = 'success', isConflict = false) => {
    setToast({ message, type, isConflict });
    setTimeout(() => setToast(null), 7000);
  };

  // Patient Actions
  const handleSavePatient = async (patientData) => {
    try {
      if (editingPatient) {
        await patientsApi.update(editingPatient.id, patientData);
        showToast(`Updated intake record for ${patientData.fullName}`, 'success');
      } else {
        await patientsApi.create(patientData);
        showToast(`Successfully registered intake for ${patientData.fullName}`, 'success');
      }
      setIsPatientModalOpen(false);
      setEditingPatient(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save patient record', 'error');
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        await patientsApi.delete(id);
        showToast('Patient record deleted successfully', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete patient record', 'error');
      }
    }
  };

  // Resource Actions
  const handleAddResource = async (resourceData) => {
    try {
      await resourcesApi.create(resourceData);
      showToast(`Added ${resourceData.name} to inventory`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to create resource', 'error');
    }
  };

  // Booking Actions (Create, Update/Reschedule, Cancel)
  const handleSaveBooking = async (bookingData) => {
    let result;
    let targetPatientId = bookingData.patientId;

    // If a new patient name was entered without an ID, create the patient record
    if (!targetPatientId && bookingData.patientName) {
      const existing = patients.find(p => p.fullName.toLowerCase() === bookingData.patientName.toLowerCase());
      if (existing) {
        targetPatientId = existing.id;
      } else {
        try {
          const newPatient = await patientsApi.create({
            fullName: bookingData.patientName,
            accommodationType: 'Deluxe Suite',
            dietaryPreferences: 'Standard',
            medicalSpecialty: 'General Hospitality'
          });
          targetPatientId = newPatient.id;
        } catch (err) {
          console.error("Auto patient creation error:", err);
          targetPatientId = patients.length > 0 ? patients[0].id : 1;
        }
      }
    }

    const payload = {
      ...bookingData,
      patientId: targetPatientId
    };

    if (payload.id) {
      result = await bookingsApi.update(payload.id, payload);
    } else {
      result = await bookingsApi.create(payload);
    }

    if (result.isConflict) {
      showToast(result.message, 'conflict', true);
      fetchData();
    } else if (result.success) {
      showToast(payload.id ? 'Booking rescheduled & updated successfully!' : 'Resource slot booked successfully!', 'success');
      
      const newBookingObj = {
        id: result.data?.id || result.data?.Id || Math.floor(Date.now() / 1000),
        patientId: targetPatientId,
        patientName: payload.patientName || (patients.find(p => p.id === targetPatientId)?.fullName) || 'Registered Patient',
        patientCode: (patients.find(p => p.id === targetPatientId)?.patientCode) || `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        resourceId: payload.resourceId,
        resourceName: payload.resourceName || (resources.find(r => r.id === payload.resourceId)?.name) || 'Assigned Resource',
        resourceType: (resources.find(r => r.id === payload.resourceId)?.type) || 'Room',
        start: payload.startTime,
        end: payload.endTime,
        purpose: payload.purpose || 'Hospitality Stay & Monitoring',
        status: payload.status || 'Booked',
        updateNotes: payload.updateNotes || ''
      };

      setBookings(prev => [newBookingObj, ...prev.filter(b => b.id !== newBookingObj.id)]);
      fetchData();
    } else {
      showToast(result.message || 'Booking operation failed.', 'error');
    }
    return result;
  };

  const handleCancelBooking = async (id) => {
    try {
      const success = await bookingsApi.cancel(id);
      if (success) {
        showToast('Reservation status set to Cancelled (HTTP 204)', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to cancel reservation.', 'error');
    }
  };

  // Feedback Actions
  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await feedbackApi.create(feedbackData);
      showToast('Feedback & Attender details submitted successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to submit feedback.', 'error');
    }
  };

  const handleRespondFeedback = async (id, responseData) => {
    try {
      await feedbackApi.respond(id, responseData);
      showToast('Staff response published successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to publish staff response.', 'error');
    }
  };

  // Query Actions
  const handleSubmitQuery = async (queryData) => {
    try {
      await queriesApi.create(queryData);
      showToast('Inquiry submitted to Queries Desk!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to submit inquiry.', 'error');
    }
  };

  const handleAnswerQuery = async (id, answerData) => {
    try {
      await queriesApi.answer(id, answerData);
      showToast('Staff desk response sent to patient & attender!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to send response.', 'error');
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setEditingBooking(null);
    setPrefilledSlot(slotInfo);
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-300">Loading CarePoint System...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Operational Overview Dashboard';
      case 'patients': return 'Patient Intake & Requirement Center';
      case 'resources': return 'Hospitality Center & Resource Inventory';
      case 'calendar': return 'Interactive Resource Scheduling Calendar';
      case 'feedback': return 'Feedback & Attender Details Portal';
      case 'queries': return 'Hospitality & Medical Queries Desk';
      case 'concurrency': return 'Concurrency Guard & Collision Audit Logs';
      default: return 'CarePoint Hub';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Banner */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Side Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={getPageTitle()} onRefresh={fetchData} isRefreshing={isRefreshing} bookings={bookings} feedbacks={feedbacks} />

        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              patients={patients}
              resources={resources}
              bookings={bookings}
              onOpenBooking={() => { setEditingBooking(null); setPrefilledSlot(null); setIsBookingModalOpen(true); }}
              onOpenPatient={() => { setEditingPatient(null); setIsPatientModalOpen(true); }}
            />
          )}

          {activeTab === 'patients' && (user?.role === 'Admin' || user?.role === 'Staff') && (
            <PatientsPage
              patients={patients}
              onAddPatient={() => { setEditingPatient(null); setIsPatientModalOpen(true); }}
              onEditPatient={(patient) => { setEditingPatient(patient); setIsPatientModalOpen(true); }}
              onDeletePatient={handleDeletePatient}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesPage
              resources={resources}
              onAddResource={handleAddResource}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarPage
              bookings={bookings}
              resources={resources}
              onSelectSlot={handleSelectSlot}
              onCancelBooking={handleCancelBooking}
              onEditBooking={(booking) => { setEditingBooking(booking); setPrefilledSlot(null); setIsBookingModalOpen(true); }}
              onOpenBookingModal={() => { setEditingBooking(null); setPrefilledSlot(null); setIsBookingModalOpen(true); }}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackPage
              feedbacks={feedbacks}
              patients={patients}
              onSubmitFeedback={handleSubmitFeedback}
              onRespondFeedback={handleRespondFeedback}
            />
          )}

          {activeTab === 'queries' && (
            <QueriesDeskPage
              queries={queries}
              patients={patients}
              onSubmitQuery={handleSubmitQuery}
              onAnswerQuery={handleAnswerQuery}
            />
          )}

          {activeTab === 'concurrency' && (user?.role === 'Admin' || user?.role === 'Staff') && (
            <ConcurrencyAuditPage
              resources={resources}
              patients={patients}
              onBookingCreated={fetchData}
            />
          )}
        </main>
      </div>

      {/* Floating AI Chatbot Button */}
      {!isAiChatOpen && (
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full shadow-2xl shadow-teal-900/50 hover:scale-105 transition-all flex items-center gap-2 group"
          title="Open AI Medical Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold pr-1">AI Assistant</span>
        </button>
      )}

      {/* Floating AI Chatbot Modal Widget */}
      <AiChatbotModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      {/* Modals */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={handleSavePatient}
        initialData={editingPatient}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setEditingBooking(null); setPrefilledSlot(null); }}
        onSubmit={handleSaveBooking}
        patients={patients}
        resources={resources}
        prefilledSlot={prefilledSlot}
        initialData={editingBooking}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
