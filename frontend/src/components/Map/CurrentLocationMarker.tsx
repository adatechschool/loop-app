import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useGeolocationContext } from "../../providers/GeolocationContext";

const CurrentLocationMarker = () => {
  const map = useMap();
  const { location, error } = useGeolocationContext();
  const markerRef = useRef<L.Marker>();

  useEffect(() => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
    }
  }, [location, map]);

  if (error) {
    console.error(`Geolocation error (${error.code}): ${error.message}`);
  }

  return null;
};

export default CurrentLocationMarker;
