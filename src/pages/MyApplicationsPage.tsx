import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, XCircle, Building, MapPin, IndianRupee, ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const MyApplicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { applications, jobs } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-app-text">{t.myApplications}</h1>
        <p className="text-xs sm:text-sm text-app-muted mt-1">
          Track the status of all jobs you have applied for
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-app-border p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-app-text">No Applications Yet</h3>
          <p className="text-xs sm:text-sm text-app-muted max-w-sm mx-auto">
            You haven't applied for any jobs yet. Browse nearby jobs and apply with 1 tap without any resume.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-sm transition"
          >
            <span>{t.findWork}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const correspondingJob = jobs.find(j => j.id === app.jobId);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-app-border p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-app-text leading-snug">
                      {app.jobTitle}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-app-muted mt-0.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      <span>{app.employerName}</span>
                      <span>•</span>
                      <span>{app.localityName}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {app.status === 'hired' && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {t.statusHired}
                      </span>
                    )}
                    {app.status === 'shortlisted' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {t.statusShortlisted}
                      </span>
                    )}
                    {app.status === 'applied' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {t.statusApplied}
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        {t.statusRejected}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details row */}
                <div className="flex items-center justify-between p-3 bg-app-bg rounded-xl text-xs sm:text-sm font-semibold">
                  <div>
                    <span className="text-app-muted font-normal">Offered Wage: </span>
                    <strong className="text-primary-dark font-black">
                      ₹{app.wageAmount} / {app.wageType}
                    </strong>
                  </div>
                  <div className="text-app-muted text-xs">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-app-border flex items-center justify-between text-xs font-bold">
                  {correspondingJob ? (
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="text-primary hover:underline flex items-center space-x-1"
                    >
                      <span>View Job Posting</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-app-muted">Listing archived</span>
                  )}

                  {correspondingJob && (app.status === 'shortlisted' || app.status === 'hired') && (
                    <a
                      href={`tel:${correspondingJob.employerPhone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Employer</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
