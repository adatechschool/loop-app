import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthContext, AuthProvider } from '../AuthContext';
import apiClient from '../../utils/apiClient';

// Mock apiClient
jest.mock('../../utils/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should provide initial auth state', () => {
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test('should login successfully and fetch user', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    mockedApiClient.get.mockResolvedValueOnce({
      data: { user: mockUser },
    });

    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    await act(async () => {
      result.current.login('test-token');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.token).toBe('test-token');
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('should logout successfully', async () => {
    localStorage.setItem('token', 'test-token');
    
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
  });

  test('should handle fetch user error', async () => {
    localStorage.setItem('token', 'invalid-token');
    mockedApiClient.get.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe('Unauthorized');
    expect(result.current.token).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
  });

  test('should refetch user successfully', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    localStorage.setItem('token', 'test-token');
    mockedApiClient.get.mockResolvedValueOnce({
      data: { user: mockUser },
    });

    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refetchUser();
    });

    expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
  });
});