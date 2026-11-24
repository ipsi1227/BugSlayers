import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { JobListingsPage } from './pages/JobListingsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { PostJobPage } from './pages/PostJobPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';

// Auto-scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <LocationProvider>
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F7F8F3] text-[#252A25]">
              <Navbar />
              <main className="flex-1 pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/jobs" element={<JobListingsPage />} />
                  <Route path="/jobs/:id" element={<JobDetailsPage />} />
                  <Route path="/post-job" element={<PostJobPage />} />
                  <Route path="/profile" element={<WorkerProfilePage />} />
                  <Route path="/employer" element={<EmployerDashboardPage />} />
                  <Route path="/applications" element={<MyApplicationsPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>
              <Footer />
              <BottomNav />
            </div>
          </BrowserRouter>
        </AppProvider>
      </LocationProvider>
    </LanguageProvider>
  );
};

export default App;
