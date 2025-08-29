import React from 'react';
import { renderHook } from '@testing-library/react';
import { PlacesProvider, usePlacesContext } from '../PlacesContext';

// Mock useQueryPlaces hook
const mockUseQueryPlaces = jest.fn();
jest.mock('../../hooks/useQueryPlaces', () => ({
  __esModule: true,
  default: () => mockUseQueryPlaces(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PlacesProvider>{children}</PlacesProvider>
);

describe('PlacesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should provide places data from useQueryPlaces', () => {
    const mockPlacesData = {
      places: [
        { id: 1, name: 'Place 1' },
        { id: 2, name: 'Place 2' },
      ],
      loading: false,
      error: null,
    };

    mockUseQueryPlaces.mockReturnValue(mockPlacesData);

    const { result } = renderHook(() => usePlacesContext(), { wrapper });

    expect(result.current).toEqual(mockPlacesData);
  });

  test('should provide loading state', () => {
    const mockPlacesData = {
      places: [],
      loading: true,
      error: null,
    };

    mockUseQueryPlaces.mockReturnValue(mockPlacesData);

    const { result } = renderHook(() => usePlacesContext(), { wrapper });

    expect(result.current?.loading).toBe(true);
    expect(result.current?.places).toEqual([]);
    expect(result.current?.error).toBe(null);
  });

  test('should provide error state', () => {
    const mockPlacesData = {
      places: [],
      loading: false,
      error: 'Failed to fetch places',
    };

    mockUseQueryPlaces.mockReturnValue(mockPlacesData);

    const { result } = renderHook(() => usePlacesContext(), { wrapper });

    expect(result.current?.loading).toBe(false);
    expect(result.current?.places).toEqual([]);
    expect(result.current?.error).toBe('Failed to fetch places');
  });

  test('should return undefined when used outside provider', () => {
    const { result } = renderHook(() => usePlacesContext());

    expect(result.current).toBeUndefined();
  });
});