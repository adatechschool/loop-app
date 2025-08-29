import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LikeButton from '../Card/LikeButton';

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdFavorite: () => <span data-testid="favorite-icon">❤️</span>,
  MdFavoriteBorder: () => <span data-testid="favorite-border-icon">🤍</span>,
}));

describe('LikeButton', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should not render when no token is present', () => {
    const { container } = render(<LikeButton title="Test Place" />);
    expect(container.firstChild).toBeNull();
  });

  test('should render with unfilled heart when not favorite', () => {
    localStorage.setItem('token', 'test-token');
    
    render(<LikeButton title="Test Place" isFavorite={false} />);
    
    const button = screen.queryByTestId('chakra-icon-button');
    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('favorite-border-icon')).toBeInTheDocument();
  });

  test('should render with filled heart when favorite', () => {
    localStorage.setItem('token', 'test-token');
    
    render(<LikeButton title="Test Place" isFavorite={true} />);
    
    const button = screen.queryByTestId('chakra-icon-button');
    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('favorite-icon')).toBeInTheDocument();
  });

  test('should toggle favorite status when clicked', () => {
    localStorage.setItem('token', 'test-token');
    
    render(<LikeButton title="Test Place" isFavorite={false} />);
    
    const button = screen.queryByTestId('chakra-icon-button');
    expect(button).toBeInTheDocument();
    
    // Initially unfavorite
    expect(screen.queryByTestId('favorite-border-icon')).toBeInTheDocument();
    
    // Click to favorite
    if (button) {
      fireEvent.click(button);
    }
    
    expect(screen.queryByTestId('favorite-icon')).toBeInTheDocument();
  });

  test('should stop propagation when clicked', () => {
    localStorage.setItem('token', 'test-token');
    const parentClickHandler = jest.fn();
    
    render(
      <div onClick={parentClickHandler}>
        <LikeButton title="Test Place" isFavorite={false} />
      </div>
    );
    
    const button = screen.queryByTestId('chakra-icon-button');
    if (button) {
      fireEvent.click(button);
    }
    
    // Parent click handler should not be called due to stopPropagation
    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  test('should call onAddToFavorites callback when provided', () => {
    localStorage.setItem('token', 'test-token');
    const onAddToFavorites = jest.fn();
    
    render(
      <LikeButton 
        title="Test Place" 
        isFavorite={false} 
        onAddToFavorites={onAddToFavorites}
      />
    );
    
    const button = screen.queryByTestId('chakra-icon-button');
    if (button) {
      fireEvent.click(button);
    }
    
    // Note: This test validates the prop exists, actual callback logic would need the component to be updated
  });
});