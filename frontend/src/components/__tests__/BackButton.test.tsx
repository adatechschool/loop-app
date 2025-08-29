import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BackButton from '../BackButton';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BackButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render back button with correct aria-label', () => {
    renderWithRouter(<BackButton />);
    
    const backButton = screen.getByRole('button', { name: /retour/i });
    expect(backButton).toBeInTheDocument();
  });

  test('should navigate back when clicked', () => {
    renderWithRouter(<BackButton />);
    
    const backButton = screen.getByRole('button', { name: /retour/i });
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('should render arrow back icon', () => {
    renderWithRouter(<BackButton />);
    
    const arrowIcon = screen.getByTestId('arrow-back-icon');
    expect(arrowIcon).toBeInTheDocument();
  });
});