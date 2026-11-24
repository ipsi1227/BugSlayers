import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, AlertCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { FilterState } from '../types';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { VoiceSearchModal } from '../components/common/VoiceSearchModal';

export const JobListingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { jobs, isLoadingJobs } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    searchQuery: searchParams.get('search') || '',
    selectedCategory: searchParams.get('category') || 'all',
    maxDistanceKm: searchParams.get('distance') ? Number(searchParams.get('distance')) : null,
    wageType: 'all',
    minWage: 0,
    urgentOnly: searchParams.get('urgent') === 'true',
    sortBy: 'distance'
  }));

  // Sync state if query params change
  useEffect(() => {
    const q = searchParams.get('search');
    const cat = searchParams.get('category');
    const urgent = searchParams.get('urgent') === 'true';

    if (q !== null) setFilters(prev => ({ ...prev, searchQuery: q }));
    if (cat !== null) setFilters(prev => ({ ...prev, selectedCategory: cat }));
    if (urgent) setFilters(prev => ({ ...prev, urgentOnly: true }));
  }, [searchParams]);

  // Filter & sort logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesTitleHi = job.titleHi?.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesLoc = job.localityName.toLowerCase().includes(query);
        const matchesCat = job.categoryId.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTitleHi && !matchesDesc && !matchesLoc && !matchesCat) {
          return false;
        }
      }

      // 2. Category
      if (filters.selectedCategory !== 'all' && job.categoryId !== filters.selectedCategory) {
        return false;
      }

      // 3. Distance
      if (filters.maxDistanceKm !== null) {
        if (job.distanceKm === undefined || job.distanceKm > filters.maxDistanceKm) {
          return false;
        }
      }

      // 4. Urgent
      if (filters.urgentOnly && !job.isUrgent) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'distance') {
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      }
      if (filters.sortBy === 'wage') {
        return b.wageAmount - a.wageAmount;
      }
      if (filters.sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [jobs, filters]);

  const handleVoiceQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-app-text">{t.findWork}</h1>
        <p className="text-xs sm:text-sm text-app-muted">
          Showing {filteredJobs.length} available opportunities
        </p>
      </div>

      {/* Filter Component */}
      <JobFilters
        filters={filters}
        setFilters={setFilters}
        onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
      />

      {/* Jobs Grid */}
      {isLoadingJobs ? (
        <div className="py-16 text-center text-app-muted space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading available jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-app-border p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-app-text">{t.noJobsFound}</h3>
          <p className="text-xs sm:text-sm text-app-muted max-w-md mx-auto leading-relaxed">
            {t.noJobsFoundDesc}
          </p>
          <button
            onClick={() => {
              setFilters({
                searchQuery: '',
                selectedCategory: 'all',
                maxDistanceKm: null,
                wageType: 'all',
                minWage: 0,
                urgentOnly: false,
                sortBy: 'distance'
              });
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.clearFilters}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Voice Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearchQuery={handleVoiceQuery}
      />
    </div>
  );
};
