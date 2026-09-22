import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, HelpCircle, MessageSquare } from 'lucide-react';
import { chatApi } from '../services/api';

export default function AiChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hello! I am your CarePoint Healthcare & Hospitality AI Assistant. How can I assist you with room bookings, visiting hours, dietary menus, or emergency protocols today?',
      category: 'Welcome'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const response = await chatApi.ask({ prompt: textToSend });
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: response.reply,
        category: response.category
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, I am having trouble connecting to the hospital AI server right now. Please try again or contact the nursing desk.',
        category: 'Error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Visiting Hours & Overnight Stay',
    'Dietary & Menu Options',
    'Room & Bed Booking Rules',
    'Emergency Assistance'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] animate-bounce-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              CarePoint AI Assistant <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            </h3>
            <span className="text-[10px] text-teal-400 font-medium">Hospitality & Medical Desk Bot</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Chips */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-600 shrink-0 font-medium transition-all shadow-2xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none shadow-md shadow-teal-600/10'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
              }`}
            >
              {m.text}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
            <Bot className="w-4 h-4 text-teal-600 animate-spin" />
            <span>AI Assistant is typing response...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Footer Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI about rooms, dietary, visiting hours..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-teal-600/20 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
