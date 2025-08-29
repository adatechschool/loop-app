import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../Homepage/HomePage';

// Mock MapContainerWrapper
jest.mock('../../components', () => ({
  MapContainerWrapper: () => (
    <div data-testid="map-container-wrapper">Map Container</div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  test('should render map container wrapper', () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByTestId('map-container-wrapper')).toBeInTheDocument();
    expect(screen.getByText('Map Container')).toBeInTheDocument();
  });

  test('should render homepage wrapper div', () => {
    const { container } = renderWithRouter(<HomePage />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});