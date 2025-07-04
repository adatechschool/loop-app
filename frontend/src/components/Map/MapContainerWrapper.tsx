// src/components/map/MapComponent.tsx
import React from "react";
import { MapContainer } from "react-leaflet";
import { useGeolocationContext } from "../../providers/GeolocationContext";
import ChangeView from "../../utils/ChangeView";
import CurrentLocationMarker from "./CurrentLocationMarker";
import BaseMapLayers from "./BaseMapLayers";
import { getMapZoom, getInitialCoords } from "./functions";
import "./style.css";

const MapContainerWrapper = () => {
  const params = new URLSearchParams(window.location.search);
  const paramLat = params.get("lat");
  const paramLng = params.get("lng");

  const { location } = useGeolocationContext();

  const coords = getInitialCoords({
    paramLat,
    paramLng,
    userLocation: location,
  });
  const zoom = getMapZoom(paramLat, paramLng);

  return (
    <MapContainer
      center={coords}
      zoom={zoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <BaseMapLayers initialPosition={coords} />
      <ChangeView coords={coords} zoom={zoom} />
      <CurrentLocationMarker />
    </MapContainer>
  );
};

export default MapContainerWrapper;
