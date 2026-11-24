import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle, Building, MapPin, IndianRupee, Clock, Users, Zap, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { JOB_CATEGORIES } from '../data/categories';
import { LOCALITIES } from '../data/localities';
import { WageType, JobDuration } from '../types';

export const PostJobPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { addJob } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('construction');
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [wageAmount, setWageAmount] = useState<number | ''>(750);
  const [wageType, setWageType] = useState<WageType>('per_day');
  const [localityId, setLocalityId] = useState('marathahalli');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('9:00 AM - 6:00 PM');
  const [duration, setDuration] = useState<JobDuration>('1-3 days');
  const [startDate, setStartDate] = useState('Tomorrow');
  const [description, setDescription] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [employerPhone, setEmployerPhone] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanEmpName = employerName.trim();
    const cleanEmpPhone = employerPhone.trim().replace(/\D/g, '');

    if (!cleanTitle) {
      setError('Please provide a job title.');
      return;
    }

    if (!wageAmount || Number(wageAmount) <= 0) {
      setError('Please provide a valid wage amount.');
      return;
    }

    if (!cleanEmpName) {
      setError('Please provide your name or business name.');
      return;
    }

    if (cleanEmpPhone.length !== 10) {
      setError('Please provide a valid 10-digit contact number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedLoc = LOCALITIES.find(l => l.id === localityId) || LOCALITIES[0];
      const localityName = selectedLoc.name[language] || selectedLoc.name.en;

      const newJob = await addJob({
        title: cleanTitle,
        categoryId,
        workersNeeded: Number(workersNeeded) || 1,
        wageAmount: Number(wageAmount),
        wageType,
        localityId: selectedLoc.id,
        localityName,
        address: address.trim() || undefined,
        coordinates: selectedLoc.coordinates,
        workingHours: workingHours.trim() || '9:00 AM - 6:00 PM',
        duration,
        startDate: startDate.trim() || 'Immediate',
        description: description.trim() || cleanTitle,
        employerName: cleanEmpName,
        employerPhone: cleanEmpPhone,
        isUrgent,
        isFilled: false
      });

      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/jobs/${newJob.id}`);
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to post job. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-bold mb-2">
          <Building className="w-3.5 h-3.5" />
          <span>Employer Portal / मालिक सेवा</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-app-text">{t.postJobTitle}</h1>
        <p className="text-xs sm:text-sm text-app-muted mt-1">{t.postJobDesc}</p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl border border-app-border p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-app-text">{t.jobPostedSuccess}</h2>
          <p className="text-sm text-app-muted">Opening job page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-app-border p-5 sm:p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* 1. Job Title */}
          <div>
            <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
              {t.jobTitleInput} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2 helpers needed for material shifting & loading"
              className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* 2. Category & Workers Needed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.categorySelect} *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
              >
                {JOB_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name[language] || c.name.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.workersCountInput} *
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={workersNeeded}
                onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* 3. Wage Amount & Wage Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.wageAmountInput} *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted font-bold">₹</span>
                <input
                  type="number"
                  min={100}
                  required
                  value={wageAmount}
                  onChange={(e) => setWageAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 750"
                  className="w-full pl-9 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.wageTypeSelect} *
              </label>
              <select
                value={wageType}
                onChange={(e) => setWageType(e.target.value as WageType)}
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
              >
                <option value="per_day">Per Day (प्रति दिन)</option>
                <option value="per_month">Per Month (प्रति माह)</option>
                <option value="per_hour">Per Hour (प्रति घंटा)</option>
                <option value="fixed_contract">Fixed Contract (ठेका)</option>
              </select>
            </div>
          </div>

          {/* 4. Locality & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.localitySelect} *
              </label>
              <select
                value={localityId}
                onChange={(e) => setLocalityId(e.target.value)}
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
              >
                {LOCALITIES.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name[language] || loc.name.en} ({loc.name.en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.fullAddressInput}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Outer Ring Road Junction"
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* 5. Timings, Duration, Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.hoursInput}
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="9 AM - 6 PM"
                className="w-full px-3 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.durationSelect}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as JobDuration)}
                className="w-full px-3 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs sm:text-sm font-semibold"
              >
                <option value="daily">Daily</option>
                <option value="1-3 days">1-3 days</option>
                <option value="1 week">1 week</option>
                <option value="1-3 months">1-3 months</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.startDateInput}
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Immediate"
                className="w-full px-3 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>
          </div>

          {/* 6. Description */}
          <div>
            <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
              {t.descriptionInput}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the work required in simple words..."
              className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            />
          </div>

          {/* 7. Employer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-app-border">
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.employerNameInput} *
              </label>
              <input
                type="text"
                required
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder="Your name or business name"
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
                {t.employerPhoneInput} *
              </label>
              <input
                type="tel"
                maxLength={10}
                required
                value={employerPhone}
                onChange={(e) => setEmployerPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-bold tracking-wide"
              />
            </div>
          </div>

          {/* Urgent Hiring Toggle */}
          <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <input
              type="checkbox"
              id="urgent-toggle"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="urgent-toggle" className="text-xs sm:text-sm font-bold text-amber-900 cursor-pointer flex items-center space-x-1">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>Mark as Urgent Hiring (Attracts workers within minutes)</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black text-base sm:text-lg shadow-md hover:bg-primary-hover active:scale-[0.98] transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publishing Job...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>{t.publishJob}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
