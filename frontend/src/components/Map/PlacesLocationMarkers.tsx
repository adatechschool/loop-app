import React from "react";
import { usePlacesContext } from "../../contexts/PlacesContext";
import PlacesMarkers from "../Icons/PlacesMarkers";

const PlacesLocationMarkers = () => {
  const placesContext = usePlacesContext();

  const fetchedPlaces = React.useMemo(
    () => placesContext?.places ?? [],
    [placesContext?.places]
  );
  const loadingPlaces = placesContext?.loading ?? false;
  const error = placesContext?.error;

  if (loadingPlaces || error) return null;

  return (
    <>
      {fetchedPlaces.map((place) => (
        <PlacesMarkers
          key={place.id}
          position={[place.geo.lat, place.geo.lng]}
          name={place.name}
          address={place.address}
          id={place.id}
          image={place.images?.[0]?.image?.url || ""}
        />
      ))}
    </>
  );
};

export default PlacesLocationMarkers;
