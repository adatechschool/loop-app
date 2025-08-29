import { renderHook, waitFor } from '@testing-library/react';
import useQueryUser from '../useQueryUser';
import apiClient from '../../utils/apiClient';

// Mock apiClient
jest.mock('../../utils/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useQueryUser', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Suppress console logs in tests
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fetch user data successfully when token exists', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    localStorage.setItem('token', 'test-token');
    mockedApiClient.get.mockResolvedValueOnce({
      data: { user: mockUser },
    });

    const { result } = renderHook(() => useQueryUser());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBe(null);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/user', {
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  test('should handle no token case', async () => {
    // No token in localStorage
    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe('Utilisateur non authentifié');
    expect(mockedApiClient.get).not.toHaveBeenCalled();
  });

  test('should handle API error', async () => {
    localStorage.setItem('token', 'invalid-token');
    const apiError = {
      message: 'Unauthorized',
      response: { data: { message: 'Token invalid' } },
    };
    mockedApiClient.get.mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe('Token invalid');
  });

  test('should refetch user data when refetch is called', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    localStorage.setItem('token', 'test-token');
    mockedApiClient.get.mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    await result.current.refetch();

    expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
  });
});