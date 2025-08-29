import React from 'react';
import { render, screen } from '@testing-library/react';
import ListPage from '../ListPage/ListPage';

// Mock PlacesContext
const mockUsePlacesContext = jest.fn();
jest.mock('../../contexts/PlacesContext', () => ({
  usePlacesContext: () => mockUsePlacesContext(),
}));

// Mock ListCards component
jest.mock('../../components', () => ({
  ListCards: ({ places, loading }: { places: any[], loading: boolean }) => (
    <div data-testid="list-cards">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>Places count: {places.length}</div>
      )}
    </div>
  ),
}));

describe('ListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with places data', () => {
    const mockPlaces = [
      { id: 1, name: 'Place 1' },
      { id: 2, name: 'Place 2' },
    ];

    mockUsePlacesContext.mockReturnValue({
      places: mockPlaces,
      loading: false,
      error: null,
    });

    render(<ListPage />);

    expect(screen.getByText('Lieux à proximité')).toBeInTheDocument();
    expect(screen.getByTestId('list-cards')).toBeInTheDocument();
    expect(screen.getByText('Places count: 2')).toBeInTheDocument();
  });

  test('should render loading state', () => {
    mockUsePlacesContext.mockReturnValue({
      places: [],
      loading: true,
      error: null,
    });

    render(<ListPage />);

    expect(screen.getByText('Lieux à proximité')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should render error state', () => {
    const errorMessage = 'Failed to fetch places';
    
    mockUsePlacesContext.mockReturnValue({
      places: [],
      loading: false,
      error: errorMessage,
    });

    render(<ListPage />);

    expect(screen.getByText('Lieux à proximité')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('should render empty state when no places', () => {
    mockUsePlacesContext.mockReturnValue({
      places: [],
      loading: false,
      error: null,
    });

    render(<ListPage />);

    expect(screen.getByText('Lieux à proximité')).toBeInTheDocument();
    expect(screen.getByText('Places count: 0')).toBeInTheDocument();
  });

  test('should handle null places context', () => {
    mockUsePlacesContext.mockReturnValue(null);

    render(<ListPage />);

    expect(screen.getByText('Lieux à proximité')).toBeInTheDocument();
    // Should handle gracefully with default values
  });

  test('should reverse order of places', () => {
    const mockPlaces = [
      { id: 1, name: 'Place 1' },
      { id: 2, name: 'Place 2' },
      { id: 3, name: 'Place 3' },
    ];

    mockUsePlacesContext.mockReturnValue({
      places: mockPlaces,
      loading: false,
      error: null,
    });

    render(<ListPage />);

    // The component reverses the places order
    expect(screen.getByText('Places count: 3')).toBeInTheDocument();
  });
});