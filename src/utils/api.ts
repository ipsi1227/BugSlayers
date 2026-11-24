import { Job, JobApplication, WorkerProfile } from '../types';
import { StorageService } from './storage';

/**
 * Unified API Client
 * Supports both Demo Mode (localStorage) and Cloud Mode (AWS/Express backend).
 */
export const ApiClient = {
  isCloudMode(): boolean {
    return StorageService.isCloudMode();
  },

  setCloudMode(enabled: boolean): void {
    StorageService.setCloudMode(enabled);
  },

  async getJobs(): Promise<Job[]> {
    if (this.isCloudMode()) {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          return data.jobs || [];
        }
      } catch (e) {
        console.warn('Cloud API fetch failed, using local storage fallback:', e);
      }
    }
    return StorageService.getJobs();
  },

  async getJobById(id: string): Promise<Job | null> {
    if (this.isCloudMode()) {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          return data.job || null;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    const jobs = StorageService.getJobs();
    return jobs.find(j => j.id === id) || null;
  },

  async createJob(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    if (this.isCloudMode()) {
      try {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData)
        });
        if (res.ok) {
          const data = await res.json();
          // also sync to local storage
          StorageService.addJob(data.job);
          return data.job;
        }
      } catch (e) {
        console.warn('Cloud post job failed, falling back to local storage:', e);
      }
    }

    StorageService.addJob(newJob);
    return newJob;
  },

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job[]> {
    if (this.isCloudMode()) {
      try {
        await fetch(`/api/jobs/${jobId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (e) {
        console.warn(e);
      }
    }
    return StorageService.updateJob(jobId, updates);
  },

  async deleteJob(jobId: string): Promise<Job[]> {
    if (this.isCloudMode()) {
      try {
        await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn(e);
      }
    }
    return StorageService.deleteJob(jobId);
  },

  async submitApplication(appData: {
    jobId: string;
    jobTitle: string;
    employerName: string;
    localityName: string;
    wageAmount: number;
    wageType: Job['wageType'];
    workerName: string;
    workerPhone: string;
    workerSkills: string[];
    workerExperience?: number;
    workerLocality?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const application: JobApplication = {
      ...appData,
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'applied',
      appliedAt: new Date().toISOString()
    };

    if (this.isCloudMode()) {
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(application)
        });
        if (res.status === 409) {
          return { success: false, error: 'ALREADY_APPLIED' };
        }
        if (res.ok) {
          StorageService.addApplication(application);
          return { success: true };
        }
      } catch (e) {
        console.warn('Cloud application submit failed, using local storage:', e);
      }
    }

    return StorageService.addApplication(application);
  },

  async getApplications(): Promise<JobApplication[]> {
    if (this.isCloudMode()) {
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          return data.applications || [];
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return StorageService.getApplications();
  },

  async updateApplicationStatus(id: string, status: JobApplication['status']): Promise<JobApplication[]> {
    if (this.isCloudMode()) {
      try {
        await fetch(`/api/applications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      } catch (e) {
        console.warn(e);
      }
    }
    return StorageService.updateApplicationStatus(id, status);
  }
};
