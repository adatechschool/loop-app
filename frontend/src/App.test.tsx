import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock all the page components
jest.mock('./pages', () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
  ListPage: () => <div data-testid="list-page">List Page</div>,
  AddPage: () => <div data-testid="add-page">Add Page</div>,
  SearchPage: () => <div data-testid="search-page">Search Page</div>,
  ProfilePage: () => <div data-testid="profile-page">Profile Page</div>,
  DetailPage: () => <div data-testid="detail-page">Detail Page</div>,
  EditDetailPage: () => <div data-testid="edit-detail-page">Edit Detail Page</div>,
}));

jest.mock('./pages/LogInPage/LogIn', () => {
  return function MockLogIn() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./pages/LogInPage/LogInForm', () => {
  return function MockLoginForm() {
    return <div data-testid="signin-page">SignIn Page</div>;
  };
});

jest.mock('./pages/LogInPage/SignUpForm', () => {
  return function MockSignUpForm() {
    return <div data-testid="signup-page">SignUp Page</div>;
  };
});

// Mock layouts
jest.mock('./layouts/MainLayout', () => {
  return function MockMainLayout() {
    return (
      <div data-testid="main-layout">
        <div>Main Layout</div>
      </div>
    );
  };
});

jest.mock('./layouts/AuthLayout', () => {
  return function MockAuthLayout() {
    return (
      <div data-testid="auth-layout">
        <div>Auth Layout</div>
      </div>
    );
  };
});

// Mock route components
jest.mock('./routes/PrivateRoute', () => {
  return function MockPrivateRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="private-route">{children}</div>;
  };
});

jest.mock('./routes/PublicRoute', () => {
  return function MockPublicRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="public-route">{children}</div>;
  };
});

// Mock contexts
jest.mock('./contexts/GeolocationContext', () => ({
  GeolocationProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="geolocation-provider">{children}</div>
  ),
}));

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock('./contexts/PlacesContext', () => ({
  PlacesProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="places-provider">{children}</div>
  ),
}));

jest.mock('./components/User/SettingsPage', () => {
  return function MockSettingsPage() {
    return <div data-testid="settings-page">Settings Page</div>;
  };
});

describe('App', () => {
  test('should render with all providers', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('places-provider')).toBeInTheDocument();
    expect(screen.getByTestId('geolocation-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  test('should have proper provider nesting', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Should have nested providers in correct order
    const placesProvider = screen.getByTestId('places-provider');
    const geolocationProvider = screen.getByTestId('geolocation-provider');
    const authProvider = screen.getByTestId('auth-provider');

    expect(placesProvider).toContainElement(geolocationProvider);
    expect(geolocationProvider).toContainElement(authProvider);
  });

  test('should render routing structure', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // App should contain the routing structure
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  test('should provide context to child components', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // All providers should be in the DOM
    expect(screen.getByTestId('places-provider')).toBeInTheDocument();
    expect(screen.getByTestId('geolocation-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });
});
