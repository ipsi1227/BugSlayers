import React from 'react';
import { ShieldCheck, Heart, Sparkles, Cloud } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { t, setLanguage } = useLanguage();
  const { resetDemoData } = useApp();

  return (
    <footer className="bg-white border-t border-app-border mt-12 pb-20 md:pb-8">
      {/* Trust & Safety Banner */}
      <div className="bg-[#E8F3E9] py-4 px-4 sm:px-6 border-b border-primary/20">
        <div className="max-w-6xl mx-auto flex items-start sm:items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-primary-dark">
              {t.safetyNotice}
            </h4>
            <p className="text-xs text-[#252A25]">
              {t.safetyNoticeDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-xl">🛠️</span>
              <span className="text-lg font-black text-primary-dark">{t.appName}</span>
            </div>
            <p className="text-xs text-app-muted leading-relaxed">
              {t.tagline} Connecting informal and daily wage workers directly with local employers in Bengaluru.
            </p>
          </div>

          {/* Quick Links & Language */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-app-text mb-2">
              Choose Language / भाषा चुनें
            </h4>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-xs font-semibold">
              <button
                onClick={() => setLanguage('hi')}
                className="px-2.5 py-1 rounded-md hover:bg-gray-100 text-primary font-bold"
              >
                हिंदी
              </button>
              <span>•</span>
              <button
                onClick={() => setLanguage('en')}
                className="px-2.5 py-1 rounded-md hover:bg-gray-100 text-primary font-bold"
              >
                English
              </button>
              <span>•</span>
              <button
                onClick={() => setLanguage('kn')}
                className="px-2.5 py-1 rounded-md hover:bg-gray-100 text-primary font-bold"
              >
                ಕನ್ನಡ
              </button>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  if (confirm('Reset sample jobs and profile to initial state?')) {
                    resetDemoData();
                  }
                }}
                className="text-xs text-app-muted hover:text-primary underline"
              >
                Reset Demo Data
              </button>
            </div>
          </div>

          {/* Hackathon Sponsor Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-app-text mb-2 flex items-center justify-center md:justify-start space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-accent-yellow" />
              <span>Accessibility & Architecture</span>
            </h4>
            <p className="text-xs text-app-muted leading-relaxed">
              Equipped with <strong>ElevenLabs KaamVoice</strong> Text-to-Speech audio AI for low-literacy accessibility and <strong>AWS Cloud Architecture</strong> (Lambda & DynamoDB ready).
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-app-border text-center text-xs text-app-muted flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 KaamNearby. Built for Indian informal workforce inclusion.</span>
          <span className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for workers everywhere</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
