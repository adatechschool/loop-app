export const getMapZoom = (
  paramLat: string | null,
  paramLng: string | null
): number => {
  if (paramLat === null && paramLng === null) {
    return 20;
  }
  return 16;
};

interface InitialCoordsParams {
  paramLat: string | null;
  paramLng: string | null;
  userLocation: GeolocationPosition | null;
}

export const getInitialCoords = ({
  paramLat,
  paramLng,
  userLocation,
}: InitialCoordsParams): [number, number] => {
  const defaultLat = 50.740717; // Coordonnées par défaut
  const defaultLng = 2.258634;

  const lat = paramLat
    ? parseFloat(paramLat)
    : userLocation?.coords.latitude || defaultLat;
  const lng = paramLng
    ? parseFloat(paramLng)
    : userLocation?.coords.longitude || defaultLng;

  return [lat, lng];
};
