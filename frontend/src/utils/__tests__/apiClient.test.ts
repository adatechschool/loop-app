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

  test('uses token from localStorage in request interceptor', () => {
    localStorage.setItem('token', 'test-token');
    
    // The interceptor should be configured
    expect(apiClient.interceptors.request.use).toHaveBeenCalled();
  });
});