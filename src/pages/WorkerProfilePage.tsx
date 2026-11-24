import React, { useState } from 'react';
import { User, Phone, MapPin, Briefcase, Award, CheckCircle2, Plus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { LOCALITIES } from '../data/localities';
import { WorkerProfile } from '../types';

const COMMON_SKILLS = [
  'Helper', 'Construction', 'Domestic Wiring', 'Plumbing',
  'Cooking', 'Housekeeping', 'Wall Painting', 'Goods Driving',
  'Delivery', 'Warehouse Packing', 'Tailoring', 'Carpentry'
];

export const WorkerProfilePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { workerProfile, saveWorkerProfile } = useApp();

  const [formData, setFormData] = useState<WorkerProfile>(workerProfile);
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWorkerProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-app-text">{t.workerProfile}</h1>
        <p className="text-xs sm:text-sm text-app-muted mt-1">
          Save your details once. You can apply to all jobs with 1 tap without any resume.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3 text-green-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="font-bold text-sm">Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-app-border p-5 sm:p-8 shadow-xs space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
            {t.yourName} *
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Ramesh Kumar"
              className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Mobile Number */}
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
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
              placeholder="10-digit mobile number"
              className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Preferred Locality */}
        <div>
          <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
            Preferred Locality / पसंदीदा इलाका *
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
            <select
              value={formData.preferredLocalityId}
              onChange={(e) => {
                const loc = LOCALITIES.find(l => l.id === e.target.value) || LOCALITIES[0];
                setFormData(prev => ({
                  ...prev,
                  preferredLocalityId: loc.id,
                  preferredLocalityName: loc.name[language] || loc.name.en
                }));
              }}
              className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:border-primary appearance-none"
            >
              {LOCALITIES.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name[language] || loc.name.en} ({loc.name.en})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience in Years */}
        <div>
          <label className="block text-xs font-bold text-app-text uppercase tracking-wider mb-1.5">
            Experience in Years (अनुभव)
          </label>
          <div className="relative">
            <Award className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
            <input
              type="number"
              min={0}
              max={40}
              value={formData.experienceYears ?? 0}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: Number(e.target.value) }))}
              className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-semibold focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Skills Management */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-app-text uppercase tracking-wider">
            Your Skills / आपका हुनर
          </label>

          {/* Active Skills Chips */}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-primary-light text-primary-dark font-bold text-xs rounded-xl border border-primary/20"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-600 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Quick Add Preset Skills */}
          <div>
            <span className="text-[11px] font-bold text-app-muted block mb-1.5 uppercase">
              Tap to add common trades:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.filter(s => !formData.skills.includes(s)).map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-app-text text-xs rounded-lg font-medium transition"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Skill Input */}
          <div className="flex space-x-2 pt-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add other skill (e.g. Inverter Repair)..."
              className="flex-1 px-3 py-2 bg-app-bg border border-app-border rounded-xl text-xs sm:text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkill)}
              className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-white font-black text-sm sm:text-base hover:bg-primary-hover active:scale-[0.98] transition shadow-md"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};
