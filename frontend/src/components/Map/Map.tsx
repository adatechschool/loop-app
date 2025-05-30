import React, { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useGeolocationContext } from "./../../providers/GeolocationContext";
import "./style.css";

const Map = () => {
  const map = useMap();
  const { location, error } = useGeolocationContext();

  const markerRef = useRef<L.Marker>();
  const circleRef = useRef<L.Circle>();

  useEffect(() => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const accuracy = location.coords.accuracy;

      if (markerRef.current) map.removeLayer(markerRef.current);
      if (circleRef.current) map.removeLayer(circleRef.current);

      circleRef.current = new L.Circle([lat, lng], { radius: accuracy }).addTo(
        map
      );
      markerRef.current = L.marker([lat, lng]).addTo(map);

      map.fitBounds(circleRef.current.getBounds());
    }
  }, [location, map]);

  if (error) {
    console.error(`Geolocation error (${error.code}): ${error.message}`);
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
