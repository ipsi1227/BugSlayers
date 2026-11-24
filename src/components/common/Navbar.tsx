import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Globe, Briefcase, PlusCircle, User, FileText, LayoutDashboard, Cloud, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useAppLocation } from '../../context/LocationContext';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { LocationModal } from './LocationModal';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { selectedLocality } = useAppLocation();
  const { isCloudMode, setCloudMode } = useApp();
  const routerLocation = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const currentLocalityName =
    selectedLocality.name[language] || selectedLocality.name.en || selectedLocality.city;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-app-border shadow-sm">
        {/* Top Info Banner for Mode & Trust */}
        <div className="bg-[#185C38] text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
          <div className="flex items-center space-x-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4C84A] flex-shrink-0" />
            <span className="truncate">{t.demoDisclaimer}</span>
          </div>
          <button
            onClick={() => setCloudMode(!isCloudMode)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition flex-shrink-0 ml-2"
            title={isCloudMode ? t.switchToDemo : t.switchToCloud}
          >
            <Cloud className={`w-3 h-3 ${isCloudMode ? 'text-blue-300' : 'text-green-300'}`} />
            <span>{isCloudMode ? 'Cloud Mode (AWS)' : 'Demo Mode (Local)'}</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-sm group-hover:bg-primary-hover transition">
                🛠️
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-primary-dark tracking-tight block leading-tight">
                  {t.appName}
                </span>
                <span className="text-[11px] sm:text-xs text-app-muted font-medium hidden xs:block leading-none">
                  {t.tagline}
                </span>
              </div>
            </Link>

            {/* Middle: Locality Selector Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-primary-light/70 hover:bg-primary-light border border-primary/20 text-primary-dark transition text-xs sm:text-sm font-semibold max-w-[150px] sm:max-w-[200px]"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{currentLocalityName}</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase">
                Change
              </span>
            </button>

            {/* Right: Language Selector & Desktop Nav */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl border border-app-border bg-gray-50 hover:bg-gray-100 text-xs sm:text-sm font-semibold text-app-text transition"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  <span>
                    {languages.find(l => l.code === language)?.native || 'हिंदी'}
                  </span>
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-app-border py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    {languages.map(item => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-primary-light transition ${
                          language === item.code ? 'text-primary font-bold bg-primary-light/50' : 'text-app-text'
                        }`}
                      >
                        <span>{item.native}</span>
                        <span className="text-[10px] text-app-muted uppercase">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  to="/jobs"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    routerLocation.pathname === '/jobs'
                      ? 'text-primary bg-primary-light'
                      : 'text-app-text hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {t.findWork}
                </Link>
                <Link
                  to="/post-job"
                  className="px-3.5 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.postJob}</span>
                </Link>
                <Link
                  to="/applications"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    routerLocation.pathname === '/applications'
                      ? 'text-primary bg-primary-light'
                      : 'text-app-text hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {t.myApplications}
                </Link>
                <Link
                  to="/employer"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    routerLocation.pathname === '/employer'
                      ? 'text-primary bg-primary-light'
                      : 'text-app-text hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {t.employerDashboard}
                </Link>
                <Link
                  to="/profile"
                  className={`p-2 rounded-lg text-app-text hover:text-primary hover:bg-gray-50 transition ${
                    routerLocation.pathname === '/profile' ? 'text-primary bg-primary-light' : ''
                  }`}
                  title={t.workerProfile}
                >
                  <User className="w-5 h-5" />
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
};
