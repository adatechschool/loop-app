import { renderHook, waitFor } from '@testing-library/react';
import useGetPlace from '../useGetPlace';
import apiClient from '../../utils/apiClient';

// Mock apiClient
jest.mock('../../utils/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useGetPlace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console logs in tests
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fetch place data successfully', async () => {
    const mockPlace = {
      id: '1',
      name: 'Test Place',
      description: 'Test Description',
      address: 'Test Address',
    };

    mockedApiClient.get.mockResolvedValueOnce({
      data: { place: mockPlace },
    });

    const { result } = renderHook(() => useGetPlace('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.place).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toEqual(mockPlace);
    expect(result.current.error).toBe(null);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/places/1');
  });

  test('should handle error when fetching place data', async () => {
    const errorMessage = 'Failed to fetch place data';
    mockedApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useGetPlace('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });

  test('should not fetch when placeId is empty', () => {
    const { result } = renderHook(() => useGetPlace(''));

    expect(result.current.loading).toBe(true);
    expect(result.current.place).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockedApiClient.get).not.toHaveBeenCalled();
  });

  test('should refetch when placeId changes', async () => {
    const mockPlace1 = { id: '1', name: 'Place 1' };
    const mockPlace2 = { id: '2', name: 'Place 2' };

    mockedApiClient.get
      .mockResolvedValueOnce({ data: { place: mockPlace1 } })
      .mockResolvedValueOnce({ data: { place: mockPlace2 } });

    const { result, rerender } = renderHook(
      ({ placeId }) => useGetPlace(placeId),
      { initialProps: { placeId: '1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toEqual(mockPlace1);

    // Change placeId
    rerender({ placeId: '2' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.place).toEqual(mockPlace2);
    expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
  });
});