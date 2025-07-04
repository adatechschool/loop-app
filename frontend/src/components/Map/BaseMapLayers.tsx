// src/components/map/MapLayer.tsx
import { TileLayer, Marker } from "react-leaflet";

interface MapLayerProps {
  initialPosition: [number, number];
}

const BaseMapLayers = ({ initialPosition }: MapLayerProps) => {
  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={initialPosition} />
    </>
  );
};

export default BaseMapLayers;
