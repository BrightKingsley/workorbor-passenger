import {GEOCODE_URL, GOOGLE_MAPS_API_KEY} from '../constants';

export function getGeocodeUrl({lat, lng}: {lat: number; lng: number}) {
  return `${GEOCODE_URL}latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = degreesToRadians(lat2 - lat1);
  const dLng = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

export function hasMovedSignificantly(
  {
    currLat,
    currLng,
    prevLat,
    prevLng,
  }: {prevLat: number; prevLng: number; currLat: number; currLng: number},
  threshold: number = 0.5,
): boolean {
  const distance = haversineDistance(prevLat, prevLng, currLat, currLng);
  return distance > threshold;
}
