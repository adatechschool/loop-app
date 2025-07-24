import React, { createContext, useContext } from "react";
import useQueryPlaces from "../hooks/useQueryPlaces";

type PlacesContextType = {
  places: any[];
  loading: boolean;
  error: string | null;
};

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export const PlacesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useQueryPlaces();
  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
};

export const usePlacesContext = () => useContext(PlacesContext);
