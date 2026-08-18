import React from 'react';
import { Activity, ShieldCheck, Database } from 'lucide-react';

export default function Header({ systemHealth }) {
  const isConnected = systemHealth?.database === 'connected';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 mb-8 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              JobPulse
            </h1>
            <p className="text-xs text-slate-400 font-medium">Resilient Job Listing Ingestion Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>DB Status:</span>
            <span className={`inline-flex items-center space-x-1.5 font-semibold ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{isConnected ? 'Connected' : 'Offline / Mock'}</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Authorized Public Sources</span>
          </div>
        </div>
      </div>
    </header>
  );
}
