import { useEffect, useState } from "react";

const useGeolocation = () => {
  // interface LocationPosition {
  //   coords: {
  //     latitude: number;
  //     longitude: number;
  //     accuracy: number;
  //   };
  // }

  // interface LocationPositionError {
  //   code: number;
  //   message: string;
  // }

  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    const watchPosition = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        setLocation(position);
        console.log("Geolocation position:", position);
      },
      (error: GeolocationPositionError) => {
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
