import React, { createContext, useContext } from "react";
import useGeolocation from "../hooks/useGeolocation";

const GeolocationContext = createContext<ReturnType<
  typeof useGeolocation
> | null>(null);

export const GeolocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const geo = useGeolocation();
  return (
    <GeolocationContext.Provider value={geo}>
      {children}
    </GeolocationContext.Provider>
  );
};

export const useGeolocationContext = () => {
  const context = useContext(GeolocationContext);
  if (!context)
    throw new Error(
      "useGeolocationContext can't be used without GeolocationProvider"
    );
  return context;
};
