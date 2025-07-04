import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface ChangeViewProps {
  coords: [number, number];
  zoom: number;
}

const ChangeView = ({ coords, zoom }: ChangeViewProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(coords, zoom);
  }, [coords, zoom, map]);

  return null;
};

export default ChangeView;
