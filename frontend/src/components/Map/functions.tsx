import { DEFAULT_COORDS, DEFAULT_ZOOM, ZOOM_WITH_PARAMS } from "./constant";

export const getMapZoom = (
  paramLat: string | null,
  paramLng: string | null
): number => {
  if (paramLat === null && paramLng === null) {
    return DEFAULT_ZOOM;
  }
  return ZOOM_WITH_PARAMS;
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
  const lat = paramLat
    ? parseFloat(paramLat)
    : userLocation?.coords.latitude || DEFAULT_COORDS.LAT;
  const lng = paramLng
    ? parseFloat(paramLng)
    : userLocation?.coords.longitude || DEFAULT_COORDS.LNG;

  return [lat, lng];
};
