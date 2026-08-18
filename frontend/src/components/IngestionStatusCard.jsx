import React from 'react';
import { RefreshCw, Zap, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export default function IngestionStatusCard({ statusData, onTriggerIngestion, isIngesting, lastRunMetrics }) {
  const primarySource = statusData?.find((s) => s.source === 'weworkremotely') || statusData?.[0];
  const status = primarySource?.status || 'healthy';

  const getStatusBadge = () => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Healthy</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Degraded</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 border border-slate-500/20 text-slate-300">
            <span>Ready</span>
          </span>
        );
    }
  };

  const metrics = lastRunMetrics || primarySource?.lastMetrics;
  const lastSuccess = primarySource?.lastSuccessfulRun
    ? new Date(primarySource.lastSuccessfulRun).toLocaleTimeString()
    : 'Never';

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/15">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-white">Ingestion Pipeline Status</h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Source: <span className="text-slate-200 font-medium">{primarySource?.source || 'WeWorkRemotely RSS'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerIngestion}
          disabled={isIngesting}
          className="glass-button px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
          <span>{isIngesting ? 'Ingesting Jobs...' : 'Run Ingestion Pipeline'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Jobs Fetched</p>
          <p className="text-xl font-bold text-cyan-400 mt-1">{metrics?.fetched ?? 0}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">New Inserted</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{metrics?.inserted ?? 0}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium">Deduplicated</p>
          <p className="text-xl font-bold text-indigo-400 mt-1">{metrics?.duplicates ?? 0}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
          <p className="text-xs text-slate-400 font-medium flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Last Duration</span>
          </p>
          <p className="text-xl font-bold text-slate-200 mt-1">
            {metrics?.durationMs ? `${metrics.durationMs}ms` : '--'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>Last successful sync: <strong className="text-slate-300">{lastSuccess}</strong></span>
        <span>Retry policy: <strong className="text-slate-300">Exponential Backoff (3 Max)</strong></span>
      </div>
    </div>
  );
}
