import React from 'react';

export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass-panel rounded-2xl p-6 border border-orange-200/40 bg-white/80 animate-pulse shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-24 bg-orange-100/80 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
          </div>
          <div className="h-6 w-3/4 bg-emerald-100/70 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-slate-100 rounded mb-4"></div>
          <div className="space-y-2 mb-6">
            <div className="h-3 w-full bg-slate-100/80 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-100/80 rounded"></div>
          </div>
          <div className="h-4 w-20 bg-emerald-100/80 rounded ml-auto"></div>
        </div>
      ))}
    </div>
  );
}
