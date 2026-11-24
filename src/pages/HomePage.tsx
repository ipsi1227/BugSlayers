import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mic, MapPin, Zap, ArrowRight, ShieldCheck, PlusCircle, Users, CheckCircle2, Sparkles, Navigation } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useApp } from '../context/AppContext';
import { JOB_CATEGORIES } from '../data/categories';
import { JobCard } from '../components/jobs/JobCard';
import { VoiceSearchModal } from '../components/common/VoiceSearchModal';
import { LocationModal } from '../components/common/LocationModal';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { selectedLocality, detectCurrentLocation, isLocating } = useLocation();
  const { jobs } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const localityName =
    selectedLocality.name[language] || selectedLocality.name.en || selectedLocality.city;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleVoiceQuery = (query: string) => {
    navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

  // Urgent hiring jobs
  const urgentJobs = jobs.filter(j => j.isUrgent && !j.isFilled).slice(0, 4);

  // Nearby jobs sorted by distance
  const nearbyJobs = [...jobs]
    .filter(j => !j.isFilled)
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    .slice(0, 4);

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Briefcase;
    return <IconComponent className="w-6 h-6" style={{ color }} />;
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-light/80 to-[#F7F8F3] pt-6 pb-8 px-4 sm:px-6 rounded-b-[2.5rem] border-b border-app-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Welcome Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-primary/20 text-primary-dark text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
            <span>Bengaluru Hyperlocal Job Match</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-app-text tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-lg text-app-muted max-w-xl mx-auto font-medium leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Area Selector Banner */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white border border-app-border shadow-xs hover:border-primary text-sm font-bold text-app-text transition"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span>{t.selectLocation}: <strong className="text-primary-dark">{localityName}</strong></span>
              <span className="text-xs text-primary underline">Change</span>
            </button>

            <button
              onClick={detectCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-2xl bg-primary-light text-primary-dark border border-primary/20 hover:bg-primary hover:text-white transition text-xs sm:text-sm font-bold disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{isLocating ? t.locationDetecting : 'Detect GPS'}</span>
            </button>
          </div>

          {/* PROMINENT VOICE SEARCH HERO BUTTON */}
          <div className="pt-4 max-w-md mx-auto">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black text-base sm:text-lg shadow-lg hover:bg-primary-hover active:scale-[0.98] transition flex items-center justify-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                <Mic className="w-6 h-6 text-accent-yellow animate-pulse" />
              </div>
              <span className="tracking-wide">{t.speakToFindWork}</span>
            </button>
            <p className="text-xs text-app-muted mt-2 font-medium">
              🎙️ {t.speakPrompt}
            </p>
          </div>

          {/* Standard Search Bar Alternative */}
          <div className="pt-2 max-w-md mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-24 py-3 bg-white border border-app-border rounded-xl text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Job Categories Tiles */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-app-text">{t.categories}</h2>
              <p className="text-xs sm:text-sm text-app-muted">Tap any trade to see available jobs</p>
            </div>
            <Link
              to="/jobs"
              className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center space-x-1"
            >
              <span>{t.viewAllJobs}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {JOB_CATEGORIES.map((cat) => {
              const catName = cat.name[language] || cat.name.en;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/jobs?category=${cat.id}`)}
                  className="bg-white border border-app-border hover:border-primary p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition active:scale-95 group"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition"
                    style={{ backgroundColor: cat.bgLight }}
                  >
                    {renderIcon(cat.icon, cat.color)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-app-text group-hover:text-primary transition line-clamp-2 leading-tight">
                    {catName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Urgent Hiring Today Section */}
        {urgentJobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-app-text">{t.urgentHiring}</h2>
                  <p className="text-xs sm:text-sm text-app-muted">Immediate start • Same-day pay</p>
                </div>
              </div>
              <Link
                to="/jobs?urgent=true"
                className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center space-x-1"
              >
                <span>View all urgent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {urgentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* Jobs Near You */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-app-text">{t.nearbyJobs}</h2>
                <p className="text-xs sm:text-sm text-app-muted">Closest openings around {localityName}</p>
              </div>
            </div>
            <Link
              to="/jobs"
              className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center space-x-1"
            >
              <span>{t.viewAllJobs}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {nearbyJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Hire Workers Banner for Employers */}
        <section className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-yellow">
              For Shop Owners, Contractors & Households
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Need workers urgently in your area?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed font-medium">
              Post your job in 1 minute. Direct calls from local helpers, electricians, cooks, painters, and drivers. Zero commissions.
            </p>
            <div className="pt-2">
              <Link
                to="/post-job"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-primary-dark font-black text-sm sm:text-base hover:bg-gray-100 shadow-md active:scale-95 transition"
              >
                <PlusCircle className="w-5 h-5 text-primary" />
                <span>{t.postJob}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearchQuery={handleVoiceQuery}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
