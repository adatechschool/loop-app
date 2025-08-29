import { renderHook, waitFor } from '@testing-library/react';
import useQueryPlaces from '../useQueryPlaces';
import apiClient from '../../utils/apiClient';

// Mock apiClient
jest.mock('../../utils/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useQueryPlaces', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console logs in tests
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fetch places data successfully', async () => {
    const mockPlaces = [
      { id: 1, name: 'Place 1', description: 'Description 1' },
      { id: 2, name: 'Place 2', description: 'Description 2' },
    ];

    mockedApiClient.get.mockResolvedValueOnce({
      data: { places: mockPlaces },
    });

    const { result } = renderHook(() => useQueryPlaces());

    expect(result.current.loading).toBe(true);
    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.places).toEqual(mockPlaces);
    expect(result.current.error).toBe(null);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/places');
  });

  test('should handle error when fetching places data', async () => {
    const errorMessage = 'Failed to fetch places data';
    mockedApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useQueryPlaces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  test('should handle API error response', async () => {
    const apiError = {
      message: 'Network Error',
      response: { status: 500 },
    };
    mockedApiClient.get.mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useQueryPlaces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBe('Network Error');
  });
});