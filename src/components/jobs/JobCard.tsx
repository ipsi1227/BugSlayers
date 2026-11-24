import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Users, Zap, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { formatDistance, formatDistanceHi } from '../../utils/distance';
import { ApplyModal } from './ApplyModal';
import { kaamVoiceEngine } from '../../utils/audio';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { language, t } = useLanguage();
  const { hasApplied } = useApp();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const isApplied = hasApplied(job.id);

  const wageUnit =
    job.wageType === 'per_day' ? t.perDay :
    job.wageType === 'per_month' ? t.perMonth :
    job.wageType === 'per_hour' ? t.perHour :
    t.contract;

  const displayDistance =
    language === 'hi'
      ? formatDistanceHi(job.distanceKm)
      : formatDistance(job.distanceKm);

  const jobTitle = (language === 'hi' && job.titleHi) ? job.titleHi : job.title;

  const handleQuickListen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const script = kaamVoiceEngine.generateJobSummaryText(job, language);
    kaamVoiceEngine.speakText(script, language);
  };

  return (
    <>
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-app-border p-4 sm:p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            {job.isUrgent && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>{t.urgentHiring}</span>
              </span>
            )}
            {job.isFilled && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                Position Filled
              </span>
            )}
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-app-muted">
              <Users className="w-3 h-3" />
              <span>{job.workersNeeded} {t.workersNeeded}</span>
            </span>
          </div>

          {/* Quick Voice Play Button on Card */}
          <button
            onClick={handleQuickListen}
            title="Listen to this job"
            className="w-8 h-8 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-white transition flex items-center justify-center flex-shrink-0"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Job Title & Employer */}
        <div className="mb-3">
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-lg sm:text-xl font-bold text-app-text group-hover:text-primary transition line-clamp-2 leading-snug">
              {jobTitle}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-app-muted font-medium mt-0.5">
            {job.employerName}
          </p>
        </div>

        {/* Primary Focus: WAGE & LOCATION (Crucial for informal workers) */}
        <div className="bg-app-bg rounded-xl p-3 mb-3 border border-app-border/60">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-app-muted uppercase tracking-wider">
              Wage / कमाई:
            </span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-primary-dark">
                ₹{job.wageAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-app-muted ml-1">
                {wageUnit}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-app-border/60 flex items-center justify-between text-xs sm:text-sm font-semibold text-app-text">
            <div className="flex items-center space-x-1 text-app-text">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[170px]">{job.localityName}</span>
            </div>
            {displayDistance && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {displayDistance}
              </span>
            )}
          </div>
        </div>

        {/* Timings and Duration tags */}
        <div className="grid grid-cols-2 gap-2 text-xs text-app-muted mb-4 font-medium">
          <div className="flex items-center space-x-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-app-muted flex-shrink-0" />
            <span className="truncate">{job.workingHours}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-app-muted flex-shrink-0" />
            <span className="truncate capitalize">{job.duration}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-app-border flex items-center space-x-2">
          {isApplied ? (
            <div className="flex-1 py-3 px-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>{t.applied}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              disabled={job.isFilled}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-primary-hover active:scale-[0.98] transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <span>{t.applyNow}</span>
            </button>
          )}

          <Link
            to={`/jobs/${job.id}`}
            className="p-3 rounded-xl border border-app-border text-app-text hover:bg-gray-50 transition flex items-center justify-center"
            title="View Details"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </>
  );
};
