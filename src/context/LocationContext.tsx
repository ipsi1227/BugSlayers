import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coordinates, Locality } from '../types';
import { LOCALITIES, DEFAULT_LOCALITY } from '../data/localities';
import { StorageService } from '../utils/storage';
import { calculateDistanceKm } from '../utils/distance';

interface LocationContextType {
  selectedLocality: Locality;
  setSelectedLocality: (locality: Locality) => void;
  userCoords: Coordinates | null;
  isLocating: boolean;
  locationError: string | null;
  detectCurrentLocation: () => Promise<void>;
  resetLocationError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocality, setSelectedLocalityState] = useState<Locality>(() => StorageService.getLocality());
  const [userCoords, setUserCoords] = useState<Coordinates | null>(() => {
    const loc = StorageService.getLocality();
    return loc ? loc.coordinates : DEFAULT_LOCALITY.coordinates;
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const setSelectedLocality = (locality: Locality) => {
    setSelectedLocalityState(locality);
    setUserCoords(locality.coordinates);
    StorageService.saveLocality(locality);
    setLocationError(null);
  };

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserCoords(coords);
        setIsLocating(false);

        // Find nearest known Bengaluru locality to match name
        let nearestLocality = DEFAULT_LOCALITY;
        let minDistance = Infinity;

        LOCALITIES.forEach(loc => {
          const d = calculateDistanceKm(coords, loc.coordinates);
          if (d < minDistance) {
            minDistance = d;
            nearestLocality = loc;
          }
        });

        // If reasonably close to Bengaluru locality, use that locality name
        setSelectedLocalityState(nearestLocality);
        StorageService.saveLocality(nearestLocality);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Could not access location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please select your area from the list.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }
        setLocationError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes, DO NOT track continuously
      }
    );
  };

  const resetLocationError = () => {
    setLocationError(null);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocality,
        setSelectedLocality,
        userCoords,
        isLocating,
        locationError,
        detectCurrentLocation,
        resetLocationError
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
