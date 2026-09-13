"use client";
import { useState, useEffect, useCallback } from 'react';

export function useGpsLocation() {
  const [coords, setCoords] = useState({ latitude: 40.7128, longitude: -74.0060, accuracy: 3.0 });
  const [address, setAddress] = useState('742 Evergreen Terrace, Ward 4');
  const [status, setStatus] = useState('idle'); // 'idle' | 'prompt' | 'loading' | 'granted' | 'denied' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  // Reverse geocoding function using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Geocoding response not ok');
      const data = await res.json();
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || data.address.suburb || data.address.neighbourhood || '';
        const house = data.address.house_number ? `${data.address.house_number} ` : '';
        const city = data.address.city || data.address.town || data.address.village || 'Springfield';
        const fullAddr = road ? `${house}${road}, ${city}` : (data.display_name.split(',').slice(0, 3).join(','));
        setAddress(fullAddr);
        return fullAddr;
      }
    } catch (err) {
      console.warn('Reverse geocoding fallback:', err);
    }
    const fallback = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° W, Ward 4`;
    setAddress(fallback);
    return fallback;
  };

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    setStatus('loading');
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = Math.round((position.coords.accuracy || 3.0) * 10) / 10;

        setCoords({ latitude: lat, longitude: lon, accuracy: acc });
        setStatus('granted');

        await reverseGeocode(lat, lon);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setStatus('denied');
        setErrorMsg(error.message || 'Location permission denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    // Attempt auto request if browser permission allows
    if (typeof window !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        } else if (result.state === 'prompt') {
          setStatus('prompt');
        } else if (result.state === 'denied') {
          setStatus('denied');
        }
      }).catch(() => {
        setStatus('prompt');
      });
    } else {
      setStatus('prompt');
    }
  }, [requestLocation]);

  return {
    coords,
    address,
    status,
    errorMsg,
    requestLocation,
    setAddress,
    setCoords
  };
}
