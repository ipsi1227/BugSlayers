import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, PlusCircle, FileText, User, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-app-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 transition ${
              isActive ? 'text-primary font-bold' : 'text-app-muted font-medium'
            }`
          }
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t.findWork}</span>
        </NavLink>

        <NavLink
          to="/post-job"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 transition ${
              isActive ? 'text-primary font-bold' : 'text-app-muted font-medium'
            }`
          }
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t.postJob}</span>
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 transition ${
              isActive ? 'text-primary font-bold' : 'text-app-muted font-medium'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t.myApplications}</span>
        </NavLink>

        <NavLink
          to="/employer"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 transition ${
              isActive ? 'text-primary font-bold' : 'text-app-muted font-medium'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] leading-none">Employer</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 transition ${
              isActive ? 'text-primary font-bold' : 'text-app-muted font-medium'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t.workerProfile}</span>
        </NavLink>
      </div>
    </nav>
  );
};
