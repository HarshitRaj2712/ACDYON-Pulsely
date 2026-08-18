import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full mb-6">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search jobs by title, company, or tech stack (e.g. React, Node.js)..."
          className="w-full glass-input pl-12 pr-24 py-3.5 rounded-2xl text-sm placeholder-slate-400 focus:outline-none transition-all shadow-lg"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-xs transition-all shadow-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}
