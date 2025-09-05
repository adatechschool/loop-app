import { renderHook, waitFor } from '@testing-library/react';
import useGeolocation from './useGeolocation';

// Mock navigator.geolocation
const mockGeolocation = {
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  getCurrentPosition: jest.fn()
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  configurable: true
});

describe('useGeolocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    mockGeolocation.watchPosition.mockImplementation(() => 1); // Return watch ID
    
    const { result } = renderHook(() => useGeolocation());
    
    expect(result.current.location).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockGeolocation.watchPosition).toHaveBeenCalled();
  });

  it('should handle successful geolocation', async () => {
    const mockPosition: GeolocationPosition = {
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };

    mockGeolocation.watchPosition.mockImplementation((successCallback) => {
      successCallback(mockPosition);
      return 1;
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.location).toEqual(mockPosition);
    });

    expect(result.current.error).toBeNull();
  });

  it('should handle geolocation errors', async () => {
    const mockError: GeolocationPositionError = {
      code: 1,
      message: 'User denied the request for Geolocation.',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };

    mockGeolocation.watchPosition.mockImplementation((successCallback, errorCallback) => {
      if (errorCallback) {
        errorCallback(mockError);
      }
      return 1;
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    expect(result.current.location).toBeNull();
  });

  it('should clear watch on unmount', () => {
    const watchId = 123;
    mockGeolocation.watchPosition.mockReturnValue(watchId);

    const { unmount } = renderHook(() => useGeolocation());

    unmount();

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId);
  });

  it('should handle different error codes', async () => {
    const positionUnavailableError: GeolocationPositionError = {
      code: 2,
      message: 'Position unavailable.',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };

    mockGeolocation.watchPosition.mockImplementation((successCallback, errorCallback) => {
      if (errorCallback) {
        errorCallback(positionUnavailableError);
      }
      return 1;
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toEqual(positionUnavailableError);
    });

    expect(result.current.location).toBeNull();
  });

  it('should handle timeout errors', async () => {
    const timeoutError: GeolocationPositionError = {
      code: 3,
      message: 'Timeout.',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };

    mockGeolocation.watchPosition.mockImplementation((successCallback, errorCallback) => {
      if (errorCallback) {
        errorCallback(timeoutError);
      }
      return 1;
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toEqual(timeoutError);
    });

    expect(result.current.location).toBeNull();
  });
});