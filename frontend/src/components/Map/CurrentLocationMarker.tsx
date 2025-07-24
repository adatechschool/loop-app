import { useGeolocationContext } from "../../contexts/GeolocationContext";
import { useMemo } from "react";
import LocationMarker from "../Icons/LocationMarker";

const CurrentLocationMarker = () => {
  const { location, error } = useGeolocationContext();

  const position = useMemo(() => {
    if (!location) return null;
    return [location.coords.latitude, location.coords.longitude];
  }, [location]);

  if (error) {
    console.error(`Geolocation error (${error.code}): ${error.message}`);
  }

  if (!position) return null;

  return <LocationMarker position={position as [number, number]} />;
};

export default CurrentLocationMarker;
