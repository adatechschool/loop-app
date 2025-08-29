import { renderHook } from '@testing-library/react';
import ChangeView from '../ChangeView';

// Mock useMap from react-leaflet
const mockSetView = jest.fn();
jest.mock('react-leaflet', () => ({
  useMap: () => ({
    setView: mockSetView,
  }),
}));

describe('ChangeView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call map setView on mount', () => {
    const coords: [number, number] = [48.8566, 2.3522];
    const zoom = 13;

    renderHook(() => {
      return ChangeView({ coords, zoom });
    });

    expect(mockSetView).toHaveBeenCalledWith(coords, zoom);
  });

  test('should call map setView when coords change', () => {
    const initialCoords: [number, number] = [48.8566, 2.3522];
    const newCoords: [number, number] = [48.8606, 2.3376];
    const zoom = 13;

    const { rerender } = renderHook(
      ({ coords, zoom }) => ChangeView({ coords, zoom }),
      { initialProps: { coords: initialCoords, zoom } }
    );

    expect(mockSetView).toHaveBeenCalledWith(initialCoords, zoom);

    rerender({ coords: newCoords, zoom });

    expect(mockSetView).toHaveBeenCalledWith(newCoords, zoom);
    expect(mockSetView).toHaveBeenCalledTimes(2);
  });

  test('should call map setView when zoom changes', () => {
    const coords: [number, number] = [48.8566, 2.3522];
    const initialZoom = 13;
    const newZoom = 15;

    const { rerender } = renderHook(
      ({ coords, zoom }) => ChangeView({ coords, zoom }),
      { initialProps: { coords, zoom: initialZoom } }
    );

    expect(mockSetView).toHaveBeenCalledWith(coords, initialZoom);

    rerender({ coords, zoom: newZoom });

    expect(mockSetView).toHaveBeenCalledWith(coords, newZoom);
    expect(mockSetView).toHaveBeenCalledTimes(2);
  });

  test('should return null (no rendering)', () => {
    const coords: [number, number] = [48.8566, 2.3522];
    const zoom = 13;

    const result = ChangeView({ coords, zoom });

    expect(result).toBe(null);
  });
});