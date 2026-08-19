import React from 'react';
import { RefreshCw, Zap, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export default function IngestionStatusCard({ statusData, onTriggerIngestion, isIngesting, lastRunMetrics }) {
  const primarySource = statusData?.find((s) => s.source === 'weworkremotely') || statusData?.[0];
  const status = primarySource?.status || 'healthy';

  const getStatusBadge = () => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Healthy</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Degraded</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 shadow-sm">
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
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/80 bg-white/55 backdrop-blur-2xl shadow-xl shadow-emerald-500/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/60">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100/90 to-green-100/90 border border-white/80 text-emerald-700 shadow-sm backdrop-blur-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-slate-900">Ingestion Pipeline Status</h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Source: <span className="text-slate-800 font-semibold">{primarySource?.source || 'WeWorkRemotely RSS'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerIngestion}
          disabled={isIngesting}
          className="glass-button px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
          <span>{isIngesting ? 'Ingesting Jobs...' : 'Run Ingestion Pipeline'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        <div className="glass-pill rounded-xl p-3.5 bg-white/40 border border-white/80 shadow-sm">
          <p className="text-xs text-slate-600 font-semibold">Jobs Fetched</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{metrics?.fetched ?? 0}</p>
        </div>

        <div className="glass-pill rounded-xl p-3.5 bg-white/40 border border-white/80 shadow-sm">
          <p className="text-xs text-slate-600 font-semibold">New Inserted</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{metrics?.inserted ?? 0}</p>
        </div>

        <div className="glass-pill rounded-xl p-3.5 bg-white/40 border border-white/80 shadow-sm">
          <p className="text-xs text-slate-600 font-semibold">Deduplicated</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{metrics?.duplicates ?? 0}</p>
        </div>

        <div className="glass-pill rounded-xl p-3.5 bg-white/40 border border-white/80 shadow-sm">
          <p className="text-xs text-slate-600 font-semibold flex items-center space-x-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>Last Duration</span>
          </p>
          <p className="text-xl font-black text-slate-800 mt-1">
            {metrics?.durationMs ? `${metrics.durationMs}ms` : '--'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/50 flex items-center justify-between text-xs text-slate-500">
        <span>Last successful sync: <strong className="text-slate-700 font-semibold">{lastSuccess}</strong></span>
        <span>Retry policy: <strong className="text-slate-700 font-semibold">Exponential Backoff (3 Max)</strong></span>
      </div>
    </div>
  );
}
