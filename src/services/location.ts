import { LocationSnapshot } from '../types';

export async function captureOneTimeLocation(): Promise<LocationSnapshot> {
  const timestamp = new Date().toISOString();

  if (!navigator.geolocation) {
    return {
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp,
      approximateAddress: null,
      campusLandmark: 'Campus Location (Geolocation not supported by browser)',
      mapsUrl: null,
      error: 'Geolocation API is not supported on this device/browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        let approximateAddress: string | null = null;
        try {
          // Attempt lightweight reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'JeevanSetu-HealthCompanion/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            approximateAddress = data.display_name || `${data.address?.road || ''}, ${data.address?.city || ''}`;
          }
        } catch (e) {
          console.warn('Reverse geocoding not available:', e);
        }

        resolve({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          timestamp,
          approximateAddress: approximateAddress || `GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
          campusLandmark: 'Current Device Location Snapshot',
          mapsUrl,
          error: null,
        });
      },
      (error) => {
        let errorMessage = 'Location permission denied by user.';
        if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out.';
        }

        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp,
          approximateAddress: null,
          campusLandmark: 'Location permission denied / unavailable',
          mapsUrl: null,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
}
