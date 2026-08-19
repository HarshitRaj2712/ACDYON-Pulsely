import React from 'react';
import { Filter, MapPin, Briefcase, Globe } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onApplyFilters }) {
  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onApplyFilters(updated);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 border border-white/80 bg-white/55 backdrop-blur-2xl shadow-xl shadow-emerald-500/5">
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 pr-3 border-r border-white/60">
        <Filter className="w-4 h-4 text-emerald-600" />
        <span>Filter Listings</span>
      </div>

      {/* Source Filter */}
      <div className="glass-pill flex items-center space-x-2 bg-white/40 px-3 py-1.5 rounded-xl border border-white/80 shadow-sm">
        <Globe className="w-3.5 h-3.5 text-emerald-600" />
        <select
          value={filters.source || ''}
          onChange={(e) => handleChange('source', e.target.value)}
          className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-white text-slate-800">All Sources</option>
          <option value="weworkremotely" className="bg-white text-slate-800">WeWorkRemotely RSS</option>
          <option value="mock-sandbox" className="bg-white text-slate-800">Mock Sandbox</option>
        </select>
      </div>

      {/* Employment Type Filter */}
      <div className="glass-pill flex items-center space-x-2 bg-white/40 px-3 py-1.5 rounded-xl border border-white/80 shadow-sm">
        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
        <select
          value={filters.employmentType || ''}
          onChange={(e) => handleChange('employmentType', e.target.value)}
          className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-white text-slate-800">All Employment Types</option>
          <option value="Full-time" className="bg-white text-slate-800">Full-time</option>
          <option value="Part-time" className="bg-white text-slate-800">Part-time</option>
          <option value="Contract" className="bg-white text-slate-800">Contract</option>
          <option value="Internship" className="bg-white text-slate-800">Internship</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="glass-pill flex items-center space-x-2 bg-white/40 px-3 py-1.5 rounded-xl border border-white/80 shadow-sm">
        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Location (e.g. Remote)..."
          className="bg-transparent text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none w-32"
        />
      </div>

      {(filters.source || filters.employmentType || filters.location) && (
        <button
          onClick={() => {
            const reset = { source: '', employmentType: '', location: '' };
            setFilters(reset);
            onApplyFilters(reset);
          }}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline ml-auto"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
