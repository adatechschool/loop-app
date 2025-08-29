import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';

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

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render loading state when auth is loading', () => {
    mockUseContext.mockReturnValue({
      user: null,
      loading: true,
    });

    renderWithRouter(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByTestId('chakra-center')).toBeInTheDocument();
    expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
  });

  test('should render children when user is authenticated', () => {
    mockUseContext.mockReturnValue({
      user: { id: 1, username: 'testuser' },
      loading: false,
    });

    renderWithRouter(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('should redirect to login when user is not authenticated', () => {
    mockUseContext.mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithRouter(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    // Should redirect, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('should not render protected content when user is null', () => {
    mockUseContext.mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithRouter(
      <PrivateRoute>
        <div data-testid="protected-content">Secret Information</div>
      </PrivateRoute>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});