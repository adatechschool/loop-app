import { useEffect, useState } from "react";

const useGeolocation = () => {
  interface LocationPosition {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  }

  interface LocationPositionError {
    code: number;
    message: string;
  }

  const [location, setLocation] = useState<LocationPosition | null>(null);
  const [error, setError] = useState<LocationPositionError | null>(null);

  useEffect(() => {
    const watchPosition = navigator.geolocation.watchPosition(
      (position: LocationPosition) => {
        setLocation(position);
        console.log("Geolocation position:", position);
      },
      (error: LocationPositionError) => {
        setError(error);
        console.error(`Geolocation error (${error.code}): ${error.message}`);
      }
    );
    return () => {
      navigator.geolocation.clearWatch(watchPosition);
    };
  }, []);

  return { location, error };
};

export default useGeolocation;
