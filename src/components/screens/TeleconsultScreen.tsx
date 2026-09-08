import React, { useState } from 'react';
import { ScreenType, TeleconsultDoctor } from '../../types';
import { MOCK_DOCTORS } from '../../data/mockData';

interface TeleconsultScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const TeleconsultScreen: React.FC<TeleconsultScreenProps> = ({ onNavigate }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<TeleconsultDoctor>(MOCK_DOCTORS[0]);
  const [consultationType, setConsultationType] = useState<'video' | 'async-chat'>('video');
  const [activeTab, setActiveTab] = useState<'intake' | 'live-room' | 'rx-issued'>('intake');
  const [patientChiefComplaint, setPatientChiefComplaint] = useState('Prescription Refill Renewal for Atorvastatin 20mg');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'doc' | 'patient'; text: string; time: string }>>([
    {
      sender: 'doc',
      text: "Hello Sarah, I've reviewed your prior lipid panel and pharmacy fill history. How are you tolerating the 20mg dosage?",
      time: '2:31 PM'
    },
    {
      sender: 'patient',
      text: 'Tolerating it very well Dr. Rostova. No muscle soreness or aches. Just ran out of refills on my 90-day bottle.',
      time: '2:32 PM'
    },
    {
      sender: 'doc',
      text: 'Excellent. Your liver enzymes and eGFR were normal last quarter. I am approving an e-prescription renewal for a 90-day supply with 3 refills routed directly to your preferred pharmacy.',
      time: '2:33 PM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', text: inputMsg, time: 'Just now' }
    ]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Teleconsult Banner */}
      <div className="bg-gradient-to-r from-primary-container via-surface-container-highest to-surface-container-high rounded-2xl p-6 md:p-8 text-white border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">videocam</span>
            <span>Board-Certified Virtual Clinic</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Same-Day Virtual Consult & Rx Renewal
          </h1>
          <p className="text-xs md:text-sm text-inverse-on-surface/80">
            Meet with licensed doctors and clinical pharmacotherapists in minutes. Get legal e-prescriptions sent immediately to any US pharmacy.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-white/15 text-center shrink-0 w-full md:w-auto">
          <span className="text-[10px] uppercase font-mono text-white/70 block">Average Wait Time</span>
          <div className="text-2xl font-headline font-bold text-secondary-fixed">8 Minutes</div>
          <span className="text-xs text-white/80 block mt-0.5">Insurance or Flat $45</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('intake')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'intake'
              ? 'bg-secondary text-white'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">assignment</span>
          <span>1. Clinical Intake & Provider</span>
        </button>

        <button
          onClick={() => setActiveTab('live-room')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'live-room'
              ? 'bg-secondary text-white'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">video_chat</span>
          <span>2. Live Virtual Exam Room</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('rx-issued')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'rx-issued'
              ? 'bg-secondary text-white'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>3. Digital e-Prescription Slip</span>
        </button>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Selection list */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-mono uppercase font-bold text-on-surface">Available Clinical Specialists</h3>
            {MOCK_DOCTORS.map((doc) => {
              const isSelected = selectedDoctor.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface-container-lowest border-secondary ring-2 ring-secondary/30 shadow-xs'
                      : 'bg-surface-container-low border-outline-variant/30 hover:border-secondary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-outline-variant/30"
                    />
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">{doc.name}</h4>
                      <p className="text-[11px] text-on-surface-variant">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="text-amber-600 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px] fill">star</span>
                          {doc.rating}
                        </span>
                        <span className="text-on-surface-variant">({doc.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium font-mono">{doc.availableSlot}</span>
                    <span className="font-headline font-bold text-on-surface">${doc.fee} visit</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinical Intake Form */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-5 shadow-xs">
            <div>
              <h2 className="font-headline font-bold text-lg text-on-surface">Clinical Pre-Visit Questionnaire</h2>
              <p className="text-xs text-on-surface-variant">
                HIPAA-compliant medical triage securely delivered to {selectedDoctor.name}.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block">Primary Reason for Telehealth Visit</label>
                <input
                  type="text"
                  value={patientChiefComplaint}
                  onChange={(e) => setPatientChiefComplaint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline-variant/30 font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">Recent Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    defaultValue="118 / 76 mmHg"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 font-mono text-on-surface focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">Documented Drug Allergies</label>
                  <input
                    type="text"
                    defaultValue="Penicillin V, Sulfa Antibiotics"
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 font-mono text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block">Consultation Medium Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType('video')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      consultationType === 'video'
                        ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
                        : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-base">videocam</span>
                      <span>HD Video Exam</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1">Live face-to-face physician evaluation</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('async-chat')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      consultationType === 'async-chat'
                        ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
                        : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-base">chat</span>
                      <span>Secure Asynchronous Chat</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1">Reviewed by physician within 30 min</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-mono">
                Copay: <strong>$0 with BCBS Gold PPO</strong> (or $45 Cash)
              </span>

              <button
                onClick={() => setActiveTab('live-room')}
                className="px-6 py-2.5 bg-secondary text-white font-headline font-semibold text-xs rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Enter Virtual Exam Room</span>
                <span className="material-symbols-outlined text-[16px]">login</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Exam Room */}
      {activeTab === 'live-room' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulated Video feed */}
          <div className="lg:col-span-2 bg-[#0c1a2e] rounded-2xl overflow-hidden border border-outline-variant/30 relative flex flex-col justify-between p-4 min-h-[380px] shadow-lg">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>HIPAA Encrypted Stream (04:12)</span>
              </div>
              <span className="text-xs text-white/80 font-mono">Provider: {selectedDoctor.name}</span>
            </div>

            {/* Simulated Doctor Video Avatar */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 my-auto">
              <div className="w-28 h-28 rounded-full border-4 border-secondary overflow-hidden shadow-2xl relative">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-white">{selectedDoctor.name}</h3>
                <p className="text-xs text-secondary-fixed font-mono">{selectedDoctor.specialty}</p>
                <p className="text-[11px] text-white/60 mt-1">Audio & Video Connected (1080p 60fps)</p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-4 py-2 z-10">
              <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">videocam</span>
              </button>
              <button
                onClick={() => setActiveTab('rx-issued')}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-headline font-semibold text-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Issue & Sign Prescription</span>
              </button>
              <button
                onClick={() => setActiveTab('intake')}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">call_end</span>
              </button>
            </div>
          </div>

          {/* Live Clinical Chat */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col h-[400px] shadow-xs">
            <div className="p-3 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
              <h4 className="font-headline font-bold text-xs text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-base">chat</span>
                Clinical Consultation Transcript
              </h4>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Active</span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'patient'
                        ? 'bg-secondary text-white rounded-br-none'
                        : 'bg-surface-container text-on-surface rounded-bl-none border border-outline-variant/30'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/70 mt-1 font-mono">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t border-outline-variant/20 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type clinical inquiry..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-surface-container border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-secondary text-white rounded-lg text-xs font-semibold hover:bg-secondary/90 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Issued View */}
      {activeTab === 'rx-issued' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 max-w-3xl mx-auto space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">Electronic Prescription Authorized</h3>
                <p className="text-xs text-on-surface-variant">NCPDP SCRIPT Standard v2017071 Compliant e-Rx</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
              Rx #ERX-982410-CA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant uppercase block">Prescriber</span>
              <strong className="text-on-surface block text-sm">{selectedDoctor.name}</strong>
              <span className="text-[11px] text-on-surface-variant">NPI: 1982049182 • DEA: BR8492014</span>
            </div>
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant uppercase block">Patient</span>
              <strong className="text-on-surface block text-sm">Sarah Jenkins (DOB: 05/14/1988)</strong>
              <span className="text-[11px] text-on-surface-variant">Auth Date: Today • 3 Authorized Refills</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 space-y-2">
            <span className="text-xs font-bold text-secondary uppercase font-mono">Medication & Sig:</span>
            <p className="font-headline font-bold text-base text-on-surface">
              Atorvastatin Calcium 20 mg Oral Tablet
            </p>
            <p className="text-xs text-on-surface-variant">
              SIG: Take 1 tablet by mouth daily at bedtime for hyperlipidemia. Dispense #90 (Ninety) tablets. Refills: 3.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('discount-card')}
              className="w-full sm:w-auto px-6 py-2.5 bg-secondary text-white font-headline font-semibold text-xs rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">badge</span>
              <span>Open Digital Discount Card for Pickup</span>
            </button>

            <button
              onClick={() => onNavigate('delivery-tracking')}
              className="w-full sm:w-auto px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs rounded-lg border border-outline-variant/30 transition-colors"
            >
              Order Cold-Chain Home Delivery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
