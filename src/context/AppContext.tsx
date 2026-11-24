import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobApplication, WorkerProfile, ApplicationStatus } from '../types';
import { ApiClient } from '../utils/api';
import { StorageService } from '../utils/storage';
import { enrichJobsWithDistance } from '../utils/distance';
import { useLocation } from './LocationContext';

interface AppContextType {
  jobs: Job[];
  applications: JobApplication[];
  workerProfile: WorkerProfile;
  isCloudMode: boolean;
  isLoadingJobs: boolean;
  setCloudMode: (enabled: boolean) => void;
  refreshJobs: () => Promise<void>;
  addJob: (jobData: Omit<Job, 'id' | 'createdAt'>) => Promise<Job>;
  updateJobStatus: (jobId: string, isFilled: boolean) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  applyToJob: (
    jobId: string,
    workerName?: string,
    workerPhone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  hasApplied: (jobId: string) => boolean;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  saveWorkerProfile: (profile: WorkerProfile) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userCoords } = useLocation();
  const [rawJobs, setRawJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile>(() => StorageService.getProfile());
  const [isCloudMode, setIsCloudModeState] = useState<boolean>(() => ApiClient.isCloudMode());
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);

  // Load initial data
  const loadData = async () => {
    setIsLoadingJobs(true);
    try {
      const [loadedJobs, loadedApps] = await Promise.all([
        ApiClient.getJobs(),
        ApiClient.getApplications()
      ]);
      setRawJobs(loadedJobs);
      setApplications(loadedApps);
    } catch (e) {
      console.error('Error loading initial data:', e);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isCloudMode]);

  // Enrich jobs dynamically with distance from worker's current coordinates
  const jobs = enrichJobsWithDistance(rawJobs, userCoords);

  const setCloudMode = (enabled: boolean) => {
    setIsCloudModeState(enabled);
    ApiClient.setCloudMode(enabled);
  };

  const refreshJobs = async () => {
    await loadData();
  };

  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
    const created = await ApiClient.createJob(jobData);
    setRawJobs(prev => [created, ...prev]);
    return created;
  };

  const updateJobStatus = async (jobId: string, isFilled: boolean) => {
    const updatedList = await ApiClient.updateJob(jobId, { isFilled });
    setRawJobs(updatedList);
  };

  const deleteJob = async (jobId: string) => {
    const updatedList = await ApiClient.deleteJob(jobId);
    setRawJobs(updatedList);
  };

  const applyToJob = async (
    jobId: string,
    customName?: string,
    customPhone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const job = rawJobs.find(j => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found' };

    const name = customName || workerProfile.name;
    const phone = customPhone || workerProfile.phone;

    if (!name || !phone) {
      return { success: false, error: 'PROFILE_INCOMPLETE' };
    }

    const result = await ApiClient.submitApplication({
      jobId: job.id,
      jobTitle: job.title,
      employerName: job.employerName,
      localityName: job.localityName,
      wageAmount: job.wageAmount,
      wageType: job.wageType,
      workerName: name,
      workerPhone: phone,
      workerSkills: workerProfile.skills,
      workerExperience: workerProfile.experienceYears,
      workerLocality: workerProfile.preferredLocalityName
    });

    if (result.success) {
      const refreshedApps = await ApiClient.getApplications();
      setApplications(refreshedApps);
    }

    return result;
  };

  const hasApplied = (jobId: string): boolean => {
    return applications.some(
      a => a.jobId === jobId && (a.workerPhone === workerProfile.phone || !workerProfile.phone)
    );
  };

  const updateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    const updated = await ApiClient.updateApplicationStatus(appId, status);
    setApplications(updated);
  };

  const saveWorkerProfile = (profile: WorkerProfile) => {
    setWorkerProfile(profile);
    StorageService.saveProfile(profile);
  };

  const resetDemoData = () => {
    StorageService.resetDemoData();
    loadData();
    setWorkerProfile(StorageService.getProfile());
  };

  return (
    <AppContext.Provider
      value={{
        jobs,
        applications,
        workerProfile,
        isCloudMode,
        isLoadingJobs,
        setCloudMode,
        refreshJobs,
        addJob,
        updateJobStatus,
        deleteJob,
        applyToJob,
        hasApplied,
        updateApplicationStatus,
        saveWorkerProfile,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
