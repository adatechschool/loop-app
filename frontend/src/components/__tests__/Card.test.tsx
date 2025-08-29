import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Card from '../Card/Card';

// Mock LikeButton and ImageCarousel components
jest.mock('../Card/LikeButton', () => {
  return function MockLikeButton({ title }: { title?: string }) {
    return <button data-testid="like-button">Like {title}</button>;
  };
});

jest.mock('../Card/ImageCarrousel', () => {
  return function MockImageCarousel({ images, title }: { images: string[]; title?: string }) {
    return <div data-testid="image-carousel">Images: {images.length}, Title: {title}</div>;
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Card', () => {
  const defaultProps = {
    images: ['image1.jpg', 'image2.jpg'],
    title: 'Test Place',
    description: 'Test description for the place',
    username: 'testuser',
    userAvatar: 'avatar.jpg',
  };

  test('should render card with all provided content', () => {
    renderWithRouter(<Card {...defaultProps} />);
    
    expect(screen.getByTestId('chakra-avatar')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText('Test description for the place')).toBeInTheDocument();
    expect(screen.getByTestId('image-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
  });

  test('should render "See More" button on desktop', () => {
    renderWithRouter(<Card {...defaultProps} />);
    
    const seeMoreButton = screen.getByText('See More');
    expect(seeMoreButton).toBeInTheDocument();
  });

  test('should call onClick when card is clicked', () => {
    const handleClick = jest.fn();
    renderWithRouter(<Card {...defaultProps} onClick={handleClick} />);
    
    const cardElement = screen.getByTestId('chakra-box');
    fireEvent.click(cardElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should not call onClick when See More button is clicked', () => {
    const handleClick = jest.fn();
    renderWithRouter(<Card {...defaultProps} onClick={handleClick} />);
    
    const seeMoreButton = screen.getByText('See More');
    fireEvent.click(seeMoreButton);
    
    // Should stop propagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('should render without userAvatar when not provided', () => {
    const propsWithoutAvatar = { ...defaultProps, userAvatar: undefined };
    renderWithRouter(<Card {...propsWithoutAvatar} />);
    
    const avatar = screen.getByTestId('chakra-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar.getAttribute('data-src')).toBeUndefined();
  });

  test('should render with empty arrays and undefined values gracefully', () => {
    const emptyProps = {
      images: [],
      title: undefined,
      description: undefined,
      username: undefined,
    };
    
    renderWithRouter(<Card {...emptyProps} />);
    
    expect(screen.getByTestId('image-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
  });

  test('should apply hover styles when onClick is provided', () => {
    const handleClick = jest.fn();
    renderWithRouter(<Card {...defaultProps} onClick={handleClick} />);
    
    const cardElement = screen.getByTestId('chakra-box');
    expect(cardElement).toHaveAttribute('cursor', 'pointer');
  });
});