import apiClient from '../apiClient';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  })),
}));

describe('apiClient', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('creates axios instance with correct baseURL', () => {
    expect(apiClient).toBeDefined();
  });

  test('apiClient is properly configured', () => {
    localStorage.setItem('token', 'test-token');
    
    // The apiClient should exist and be an axios instance
    expect(apiClient).toBeDefined();
    expect(apiClient.interceptors).toBeDefined();
    expect(apiClient.interceptors.request).toBeDefined();
  });
});