import React from 'react';
import { renderHook } from '@testing-library/react';
import { GeolocationProvider, useGeolocationContext } from '../GeolocationContext';

// Mock useGeolocation hook
const mockUseGeolocation = jest.fn();
jest.mock('../../hooks/useGeolocation', () => ({
  __esModule: true,
  default: () => mockUseGeolocation(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GeolocationProvider>{children}</GeolocationProvider>
);

describe('GeolocationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should provide geolocation data', () => {
    const mockGeolocationData = {
      location: {
        coords: {
          latitude: 48.8566,
          longitude: 2.3522,
          accuracy: 10,
        },
        timestamp: Date.now(),
      },
      error: null,
    };

    mockUseGeolocation.mockReturnValue(mockGeolocationData);

    const { result } = renderHook(() => useGeolocationContext(), { wrapper });

    expect(result.current).toEqual(mockGeolocationData);
  });

  test('should provide error state', () => {
    const mockGeolocationData = {
      location: null,
      error: {
        code: 1,
        message: 'User denied geolocation',
      },
    };

    mockUseGeolocation.mockReturnValue(mockGeolocationData);

    const { result } = renderHook(() => useGeolocationContext(), { wrapper });

    expect(result.current.location).toBe(null);
    expect(result.current.error).toEqual({
      code: 1,
      message: 'User denied geolocation',
    });
  });

  test('should throw error when used outside provider', () => {
    mockUseGeolocation.mockReturnValue({
      location: null,
      error: null,
    });

    const { result } = renderHook(() => useGeolocationContext());

    expect(result.error).toEqual(
      Error("useGeolocationContext can't be used without GeolocationProvider")
    );
  });

  test('should update when geolocation data changes', () => {
    const initialData = { location: null, error: null };
    const updatedData = {
      location: {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        timestamp: Date.now(),
      },
      error: null,
    };

    mockUseGeolocation
      .mockReturnValueOnce(initialData)
      .mockReturnValue(updatedData);

    const { result, rerender } = renderHook(() => useGeolocationContext(), { wrapper });

    expect(result.current).toEqual(initialData);

    rerender();

    expect(result.current).toEqual(updatedData);
  });
});