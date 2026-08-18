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
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full border border-white/10 group">
      <div>
        {/* Top Pills */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isMockSource
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>{isMockSource ? 'Sandbox Source' : 'WeWorkRemotely RSS'}</span>
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
            {job.employmentType || 'Full-time'}
          </span>
        </div>

        {/* Job Title & Company */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
          {job.title}
        </h3>

        <div className="flex items-center space-x-2 mt-2 text-sm text-slate-300">
          <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-semibold">{job.company}</span>
        </div>

        {/* Location & Posted Date */}
        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Description Excerpt */}
        {job.description && (
          <p className="mt-4 text-xs text-slate-300 line-clamp-3 leading-relaxed border-t border-white/5 pt-3">
            {job.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">ID: {job.sourceId?.slice(0, 10)}...</span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View Job</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
