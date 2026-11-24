import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Volume2, ShieldCheck, Phone, User, Loader2 } from 'lucide-react';
import { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { kaamVoiceEngine } from '../../utils/audio';

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { workerProfile, applyToJob, saveWorkerProfile } = useApp();

  const [name, setName] = useState(workerProfile.name || '');
  const [phone, setPhone] = useState(workerProfile.phone || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const wageUnit =
    job.wageType === 'per_day' ? t.perDay :
    job.wageType === 'per_month' ? t.perMonth :
    job.wageType === 'per_hour' ? t.perHour :
    t.contract;

  const handleVoiceConfirm = () => {
    const confirmationText = kaamVoiceEngine.generateConfirmationText(
      job,
      name || 'कारीगर साथी',
      language
    );
    kaamVoiceEngine.speakText(confirmationText, language);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (!cleanName) {
      setError(t.enterValidName);
      return;
    }

    if (cleanPhone.length !== 10) {
      setError(t.enterValidPhone);
      return;
    }

    setIsSubmitting(true);

    // Save profile for future 1-tap applications
    saveWorkerProfile({
      ...workerProfile,
      name: cleanName,
      phone: cleanPhone
    });

    const result = await applyToJob(job.id, cleanName, cleanPhone);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } else {
      if (result.error === 'ALREADY_APPLIED') {
        setError(t.alreadyApplied);
      } else {
        setError(result.error || 'Failed to submit application');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-app-border bg-primary text-white">
          <div>
            <span className="text-xs font-semibold text-accent-yellow uppercase tracking-wider block">
              {t.noResumeNeeded}
            </span>
            <h2 className="text-lg sm:text-xl font-black">{t.applyTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-app-text">{t.applicationSuccess}</h3>
              <p className="text-xs sm:text-sm text-app-muted">
                {job.employerName} has received your phone number ({phone}) and will call you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job summary card */}
              <div className="p-3.5 bg-app-bg border border-app-border rounded-2xl">
                <h4 className="font-bold text-sm sm:text-base text-app-text">{job.title}</h4>
                <div className="mt-1 flex items-center justify-between text-xs text-app-muted font-medium">
                  <span>📍 {job.localityName}</span>
                  <span className="font-bold text-primary-dark text-sm">
                    ₹{job.wageAmount} {wageUnit}
                  </span>
                </div>
              </div>

              {/* KaamVoice Confirmation Audio Button */}
              <button
                type="button"
                onClick={handleVoiceConfirm}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-primary-light/80 border border-primary/30 text-primary-dark text-xs sm:text-sm font-bold hover:bg-primary-light transition"
              >
                <Volume2 className="w-4 h-4 text-primary" />
                <span>{t.applicationConfirmationVoice}</span>
              </button>

              <p className="text-xs text-app-muted">{t.confirmDetails}</p>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                  {t.yourName} *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                  {t.yourPhone} *
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-primary text-white font-black text-sm sm:text-base hover:bg-primary-hover active:scale-[0.98] transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>{t.submitApplication}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
