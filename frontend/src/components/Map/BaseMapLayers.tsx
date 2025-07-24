// src/components/map/MapLayer.tsx
import { TileLayer } from "react-leaflet";

const BaseMapLayers = () => {
  return <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />;
};

export default BaseMapLayers;
