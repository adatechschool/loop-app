import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./style.css";
import L from "leaflet";

const Map = () => {
  const map = useMap();

  navigator.geolocation.watchPosition(success, error);
  let circle: L.Circle;
  let marker: L.Marker;

  interface PositionType {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  }

  function success(position: PositionType) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }
    circle = new L.Circle([lat, lng], { radius: accuracy }).addTo(map);
    marker = L.marker([lat, lng]).addTo(map);

    map.fitBounds(circle.getBounds());

    console.log(position.coords);
  }
  function error(error: GeolocationPositionError) {
    if (error.code === 1) {
      alert("Please enable your geolocation access");
    }
    console.log(console.error(`ERROR(${error.code}): ${error.message}`));
  }
  return null;
};

const MapComponent = () => {
  const DEFAULT_LOCATION: [number, number] = [50.740717, 2.258634];
  return (
    <MapContainer
      center={DEFAULT_LOCATION}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Map />
    </MapContainer>
  );
};

export default MapComponent;
