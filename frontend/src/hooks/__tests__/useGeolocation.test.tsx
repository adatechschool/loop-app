import { renderHook, act } from '@testing-library/react';
import useGeolocation from '../useGeolocation';

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  configurable: true,
});

describe('useGeolocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should watch position and update location', () => {
    const mockPosition: GeolocationPosition = {
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    let watchSuccessCallback: (position: GeolocationPosition) => void;
    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      watchSuccessCallback = success;
      return 123; // mock watch id
    });

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.location).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockGeolocation.watchPosition).toHaveBeenCalled();

    // Simulate successful location update
    act(() => {
      watchSuccessCallback(mockPosition);
    });

    expect(result.current.location).toEqual(mockPosition);
    expect(result.current.error).toBe(null);
  });

  test('should handle geolocation error', () => {
    const mockError: GeolocationPositionError = {
      code: 1,
      message: 'User denied geolocation',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    let watchErrorCallback: (error: GeolocationPositionError) => void;
    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      watchErrorCallback = error!;
      return 123;
    });

    const { result } = renderHook(() => useGeolocation());

    // Simulate geolocation error
    act(() => {
      watchErrorCallback(mockError);
    });

    expect(result.current.location).toBe(null);
    expect(result.current.error).toEqual(mockError);
  });

  test('should clear watch on unmount', () => {
    mockGeolocation.watchPosition.mockReturnValue(123);

    const { unmount } = renderHook(() => useGeolocation());

    unmount();

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
  });
});