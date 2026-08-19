import React from 'react';
import { Building2, MapPin, Calendar, ExternalLink, Tag } from 'lucide-react';

export default function JobCard({ job }) {
  const formattedDate = job.postedAt
    ? new Date(job.postedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  const isMockSource = job.source === 'mock-sandbox';

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full group hover:border-emerald-500/60 transition-all">
      <div>
        {/* Top Pills */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${
              isMockSource
                ? 'bg-teal-500/15 text-teal-800 border-teal-300/80'
                : 'bg-emerald-500/15 text-emerald-800 border-emerald-300/80'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>{isMockSource ? 'Sandbox Source' : 'WeWorkRemotely RSS'}</span>
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/60 border border-white/90 text-slate-700 backdrop-blur-md shadow-sm">
            {job.employmentType || 'Full-time'}
          </span>
        </div>

        {/* Job Title & Company */}
        <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {job.title}
        </h3>

        <div className="flex items-center space-x-2 mt-2 text-sm text-slate-700">
          <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{job.company}</span>
        </div>

        {/* Location & Posted Date */}
        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Description Excerpt */}
        {job.description && (
          <p className="mt-4 text-xs text-slate-600 line-clamp-3 leading-relaxed border-t border-white/60 pt-3">
            {job.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-3 border-t border-white/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">ID: {job.sourceId?.slice(0, 10)}...</span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-white inline-flex items-center space-x-1.5 shadow-sm"
        >
          <span>View Job</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
