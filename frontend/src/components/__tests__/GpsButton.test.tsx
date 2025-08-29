import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GpsButton from '../GpsButton/GpsButton';

// Mock GPS icons
jest.mock('../Icons/GpsIconActive', () => {
  return function MockGpsIconActive() {
    return <span data-testid="gps-icon-active">📍</span>;
  };
});

jest.mock('../Icons/GpsIconDefault', () => {
  return function MockGpsIconDefault() {
    return <span data-testid="gps-icon-default">📍</span>;
  };
});

describe('GpsButton', () => {
  test('should render with default GPS icon initially', () => {
    render(<GpsButton />);

    const button = screen.getByTitle('Use GPS');
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('gps-icon-default')).toBeInTheDocument();
  });

  test('should toggle between active and default icons', () => {
    render(<GpsButton />);

    const button = screen.getByTitle('Use GPS');
    
    // Initially shows default icon
    expect(screen.getByTestId('gps-icon-default')).toBeInTheDocument();
    expect(screen.queryByTestId('gps-icon-active')).not.toBeInTheDocument();
    
    // Click to activate
    fireEvent.click(button);
    
    expect(screen.getByTestId('gps-icon-active')).toBeInTheDocument();
    expect(screen.queryByTestId('gps-icon-default')).not.toBeInTheDocument();
    
    // Click again to deactivate
    fireEvent.click(button);
    
    expect(screen.getByTestId('gps-icon-default')).toBeInTheDocument();
    expect(screen.queryByTestId('gps-icon-active')).not.toBeInTheDocument();
  });

  test('should have proper styling and positioning', () => {
    render(<GpsButton />);

    const button = screen.getByTitle('Use GPS');
    
    expect(button).toHaveStyle({
      position: 'absolute',
      bottom: '100px',
      right: '20px',
      zIndex: 1000,
    });
  });

  test('should have accessibility attributes', () => {
    render(<GpsButton />);

    const button = screen.getByTitle('Use GPS');
    
    expect(button).toHaveAttribute('title', 'Use GPS');
    expect(button).toHaveAttribute('aria-label', '');
  });

  test('should maintain state across multiple clicks', () => {
    render(<GpsButton />);

    const button = screen.getByTitle('Use GPS');
    
    // Click multiple times
    fireEvent.click(button);
    expect(screen.getByTestId('gps-icon-active')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByTestId('gps-icon-default')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByTestId('gps-icon-active')).toBeInTheDocument();
  });
});