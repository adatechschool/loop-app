import React from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat") || "50.740717");
  const lng = parseFloat(params.get("lng") || "2.258634");

  // need to setView after the return to the map page

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={20}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {}
      <Marker position={[lat, lng]} />
      <Map />
    </MapContainer>
  );
};

export default MapComponent;
