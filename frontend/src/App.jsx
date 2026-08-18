import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import IngestionStatusCard from './components/IngestionStatusCard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import LoadingState from './components/States/LoadingState';
import EmptyState from './components/States/EmptyState';
import ErrorState from './components/States/ErrorState';

import { getJobs, runIngestionPipeline, getIngestionStatus, getSystemHealth } from './services/api';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [systemHealth, setSystemHealth] = useState(null);
  const [ingestionStatuses, setIngestionStatuses] = useState([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const [lastRunMetrics, setLastRunMetrics] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ source: '', employmentType: '', location: '' });

  // Show auto-expiring toast notifications
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load system health & source status
  const loadStatusAndHealth = useCallback(async () => {
    try {
      const healthRes = await getSystemHealth();
      setSystemHealth(healthRes);

      const statusRes = await getIngestionStatus();
      if (statusRes.success) {
        setIngestionStatuses(statusRes.data);
      }
    } catch (err) {
      console.warn('Backend server unreached or initializing:', err.message);
    }
  }, []);

  // Fetch job listings
  const loadJobs = useCallback(async (page = 1, currentSearch = searchTerm, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 12,
        ...(currentSearch ? { q: currentSearch } : {}),
        ...(currentFilters.source ? { source: currentFilters.source } : {}),
        ...(currentFilters.employmentType ? { employmentType: currentFilters.employmentType } : {}),
        ...(currentFilters.location ? { location: currentFilters.location } : {})
      };

      const res = await getJobs(params);
      if (res.success) {
        setJobs(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Failed to fetch job listings.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    loadStatusAndHealth();
    loadJobs(1);
  }, [loadStatusAndHealth, loadJobs]);

  // Handle manual ingestion run trigger
  const handleRunIngestion = async () => {
    setIsIngesting(true);
    showToast('Ingestion pipeline started...', 'info');
    try {
      const res = await runIngestionPipeline();
      if (res.success) {
        const metrics = res.data.metrics;
        setLastRunMetrics(metrics);

        const summary = res.data.usedFallback
          ? `Fallback ingestion complete! Fetched: ${metrics.fetched}, Inserted: ${metrics.inserted}`
          : `Ingestion successful! Fetched: ${metrics.fetched}, Inserted: ${metrics.inserted}, Duplicates: ${metrics.duplicates}`;

        showToast(summary, 'success');
        loadStatusAndHealth();
        loadJobs(1);
      }
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Ingestion failed on all sources.', 'error');
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header systemHealth={systemHealth} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl glass-panel text-xs font-semibold shadow-2xl transition-all border ${
              toastMessage.type === 'error'
                ? 'border-rose-500/40 text-rose-300 bg-rose-950/80'
                : toastMessage.type === 'success'
                ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/80'
                : 'border-cyan-500/40 text-cyan-300 bg-slate-900/90'
            }`}
          >
            {toastMessage.message}
          </div>
        )}

        {/* Ingestion Pipeline Control & Status Panel */}
        <IngestionStatusCard
          statusData={ingestionStatuses}
          onTriggerIngestion={handleRunIngestion}
          isIngesting={isIngesting}
          lastRunMetrics={lastRunMetrics}
        />

        {/* Search & Filter Bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => loadJobs(1, searchTerm, filters)}
        />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={(newFilters) => loadJobs(1, searchTerm, newFilters)}
        />

        {/* Content Area */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => loadJobs(pagination.page)} />
        ) : jobs.length === 0 ? (
          <EmptyState onTriggerIngestion={handleRunIngestion} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id || job.sourceId} job={job} />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => loadJobs(newPage)}
            />
          </>
        )}
      </main>

      <footer className="mt-16 text-center text-xs text-slate-500 border-t border-white/5 py-6">
        JobPulse — Resilient Listing Ingestion Platform &copy; 2026. Safe Public Data Aggregation.
      </footer>
    </div>
  );
}
