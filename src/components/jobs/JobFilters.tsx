import React from 'react';
import { Search, Mic, SlidersHorizontal, RotateCcw, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { JOB_CATEGORIES } from '../../data/categories';
import { FilterState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface JobFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenVoiceSearch: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  setFilters,
  onOpenVoiceSearch
}) => {
  const { language, t } = useLanguage();

  const handleCategoryClick = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: prev.selectedCategory === catId ? 'all' : catId
    }));
  };

  const handleDistanceClick = (dist: number | null) => {
    setFilters(prev => ({
      ...prev,
      maxDistanceKm: prev.maxDistanceKm === dist ? null : dist
    }));
  };

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'all',
      maxDistanceKm: null,
      wageType: 'all',
      minWage: 0,
      urgentOnly: false,
      sortBy: 'distance'
    });
  };

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Briefcase;
    return <IconComponent className="w-5 h-5" style={{ color }} />;
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-app-border p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Bar + Big Microphone */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Big Voice Search Button */}
        <button
          onClick={onOpenVoiceSearch}
          className="flex items-center justify-center space-x-1.5 px-3.5 sm:px-4 py-3 bg-primary text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-hover active:scale-95 transition shadow-sm flex-shrink-0"
          title={t.speakToFindWork}
        >
          <Mic className="w-5 h-5 text-accent-yellow" />
          <span className="hidden sm:inline">{t.speakToFindWork}</span>
        </button>
      </div>

      {/* Distance Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-app-muted uppercase tracking-wider">
            {t.distanceFilter} ({t.inRadius})
          </span>
          {filters.maxDistanceKm !== null && (
            <span className="text-xs text-primary font-bold">
              {filters.maxDistanceKm} km
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { label: t.allDistance, value: null },
            { label: '2 km', value: 2 },
            { label: '5 km', value: 5 },
            { label: '10 km', value: 10 }
          ].map((item) => {
            const isSelected = filters.maxDistanceKm === item.value;
            return (
              <button
                key={String(item.value)}
                onClick={() => handleDistanceClick(item.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-app-bg text-app-text border-app-border hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Icons Carousel/Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-app-muted uppercase tracking-wider">
            {t.categories}
          </span>
          {filters.selectedCategory !== 'all' && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedCategory: 'all' }))}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Show all
            </button>
          )}
        </div>

        <div className="flex space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
          {JOB_CATEGORIES.map((cat) => {
            const isSelected = filters.selectedCategory === cat.id;
            const catName = cat.name[language] || cat.name.en;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition min-w-[76px] sm:min-w-[88px] flex-shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary-light shadow-xs scale-105'
                    : 'border-app-border bg-white hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 shadow-xs"
                  style={{ backgroundColor: cat.bgLight }}
                >
                  {renderIcon(cat.icon, cat.color)}
                </div>
                <span className="text-[11px] font-bold text-app-text text-center leading-tight line-clamp-1">
                  {catName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort & Urgent Toggle */}
      <div className="pt-3 border-t border-app-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-app-muted">{t.sortBy}:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="text-xs sm:text-sm font-semibold bg-app-bg border border-app-border rounded-lg px-2.5 py-1.5 text-app-text focus:outline-none focus:border-primary"
          >
            <option value="distance">{t.sortDistance}</option>
            <option value="wage">{t.sortWage}</option>
            <option value="recent">{t.sortRecent}</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-1.5 cursor-pointer text-xs sm:text-sm font-bold text-amber-800">
            <input
              type="checkbox"
              checked={filters.urgentOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, urgentOnly: e.target.checked }))}
              className="rounded text-primary focus:ring-primary w-4 h-4"
            />
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>{t.urgentOnly}</span>
          </label>

          <button
            onClick={handleReset}
            className="text-xs text-app-muted hover:text-red-600 flex items-center space-x-1 font-semibold"
            title={t.clearFilters}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.clearFilters}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
