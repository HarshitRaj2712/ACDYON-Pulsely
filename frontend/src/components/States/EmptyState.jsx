import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

export default function EmptyState({ onTriggerIngestion }) {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center border border-orange-200/50 bg-white/85 shadow-lg shadow-orange-500/5 my-8 max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">No Job Listings Found</h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        No jobs matched your current search filters or database is empty. You can run the resilient ingestion pipeline to fetch fresh listings.
      </p>
      {onTriggerIngestion && (
        <button
          onClick={onTriggerIngestion}
          className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold text-white inline-flex items-center space-x-2 shadow-md shadow-emerald-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run Pipeline Ingestion</span>
        </button>
      )}
    </div>
  );
}
