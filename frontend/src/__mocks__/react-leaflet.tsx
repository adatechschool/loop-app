// Mock for react-leaflet
import React from 'react';

export const MapContainer = ({ children, ...props }: any) => <div data-testid="map-container">{children}</div>;
export const TileLayer = (props: any) => <div data-testid="tile-layer" />;
export const Marker = ({ children, ...props }: any) => <div data-testid="marker">{children}</div>;
export const Popup = ({ children, ...props }: any) => <div data-testid="popup">{children}</div>;
export const useMap = () => ({
  setView: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
});
export const useMapEvent = jest.fn();
export const useMapEvents = jest.fn();