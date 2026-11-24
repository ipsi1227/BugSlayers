import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  Zap,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { formatDistance, formatDistanceHi } from '../utils/distance';
import { KaamVoicePlayer } from '../components/common/KaamVoicePlayer';
import { ApplyModal } from '../components/jobs/ApplyModal';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { jobs, hasApplied } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-app-text">Job Not Found</h2>
        <p className="text-sm text-app-muted">The job listing you are looking for has been removed or filled.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse other jobs</span>
        </Link>
      </div>
    );
  }

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

  const title = (language === 'hi' && job.titleHi) ? job.titleHi : job.title;
  const description = (language === 'hi' && job.descriptionHi) ? job.descriptionHi : job.description;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-app-border p-5 sm:p-8 shadow-xs space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {job.isUrgent && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>{t.urgentHiring}</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-app-muted">
              <Users className="w-3.5 h-3.5" />
              <span>{job.workersNeeded} {t.workersNeeded}</span>
            </span>
          </div>

          {displayDistance && (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {displayDistance}
            </span>
          )}
        </div>

        {/* Title & Employer */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-app-text leading-tight">
            {title}
          </h1>
          <div className="flex items-center space-x-2 text-app-muted text-sm font-medium mt-1">
            <Building className="w-4 h-4 text-primary" />
            <span className="font-semibold text-app-text">{job.employerName}</span>
            <span>•</span>
            <span>{job.localityName}</span>
          </div>
        </div>

        {/* Highlighted Wage Box */}
        <div className="bg-[#E8F3E9] rounded-2xl p-4 sm:p-5 border border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-primary-dark uppercase tracking-wider block">
              Offered Wage / कमाई:
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-primary-dark">
                ₹{job.wageAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-sm sm:text-base font-bold text-primary">
                {wageUnit}
              </span>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-primary-dark font-semibold sm:text-right">
            <div>Prompt payment directly to worker</div>
            <div className="text-xs text-app-muted font-normal mt-0.5">No agency commission deducted</div>
          </div>
        </div>

        {/* KaamVoice Spoken Audio Accessibility Section */}
        <KaamVoicePlayer job={job} />

        {/* Key Job Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-3 bg-app-bg rounded-xl border border-app-border/70">
            <span className="text-[11px] font-bold text-app-muted uppercase block mb-1">
              {t.workingHours}
            </span>
            <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-app-text">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{job.workingHours}</span>
            </div>
          </div>

          <div className="p-3 bg-app-bg rounded-xl border border-app-border/70">
            <span className="text-[11px] font-bold text-app-muted uppercase block mb-1">
              {t.duration}
            </span>
            <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-app-text">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate capitalize">{job.duration}</span>
            </div>
          </div>

          <div className="p-3 bg-app-bg rounded-xl border border-app-border/70 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-app-muted uppercase block mb-1">
              {t.startDate}
            </span>
            <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-app-text">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="truncate">{job.startDate}</span>
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="p-4 bg-app-bg rounded-2xl border border-app-border/70 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-app-muted">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Work Location / कार्य स्थल:</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-app-text">
            {job.localityName}
          </p>
          {job.address && (
            <p className="text-xs sm:text-sm text-app-muted font-medium">
              {job.address}
            </p>
          )}
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-app-text">
            Job Details / काम का विवरण
          </h3>
          <p className="text-sm sm:text-base text-app-text leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-app-text">Requirements</h3>
            <ul className="space-y-1.5">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-center space-x-2 text-xs sm:text-sm text-app-text font-medium">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Employer Contact / Call button */}
        <div className="p-4 bg-gray-50 border border-app-border rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-app-muted uppercase">Employer Contact</span>
            <h4 className="text-sm sm:text-base font-bold text-app-text">{job.employerName}</h4>
            <p className="text-xs text-app-muted">Bengaluru Local Employer</p>
          </div>

          <a
            href={`tel:${job.employerPhone}`}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-primary/30 text-primary-dark font-bold text-xs sm:text-sm hover:bg-primary-light transition shadow-xs"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span>{t.callEmployer} ({job.employerPhone})</span>
          </a>
        </div>

        {/* Primary Action Button (Fixed on mobile bottom or inside card) */}
        <div className="pt-4 border-t border-app-border">
          {isApplied ? (
            <div className="w-full py-4 px-6 rounded-2xl bg-green-50 border border-green-200 text-green-700 font-bold text-base flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>{t.applied} (Details submitted to employer)</span>
            </div>
          ) : (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              disabled={job.isFilled}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black text-base sm:text-lg shadow-lg hover:bg-primary-hover active:scale-[0.98] transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{t.applyNow}</span>
            </button>
          )}
        </div>

        {/* Trust & Safety Warning */}
        <div className="flex items-start space-x-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>{t.safetyNoticeDesc}</p>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
