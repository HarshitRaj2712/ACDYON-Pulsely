import React from 'react';
import { Filter, MapPin, Briefcase, Globe } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onApplyFilters }) {
  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onApplyFilters(updated);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 border border-white/10">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 pr-2 border-r border-white/10">
        <Filter className="w-4 h-4 text-cyan-400" />
        <span>Filter Listings</span>
      </div>

      {/* Source Filter */}
      <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
        <Globe className="w-3.5 h-3.5 text-indigo-400" />
        <select
          value={filters.source || ''}
          onChange={(e) => handleChange('source', e.target.value)}
          className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-slate-900 text-slate-200">All Sources</option>
          <option value="weworkremotely" className="bg-slate-900 text-slate-200">WeWorkRemotely RSS</option>
          <option value="mock-sandbox" className="bg-slate-900 text-slate-200">Mock Sandbox</option>
        </select>
      </div>

      {/* Employment Type Filter */}
      <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
        <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
        <select
          value={filters.employmentType || ''}
          onChange={(e) => handleChange('employmentType', e.target.value)}
          className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-slate-900 text-slate-200">All Employment Types</option>
          <option value="Full-time" className="bg-slate-900 text-slate-200">Full-time</option>
          <option value="Part-time" className="bg-slate-900 text-slate-200">Part-time</option>
          <option value="Contract" className="bg-slate-900 text-slate-200">Contract</option>
          <option value="Internship" className="bg-slate-900 text-slate-200">Internship</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Location (e.g. Remote)..."
          className="bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none w-32"
        />
      </div>

      {(filters.source || filters.employmentType || filters.location) && (
        <button
          onClick={() => {
            const reset = { source: '', employmentType: '', location: '' };
            setFilters(reset);
            onApplyFilters(reset);
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline ml-auto"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
