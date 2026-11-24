import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, CheckCircle2, XCircle, Phone, MapPin, Briefcase, Trash2, Check, PlusCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { ApplicationStatus } from '../types';

export const EmployerDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { jobs, applications, updateJobStatus, deleteJob, updateApplicationStatus } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | 'all'>('all');

  const totalPosted = jobs.length;
  const activeJobs = jobs.filter(j => !j.isFilled).length;
  const filledJobs = jobs.filter(j => j.isFilled).length;
  const totalApplicants = applications.length;

  const displayedJobs = selectedJobId === 'all' ? jobs : jobs.filter(j => j.id === selectedJobId);

  const getApplicantsForJob = (jobId: string) => {
    return applications.filter(a => a.jobId === jobId);
  };

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    await updateApplicationStatus(appId, status);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Post button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-app-text">{t.employerDashboard}</h1>
          <p className="text-xs sm:text-sm text-app-muted">Manage your job listings and view incoming applicants</p>
        </div>
        <Link
          to="/post-job"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.postJob}</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-app-border p-4 shadow-xs">
          <span className="text-xs font-bold text-app-muted uppercase">Total Jobs</span>
          <div className="text-2xl sm:text-3xl font-black text-app-text mt-1">{totalPosted}</div>
        </div>

        <div className="bg-white rounded-2xl border border-app-border p-4 shadow-xs">
          <span className="text-xs font-bold text-primary uppercase">{t.activeJobs}</span>
          <div className="text-2xl sm:text-3xl font-black text-primary mt-1">{activeJobs}</div>
        </div>

        <div className="bg-white rounded-2xl border border-app-border p-4 shadow-xs">
          <span className="text-xs font-bold text-app-muted uppercase">{t.filledJobs}</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-600 mt-1">{filledJobs}</div>
        </div>

        <div className="bg-white rounded-2xl border border-app-border p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase">{t.totalApplicants}</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{totalApplicants}</div>
        </div>
      </div>

      {/* Filter by Job Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedJobId('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap border transition ${
            selectedJobId === 'all'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-white text-app-text border-app-border hover:bg-gray-50'
          }`}
        >
          All Listings ({jobs.length})
        </button>
        {jobs.map(j => (
          <button
            key={j.id}
            onClick={() => setSelectedJobId(j.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap border transition ${
              selectedJobId === j.id
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-white text-app-text border-app-border hover:bg-gray-50'
            }`}
          >
            {j.title} ({getApplicantsForJob(j.id).length})
          </button>
        ))}
      </div>

      {/* Listings & Their Applicants */}
      <div className="space-y-6">
        {displayedJobs.map(job => {
          const jobApplicants = getApplicantsForJob(job.id);

          return (
            <div key={job.id} className="bg-white rounded-3xl border border-app-border p-5 sm:p-6 shadow-xs space-y-4">
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-app-border">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      job.isFilled ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {job.isFilled ? 'Position Filled' : 'Active'}
                    </span>
                    <span className="text-xs text-app-muted">
                      📍 {job.localityName} • ₹{job.wageAmount}/{job.wageType}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-app-text mt-1">{job.title}</h3>
                  <p className="text-xs text-app-muted">Employer Contact: {job.employerPhone}</p>
                </div>

                {/* Job Action Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateJobStatus(job.id, !job.isFilled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      job.isFilled
                        ? 'border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {job.isFilled ? t.markActive : t.markFilled}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove "${job.title}"?`)) {
                        deleteJob(job.id);
                      }
                    }}
                    className="p-2 rounded-xl text-app-muted hover:text-red-600 border border-app-border hover:bg-red-50 transition"
                    title={t.deleteJob}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Applicants for this Job */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-app-text uppercase tracking-wider flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{t.viewApplicants} ({jobApplicants.length})</span>
                  </h4>
                </div>

                {jobApplicants.length === 0 ? (
                  <div className="p-4 bg-app-bg rounded-2xl border border-app-border text-center text-xs text-app-muted">
                    {t.noApplicantsYet}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobApplicants.map(app => (
                      <div
                        key={app.id}
                        className="bg-app-bg border border-app-border rounded-2xl p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-sm sm:text-base text-app-text">{app.workerName}</h5>
                            <div className="text-xs text-app-muted mt-0.5">
                              Exp: {app.workerExperience ? `${app.workerExperience} yrs` : 'Fresher'}
                              {app.workerLocality && ` • ${app.workerLocality}`}
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            app.status === 'hired' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Skills Chips */}
                        {app.workerSkills && app.workerSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {app.workerSkills.map(s => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-app-border text-[10px] font-semibold text-app-text">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Phone Contact and Status Actions */}
                        <div className="pt-2 border-t border-app-border flex items-center justify-between gap-2">
                          <a
                            href={`tel:${app.workerPhone}`}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call {app.workerPhone}</span>
                          </a>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleStatusChange(app.id, 'shortlisted')}
                              className="px-2 py-1 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-50"
                              title={t.shortlist}
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'hired')}
                              className="px-2 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                              title={t.hire}
                            >
                              Hire 🎉
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              className="p-1 text-app-muted hover:text-red-600"
                              title={t.reject}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
