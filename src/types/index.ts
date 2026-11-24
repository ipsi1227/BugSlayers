export type Language = 'en' | 'hi' | 'kn';

export type WageType = 'per_day' | 'per_hour' | 'per_month' | 'fixed_contract';

export type JobDuration = 'daily' | '1-3 days' | '1 week' | '1-3 months' | 'permanent' | 'contract';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'hired' | 'rejected';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Locality {
  id: string;
  name: {
    en: string;
    hi: string;
    kn: string;
  };
  city: string;
  coordinates: Coordinates;
}

export interface JobCategory {
  id: string;
  name: {
    en: string;
    hi: string;
    kn: string;
  };
  icon: string; // Lucide icon identifier
  color: string;
  bgLight: string;
}

export interface Job {
  id: string;
  title: string;
  titleHi?: string;
  categoryId: string;
  workersNeeded: number;
  wageAmount: number;
  wageType: WageType;
  localityId: string;
  localityName: string;
  address?: string;
  coordinates: Coordinates;
  workingHours: string;
  duration: JobDuration;
  startDate: string;
  description: string;
  descriptionHi?: string;
  requirements?: string[];
  employerName: string;
  employerPhone: string;
  isUrgent?: boolean;
  isFilled?: boolean;
  createdAt: string;
  distanceKm?: number; // Calculated dynamically for the active user
}

export interface WorkerProfile {
  name: string;
  phone: string;
  skills: string[];
  preferredCategories: string[];
  preferredLocalityId: string;
  preferredLocalityName: string;
  experienceYears?: number;
  bio?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  employerName: string;
  localityName: string;
  wageAmount: number;
  wageType: WageType;
  workerName: string;
  workerPhone: string;
  workerSkills: string[];
  workerExperience?: number;
  workerLocality?: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'all' or categoryId
  maxDistanceKm: number | null; // null for all distances, or 2, 5, 10
  wageType: string; // 'all' or WageType
  minWage: number;
  urgentOnly: boolean;
  sortBy: 'distance' | 'wage' | 'recent';
}
