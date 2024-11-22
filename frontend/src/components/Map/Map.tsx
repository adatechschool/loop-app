import React from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

const Map = () => {
  return (
    <MapContainer center={[48.849726, 2.319596]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default Map