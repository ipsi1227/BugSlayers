import { Coordinates, Job } from '../types';

/**
 * Calculates great-circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  
  return Math.round(d * 10) / 10; // Round to 1 decimal place (e.g. 2.4 km)
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Formats distance for display
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) {
    return '';
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Formats distance in Hindi
 */
export function formatDistanceHi(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) {
    return '';
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} मीटर दूर`;
  }
  return `${distanceKm.toFixed(1)} किमी दूर`;
}

/**
 * Enriches jobs with calculated distances from user coordinates
 */
export function enrichJobsWithDistance(jobs: Job[], userCoords: Coordinates | null): Job[] {
  if (!userCoords) {
    return jobs.map(j => ({ ...j, distanceKm: undefined }));
  }

  return jobs.map(job => {
    const distanceKm = calculateDistanceKm(userCoords, job.coordinates);
    return {
      ...job,
      distanceKm
    };
  });
}
