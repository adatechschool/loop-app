import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PublicRoute from '../PublicRoute';

// Mock AuthContext
const mockUseContext = jest.fn();
React.useContext = mockUseContext;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PublicRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render loading state when auth is loading', () => {
    mockUseContext.mockReturnValue({
      user: null,
      loading: true,
    });

    renderWithRouter(
      <PublicRoute>
        <div>Public Content</div>
      </PublicRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should render children when user is not authenticated', () => {
    mockUseContext.mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithRouter(
      <PublicRoute>
        <div>Public Content</div>
      </PublicRoute>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  test('should redirect to home when user is authenticated', () => {
    mockUseContext.mockReturnValue({
      user: { id: 1, username: 'testuser' },
      loading: false,
    });

    renderWithRouter(
      <PublicRoute>
        <div>Public Content</div>
      </PublicRoute>
    );

    // Should redirect, so public content should not be visible
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  test('should handle auth context gracefully', () => {
    mockUseContext.mockReturnValue({
      user: undefined,
      loading: false,
    });

    renderWithRouter(
      <PublicRoute>
        <div data-testid="public-content">Login Form</div>
      </PublicRoute>
    );

    expect(screen.getByTestId('public-content')).toBeInTheDocument();
  });

  test('should not render public content when authenticated user exists', () => {
    mockUseContext.mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      loading: false,
    });

    renderWithRouter(
      <PublicRoute>
        <div data-testid="login-form">Login Form</div>
      </PublicRoute>
    );

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});