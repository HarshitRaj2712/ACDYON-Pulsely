import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total } = pagination;

  if (!total || totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10 text-xs text-slate-400">
      <div>
        Showing page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong> ({total} total listings)
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="glass-panel px-3 py-1.5 rounded-xl border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 flex items-center space-x-1 text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold">
          {page}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="glass-panel px-3 py-1.5 rounded-xl border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 flex items-center space-x-1 text-slate-200 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
