import { Job, JobApplication, WorkerProfile, Language, Locality } from '../types';
import { INITIAL_JOBS } from '../data/initialJobs';
import { DEFAULT_LOCALITY } from '../data/localities';

const STORAGE_KEYS = {
  JOBS: 'kaamnearby_jobs_v1',
  APPLICATIONS: 'kaamnearby_applications_v1',
  PROFILE: 'kaamnearby_profile_v1',
  LANGUAGE: 'kaamnearby_lang_v1',
  LOCALITY: 'kaamnearby_locality_v1',
  CLOUD_MODE: 'kaamnearby_cloud_mode_v1'
};

// Default empty profile
const DEFAULT_PROFILE: WorkerProfile = {
  name: 'Raju Kumar',
  phone: '9876543210',
  skills: ['Electrician', 'Wiring', 'Inverter Fitting'],
  preferredCategories: ['electrician', 'construction'],
  preferredLocalityId: 'marathahalli',
  preferredLocalityName: 'Marathahalli',
  experienceYears: 3,
  bio: 'Hardworking electrician with 3 years residential wiring and maintenance experience.'
};

export const StorageService = {
  getJobs(): Job[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!data) {
        this.saveJobs(INITIAL_JOBS);
        return INITIAL_JOBS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  },

  saveJobs(jobs: Job[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error('Error saving jobs to storage:', e);
    }
  },

  addJob(job: Job): Job[] {
    const jobs = this.getJobs();
    const updated = [job, ...jobs];
    this.saveJobs(updated);
    return updated;
  },

  updateJob(jobId: string, updates: Partial<Job>): Job[] {
    const jobs = this.getJobs();
    const updated = jobs.map(j => (j.id === jobId ? { ...j, ...updates } : j));
    this.saveJobs(updated);
    return updated;
  },

  deleteJob(jobId: string): Job[] {
    const jobs = this.getJobs();
    const updated = jobs.filter(j => j.id !== jobId);
    this.saveJobs(updated);
    return updated;
  },

  getApplications(): JobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveApplications(apps: JobApplication[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving applications:', e);
    }
  },

  addApplication(application: JobApplication): { success: boolean; error?: string } {
    const applications = this.getApplications();
    const existing = applications.find(
      a => a.jobId === application.jobId && a.workerPhone === application.workerPhone
    );

    if (existing) {
      return { success: false, error: 'ALREADY_APPLIED' };
    }

    const updated = [application, ...applications];
    this.saveApplications(updated);
    return { success: true };
  },

  hasApplied(jobId: string, workerPhone?: string): boolean {
    if (!workerPhone) return false;
    const applications = this.getApplications();
    return applications.some(a => a.jobId === jobId && a.workerPhone === workerPhone);
  },

  updateApplicationStatus(applicationId: string, status: JobApplication['status']): JobApplication[] {
    const apps = this.getApplications();
    const updated = apps.map(a => (a.id === applicationId ? { ...a, status } : a));
    this.saveApplications(updated);
    return updated;
  },

  getProfile(): WorkerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: WorkerProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  },

  getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      return (lang === 'en' || lang === 'hi' || lang === 'kn') ? lang : 'hi';
    } catch {
      return 'hi';
    }
  },

  saveLanguage(lang: Language): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Error saving language:', e);
    }
  },

  getLocality(): Locality {
    try {
      const loc = localStorage.getItem(STORAGE_KEYS.LOCALITY);
      return loc ? JSON.parse(loc) : DEFAULT_LOCALITY;
    } catch {
      return DEFAULT_LOCALITY;
    }
  },

  saveLocality(locality: Locality): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCALITY, JSON.stringify(locality));
    } catch (e) {
      console.error('Error saving locality:', e);
    }
  },

  isCloudMode(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.CLOUD_MODE) === 'true';
    } catch {
      return false;
    }
  },

  setCloudMode(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOUD_MODE, String(enabled));
    } catch (e) {
      console.error('Error saving mode:', e);
    }
  },

  resetDemoData(): void {
    this.saveJobs(INITIAL_JOBS);
    this.saveApplications([]);
    this.saveProfile(DEFAULT_PROFILE);
  }
};
