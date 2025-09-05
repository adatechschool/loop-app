import { renderHook, waitFor } from '@testing-library/react';
import useQueryPlaces from './useQueryPlaces';

// Mock the apiClient module
jest.mock('../utils/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  }
}));

import apiClient from '../utils/apiClient';
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useQueryPlaces', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedApiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { result } = renderHook(() => useQueryPlaces());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch places successfully', async () => {
    const mockPlaces = [
      { id: 1, name: 'Place 1', address: 'Address 1' },
      { id: 2, name: 'Place 2', address: 'Address 2' }
    ];
    
    mockedApiClient.get.mockResolvedValueOnce({
      data: { places: mockPlaces }
    });

    const { result } = renderHook(() => useQueryPlaces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.places).toEqual(mockPlaces);
    expect(result.current.error).toBeNull();
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/places');
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Network Error';
    mockedApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useQueryPlaces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/places');
  });

  it('should handle API errors without message', async () => {
    mockedApiClient.get.mockRejectedValueOnce({});

    const { result } = renderHook(() => useQueryPlaces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch places data');
  });
});