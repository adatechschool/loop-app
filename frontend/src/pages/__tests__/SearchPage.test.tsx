import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../SearchPage/SearchPage';

// Mock hooks
const mockUseQueryPlaces = jest.fn();
jest.mock('../../hooks/useQueryPlaces', () => ({
  __esModule: true,
  default: () => mockUseQueryPlaces(),
}));

// Mock components
jest.mock('../../components/ListCards/ListCards', () => {
  return function MockListCards({ places, loading }: { places: any[], loading: boolean }) {
    return (
      <div data-testid="list-cards">
        {loading ? (
          <div>Loading search results...</div>
        ) : (
          <div>Search results: {places.length}</div>
        )}
      </div>
    );
  };
});

// Mock react-icons
jest.mock('react-icons/io5', () => ({
  IoSearch: () => <span data-testid="search-icon">🔍</span>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render search input and icon', () => {
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<SearchPage />);

    expect(screen.getByPlaceholderText('Rechercher')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  test('should render places when available', () => {
    const mockPlaces = [
      { id: 1, name: 'Place 1' },
      { id: 2, name: 'Place 2' },
    ];

    mockUseQueryPlaces.mockReturnValue({
      places: mockPlaces,
      loading: false,
    });

    renderWithRouter(<SearchPage />);

    expect(screen.getByTestId('list-cards')).toBeInTheDocument();
    expect(screen.getByText('Search results: 2')).toBeInTheDocument();
  });

  test('should render loading state', () => {
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: true,
    });

    renderWithRouter(<SearchPage />);

    expect(screen.getByText('Loading search results...')).toBeInTheDocument();
  });

  test('should render empty state when no places', () => {
    mockUseQueryPlaces.mockReturnValue({
      places: null,
      loading: false,
    });

    renderWithRouter(<SearchPage />);

    expect(screen.getByText('Aucun lieux disponibles')).toBeInTheDocument();
  });

  test('should handle search input changes', () => {
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Rechercher');
    
    fireEvent.change(searchInput, { target: { value: 'paris' } });
    
    expect(searchInput).toHaveValue('paris');
  });

  test('should have proper layout structure', () => {
    mockUseQueryPlaces.mockReturnValue({
      places: [],
      loading: false,
    });

    renderWithRouter(<SearchPage />);

    expect(screen.getByTestId('chakra-container')).toBeInTheDocument();
    expect(screen.getByTestId('chakra-stack')).toBeInTheDocument();
    expect(screen.getByTestId('chakra-input-group')).toBeInTheDocument();
  });
});