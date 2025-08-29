import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from '../ProfilePage/ProfilePage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock hooks
const mockUseQueryUser = jest.fn();
const mockUseQueryPlaces = jest.fn();
jest.mock('../../hooks/useQueryUser', () => ({
  __esModule: true,
  default: () => mockUseQueryUser(),
}));
jest.mock('../../hooks/useQueryPlaces', () => ({
  __esModule: true,
  default: () => mockUseQueryPlaces(),
}));

// Mock AuthContext
const mockLogout = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  AuthContext: {
    Provider: ({ children }: any) => children,
  },
}));

// Mock React context
const mockUseContext = jest.fn();
React.useContext = mockUseContext;

// Mock ListCards component
jest.mock('../../components/ListCards/ListCards', () => {
  return function MockListCards({ places, loading }: { places: any[], loading: boolean }) {
    return (
      <div data-testid="list-cards">
        {loading ? 'Loading places...' : `User places: ${places.length}`}
      </div>
    );
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseContext.mockReturnValue({ logout: mockLogout });
  });

  test('should render loading state for user', () => {
    mockUseQueryUser.mockReturnValue({
      user: null,
      loading: true,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    expect(screen.getByTestId('chakra-skeleton-circle')).toBeInTheDocument();
    expect(screen.getByTestId('chakra-skeleton-text')).toBeInTheDocument();
  });

  test('should render user profile when loaded', () => {
    const mockUser = {
      username: 'testuser',
      profilePicture: 'avatar.jpg',
    };

    mockUseQueryUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByTestId('chakra-avatar')).toBeInTheDocument();
  });

  test('should render user places correctly', () => {
    const mockUser = { username: 'testuser' };
    const mockPlaces = [
      { id: 1, name: 'Place 1', author: { username: 'testuser' } },
      { id: 2, name: 'Place 2', author: { username: 'otheruser' } },
      { id: 3, name: 'Place 3', author: { username: 'testuser' } },
    ];

    mockUseQueryUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: mockPlaces,
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    expect(screen.getByText('User places: 2')).toBeInTheDocument(); // Only testuser's places
  });

  test('should render empty state when no user places', () => {
    const mockUser = { username: 'testuser' };

    mockUseQueryUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    expect(screen.getByText('Aucun lieux disponibles')).toBeInTheDocument();
  });

  test('should handle logout functionality', () => {
    const mockUser = { username: 'testuser' };

    mockUseQueryUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    // Find and click logout menu item
    const logoutMenuItem = screen.getByText('Se déconnecter');
    fireEvent.click(logoutMenuItem);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  test('should navigate to settings', () => {
    const mockUser = { username: 'testuser' };

    mockUseQueryUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    const settingsMenuItem = screen.getByText('Paramètres');
    fireEvent.click(settingsMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  test('should render tabs correctly', () => {
    const mockUser = { username: 'testuser' };

    mockUseQueryUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<ProfilePage />);

    expect(screen.getByText('Mes Lieux')).toBeInTheDocument();
    expect(screen.getByText('Mes Favoris')).toBeInTheDocument();
    expect(screen.getByText('Aucun favori ajouté.')).toBeInTheDocument();
  });
});