import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total } = pagination;

  if (!total || totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/60 text-xs text-slate-500 font-medium">
      <div>
        Showing page <strong className="text-slate-800 font-bold">{page}</strong> of <strong className="text-slate-800 font-bold">{totalPages}</strong> ({total} total listings)
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="glass-panel px-3.5 py-1.5 rounded-xl border border-white/80 bg-white/70 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 flex items-center space-x-1 text-slate-700 font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-600" />
          <span>Previous</span>
        </button>

        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-300/80 text-emerald-800 font-black shadow-sm">
          {page}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="glass-panel px-3.5 py-1.5 rounded-xl border border-white/80 bg-white/70 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 flex items-center space-x-1 text-slate-700 font-bold transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>
  );
}
