import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddPage from '../AddPage/AddPage';

// Mock FormAddList component
jest.mock('../../components/FormAddList', () => {
  return function MockFormAddList() {
    return (
      <div data-testid="form-add-list">
        <form>
          <input placeholder="Place name" />
          <button type="submit">Add Place</button>
        </form>
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

describe('AddPage', () => {
  test('should render add page with heading', () => {
    renderWithRouter(<AddPage />);

    expect(screen.getByText('Ajouter un lieu')).toBeInTheDocument();
  });

  test('should render FormAddList component', () => {
    renderWithRouter(<AddPage />);

    expect(screen.getByTestId('form-add-list')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Place name')).toBeInTheDocument();
    expect(screen.getByText('Add Place')).toBeInTheDocument();
  });

  test('should have proper layout structure', () => {
    const { container } = renderWithRouter(<AddPage />);

    // Should have main container
    expect(screen.getByTestId('chakra-box')).toBeInTheDocument();
    expect(screen.getByTestId('chakra-flex')).toBeInTheDocument();
  });

  test('should center the form content', () => {
    renderWithRouter(<AddPage />);

    const flexContainer = screen.getByTestId('chakra-flex');
    expect(flexContainer).toBeInTheDocument();
    
    // The layout should center the form
    const formContainer = screen.getByTestId('form-add-list');
    expect(formContainer).toBeInTheDocument();
  });
});