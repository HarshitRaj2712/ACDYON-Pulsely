import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="glass-panel rounded-2xl p-8 border border-rose-300 bg-rose-50/90 my-8 max-w-lg mx-auto text-center shadow-lg shadow-rose-500/5">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-black text-rose-900 mb-1">Service Error Encountered</h3>
      <p className="text-xs text-rose-700 font-mono mb-4 font-semibold">{error || 'Failed to connect to JobPulse API server.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 inline-flex items-center space-x-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
