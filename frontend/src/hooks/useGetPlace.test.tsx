import { renderHook, waitFor } from '@testing-library/react';
import useGetPlace from './useGetPlace';

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

describe('useGetPlace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial loading state with valid placeId', () => {
    mockedApiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { result } = renderHook(() => useGetPlace('123'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.place).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when placeId is empty', () => {
    const { result } = renderHook(() => useGetPlace(''));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.place).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockedApiClient.get).not.toHaveBeenCalled();
  });

  it('should fetch place successfully with valid placeId', async () => {
    const mockPlace = {
      id: '123',
      name: 'Test Place',
      address: 'Test Address',
      description: 'Test Description'
    };
    const placeId = '123';
    
    mockedApiClient.get.mockResolvedValueOnce({
      data: { place: mockPlace }
    });

    const { result } = renderHook(() => useGetPlace(placeId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toEqual(mockPlace);
    expect(result.current.error).toBeNull();
    expect(mockedApiClient.get).toHaveBeenCalledWith(`/api/places/${placeId}`);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Place not found';
    const placeId = '999';
    
    mockedApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useGetPlace(placeId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toBeNull();
    expect(result.current.error).toBe(errorMessage);
    expect(mockedApiClient.get).toHaveBeenCalledWith(`/api/places/${placeId}`);
  });

  it('should handle API errors without message', async () => {
    const placeId = '456';
    mockedApiClient.get.mockRejectedValueOnce({});

    const { result } = renderHook(() => useGetPlace(placeId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toBeNull();
    expect(result.current.error).toBe('Failed to fetch place data');
  });

  it('should refetch when placeId changes', async () => {
    const mockPlace1 = { id: '123', name: 'Place 1' };
    const mockPlace2 = { id: '456', name: 'Place 2' };
    
    mockedApiClient.get
      .mockResolvedValueOnce({ data: { place: mockPlace1 } })
      .mockResolvedValueOnce({ data: { place: mockPlace2 } });

    const { result, rerender } = renderHook(
      ({ placeId }) => useGetPlace(placeId),
      { initialProps: { placeId: '123' } }
    );

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toEqual(mockPlace1);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/places/123');

    // Change placeId
    rerender({ placeId: '456' });

    // Wait for second fetch
    await waitFor(() => {
      expect(result.current.place).toEqual(mockPlace2);
    });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/places/456');
    expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
  });

  it('should not fetch when placeId changes to empty string', async () => {
    const mockPlace = { id: '123', name: 'Place 1' };
    
    mockedApiClient.get.mockResolvedValueOnce({ data: { place: mockPlace } });

    const { result, rerender } = renderHook(
      ({ placeId }) => useGetPlace(placeId),
      { initialProps: { placeId: '123' } }
    );

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toEqual(mockPlace);
    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);

    // Change placeId to empty string
    rerender({ placeId: '' });

    // Should not trigger another API call
    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);
  });
});