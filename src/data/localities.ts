import { Locality } from '../types';

export const LOCALITIES: Locality[] = [
  {
    id: 'marathahalli',
    name: {
      en: 'Marathahalli',
      hi: 'मराठाहल्ली',
      kn: 'ಮಾರತಹಳ್ಳಿ'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9591, longitude: 77.6974 }
  },
  {
    id: 'whitefield',
    name: {
      en: 'Whitefield',
      hi: 'व्हाइटफ़ील्ड',
      kn: 'ವೈಟ್‌ಫೀಲ್ಡ್'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9698, longitude: 77.7500 }
  },
  {
    id: 'bellandur',
    name: {
      en: 'Bellandur',
      hi: 'बेलंदूर',
      kn: 'ಬೆಳ್ಳಂದೂರು'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9304, longitude: 77.6784 }
  },
  {
    id: 'kr_puram',
    name: {
      en: 'KR Puram',
      hi: 'के आर पुरम',
      kn: 'ಕೆ ಆರ್ ಪುರಂ'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 13.0075, longitude: 77.6959 }
  },
  {
    id: 'varthur',
    name: {
      en: 'Varthur',
      hi: 'वरथुर',
      kn: 'ವರ್ತೂರು'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9406, longitude: 77.7466 }
  },
  {
    id: 'hoodi',
    name: {
      en: 'Hoodi',
      hi: 'हूडी',
      kn: 'ಹೂಡಿ'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9926, longitude: 77.7159 }
  },
  {
    id: 'hsr_layout',
    name: {
      en: 'HSR Layout',
      hi: 'एचएसआर लेआउट',
      kn: 'ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9121, longitude: 77.6446 }
  },
  {
    id: 'mahadevapura',
    name: {
      en: 'Mahadevapura',
      hi: 'महादेवपुरा',
      kn: 'ಮಹದೇವಪುರ'
    },
    city: 'Bengaluru',
    coordinates: { latitude: 12.9881, longitude: 77.6895 }
  }
];

export const DEFAULT_LOCALITY = LOCALITIES[0]; // Marathahalli
