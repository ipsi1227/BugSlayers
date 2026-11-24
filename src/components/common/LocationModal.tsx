import React from 'react';
import { X, MapPin, Navigation, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from '../../context/LocationContext';
import { LOCALITIES } from '../../data/localities';
import { Locality } from '../../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { selectedLocality, setSelectedLocality, isLocating, locationError, detectCurrentLocation } = useLocation();

  if (!isOpen) return null;

  const handleSelect = (locality: Locality) => {
    setSelectedLocality(locality);
    onClose();
  };

  const handleUseCurrentLocation = async () => {
    await detectCurrentLocation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-app-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-app-text">{t.selectLocation}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-app-muted hover:text-app-text transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* GPS Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-primary text-white font-bold text-sm sm:text-base hover:bg-primary-hover active:scale-[0.99] transition shadow-sm disabled:opacity-70"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.locationDetecting}</span>
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 text-accent-yellow" />
                <span>{t.useMyLocation}</span>
              </>
            )}
          </button>

          {/* Location Error Warning if denied */}
          {locationError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs sm:text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t.locationPermissionDenied}</p>
                <p className="text-xs text-amber-700 mt-0.5">Please choose your nearest Bengaluru area below.</p>
              </div>
            </div>
          )}

          {/* Locality List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted mb-2.5">
              Popular Bengaluru Areas
            </h3>
            <div className="space-y-1.5">
              {LOCALITIES.map((loc) => {
                const isSelected = selectedLocality.id === loc.id;
                const locName = loc.name[language] || loc.name.en;
                const locNameEn = loc.name.en;

                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition text-left ${
                      isSelected
                        ? 'border-primary bg-primary-light/40 text-primary-dark font-bold'
                        : 'border-app-border hover:bg-gray-50 text-app-text font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-app-muted'}`} />
                      <div>
                        <span className="block text-sm sm:text-base leading-snug">{locName}</span>
                        {language !== 'en' && (
                          <span className="text-xs text-app-muted leading-none">{locNameEn}</span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
