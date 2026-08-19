import React from 'react';
import { Activity, ShieldCheck, Database } from 'lucide-react';

export default function Header({ systemHealth }) {
  const isConnected = systemHealth?.database === 'connected';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/80 mb-8 backdrop-blur-2xl bg-white/50 shadow-lg shadow-emerald-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 via-green-500 to-emerald-400 shadow-md shadow-emerald-500/30 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-emerald-800 to-green-600 bg-clip-text text-transparent tracking-tight">
                Pulsely
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">Resilient Job Listing Ingestion Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="glass-pill flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/80 text-xs text-slate-700 shadow-sm">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-600 font-semibold">DB Status:</span>
            <span className={`inline-flex items-center space-x-1.5 font-bold ${isConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
              <span>{isConnected ? 'Connected' : 'Offline / Mock'}</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-800 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized Public Feeds</span>
          </div>
        </div>
      </div>
    </header>
  );
}
