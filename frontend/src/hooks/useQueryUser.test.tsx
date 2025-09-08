import { renderHook, waitFor, act } from "@testing-library/react";
import useQueryUser from "./useQueryUser";

// Mock the apiClient module
jest.mock("../utils/apiClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

import apiClient from "../utils/apiClient";
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useQueryUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  it("should return initial loading state", () => {
    localStorageMock.getItem.mockReturnValue("valid-token");
    mockedApiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useQueryUser());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should handle missing token", async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("Utilisateur non authentifié");
    expect(mockedApiClient.get).not.toHaveBeenCalled();
  });

  it("should fetch user successfully with valid token", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
    };
    const mockToken = "valid-token";

    localStorageMock.getItem.mockReturnValue(mockToken);
    mockedApiClient.get.mockResolvedValueOnce({
      data: { user: mockUser },
    });

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
    expect(mockedApiClient.get).toHaveBeenCalledWith("/api/user", {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
  });

  it("should handle API errors", async () => {
    const errorMessage = "Unauthorized";
    const mockError = {
      response: {
        data: { message: errorMessage },
      },
    };

    localStorageMock.getItem.mockReturnValue("invalid-token");
    mockedApiClient.get.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle errors without response data", async () => {
    const errorMessage = "Network Error";
    localStorageMock.getItem.mockReturnValue("valid-token");
    mockedApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle errors without any error message", async () => {
    localStorageMock.getItem.mockReturnValue("valid-token");
    mockedApiClient.get.mockRejectedValueOnce({});

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("Erreur inconnue");
  });

  it("should allow refetching user data", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
    };

    localStorageMock.getItem.mockReturnValue("valid-token");
    mockedApiClient.get.mockResolvedValue({
      data: { user: mockUser },
    });

    const { result } = renderHook(() => useQueryUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);

    // Test refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
  });
});
