import { Marker } from "react-leaflet";
import L from "leaflet";
import "./style.css";

interface CustomMarkerProps {
  position: [number, number];
}

const LocationMarker = ({ position }: CustomMarkerProps) => {
  const locationMarker = L.divIcon({
    className: "location-marker-icon",
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="8.5" fill="#1242FF" stroke="white" stroke-width="3"/>
</svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  return <Marker position={position} icon={locationMarker} />;
};

export default LocationMarker;
