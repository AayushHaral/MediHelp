import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface DeliveryTrackingScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const DeliveryTrackingScreen: React.FC<DeliveryTrackingScreenProps> = ({ onNavigate }) => {
  const [deliveryNote, setDeliveryNote] = useState('Ring buzzer 4B or leave with building doorman.');
  const [isSavedNote, setIsSavedNote] = useState(false);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">ac_unit</span>
            <span>Active Cold-Chain Courier Dispatch</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Live Temperature & Courier Tracking
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant">
            Real-time IoT temperature monitoring and GPS dispatch for refrigerated biologics and maintenance meds.
          </p>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-right shrink-0 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-mono text-on-surface-variant block">Estimated Arrival</span>
          <div className="text-2xl font-headline font-bold text-secondary">Today, 3:45 PM</div>
          <span className="text-xs text-emerald-700 font-semibold font-mono block mt-0.5">18 Minutes Away</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Simulated GPS Map View (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f172a] rounded-2xl overflow-hidden border border-outline-variant/30 shadow-md flex flex-col justify-between min-h-[380px] p-5 text-white relative">
          {/* Simulated Map Visual styling */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Map Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Courier GPS Active • Tracking #CP-884920</span>
            </div>
            <span className="text-xs font-mono text-white/80 bg-black/40 px-2 py-1 rounded">
              Route 101 Southbound
            </span>
          </div>

          {/* Simulated Delivery Path Diagram in Center */}
          <div className="my-auto z-10 flex flex-col items-center justify-center space-y-4 py-8">
            <div className="flex items-center gap-6 w-full max-w-sm justify-between px-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-bold shadow-lg mx-auto">
                  <span className="material-symbols-outlined text-2xl">local_pharmacy</span>
                </div>
                <span className="text-[11px] font-mono text-white/80 block mt-1">Dispense Hub</span>
              </div>

              <div className="flex-1 h-1 bg-gradient-to-r from-secondary via-emerald-400 to-white/40 rounded-full relative flex items-center justify-center">
                <div className="absolute -top-3 px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-mono font-bold animate-pulse">
                  Courier In Transit
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold border border-white/20 mx-auto">
                  <span className="material-symbols-outlined text-2xl">home</span>
                </div>
                <span className="text-[11px] font-mono text-white/80 block mt-1">Your Doorstep</span>
              </div>
            </div>

            <p className="text-xs text-center text-white/70 font-mono">
              Courier Javier M. is 1.4 miles away driving an insulated electric delivery van.
            </p>
          </div>

          {/* Map Bottom Courier Profile */}
          <div className="z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-sm">
                JM
              </div>
              <div>
                <h4 className="font-headline font-bold text-xs text-white">Javier Morales (Certified Rx Courier)</h4>
                <p className="text-[11px] text-white/70">DoorDash MedFlex Fleet • 4.98 ★ (2,100+ deliveries)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span>Call Driver</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Cold-Chain Sensor Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* IoT Sensor readout */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-2xl">thermostat</span>
                <div>
                  <h3 className="font-headline font-bold text-sm text-on-surface">Cold-Chain Temperature Sensor</h3>
                  <p className="text-[11px] text-on-surface-variant font-mono">BLE TempProbe #SN-99410</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                PASS: 100% IN RANGE
              </span>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-on-surface-variant block">
                  Current Internal Temp
                </span>
                <div className="text-3xl font-headline font-black text-blue-700">3.8°C</div>
                <span className="text-[10px] text-on-surface-variant font-mono">Safe Standard: 2.0°C – 8.0°C</span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-on-surface-variant">
              <div className="flex justify-between">
                <span>Payload Content:</span>
                <strong className="text-on-surface">Ozempic 1mg/dose (4mg/3ml)</strong>
              </div>
              <div className="flex justify-between">
                <span>Packaging:</span>
                <strong className="text-on-surface">Bio-Foam Phase-Change Gel Packs</strong>
              </div>
              <div className="flex justify-between">
                <span>Last Probe Ping:</span>
                <strong className="text-on-surface font-mono">45 seconds ago</strong>
              </div>
            </div>
          </div>

          {/* Delivery Instructions note */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-3 shadow-xs">
            <h4 className="font-headline font-bold text-xs text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">edit_note</span>
              Delivery Instructions for Driver
            </h4>

            <form onSubmit={handleSaveNote} className="space-y-2 text-xs">
              <textarea
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary text-xs"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-outline-variant/30 transition-colors"
              >
                {isSavedNote ? 'Instructions Updated!' : 'Update Delivery Note'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
