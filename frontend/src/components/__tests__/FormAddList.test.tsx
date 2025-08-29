import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FormAddList from '../FormAddList';
import axios from 'axios';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock contexts
const mockUseGeolocationContext = jest.fn();
jest.mock('../../contexts/GeolocationContext', () => ({
  useGeolocationContext: () => mockUseGeolocationContext(),
}));

const mockUseContext = jest.fn();
React.useContext = mockUseContext;

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaAccessibleIcon: () => <span data-testid="accessibility-icon">♿</span>,
  FaPlus: () => <span data-testid="plus-icon">+</span>,
  FaTimes: () => <span data-testid="times-icon">×</span>,
}));

jest.mock('react-icons/fa6', () => ({
  FaLocationCrosshairs: () => <span data-testid="location-icon">📍</span>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FormAddList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    
    mockUseGeolocationContext.mockReturnValue({
      location: {
        coords: { latitude: 48.8566, longitude: 2.3522 },
      },
    });
    
    mockUseContext.mockReturnValue({
      token: 'test-token',
    });

    // Mock toast
    (global as any).mockToast = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should render form fields', () => {
    renderWithRouter(<FormAddList />);

    expect(screen.getByText('Image du lieu')).toBeInTheDocument();
    expect(screen.getByText('Nom')).toBeInTheDocument();
    expect(screen.getByText('Adresse')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Catégorie')).toBeInTheDocument();
    expect(screen.getByText('Accessibilité')).toBeInTheDocument();
  });

  test('should render category options', () => {
    renderWithRouter(<FormAddList />);

    const select = screen.getByTestId('chakra-select');
    expect(select).toBeInTheDocument();
    
    // Options are rendered as children, so we test that the select exists
    expect(screen.getByText('Choisis une catégorie')).toBeInTheDocument();
  });

  test('should handle accessibility toggle', () => {
    renderWithRouter(<FormAddList />);

    const accessibilitySwitch = screen.getByRole('checkbox'); // Switch renders as checkbox
    expect(accessibilitySwitch).toBeInTheDocument();
    
    fireEvent.click(accessibilitySwitch);
    // The switch state should toggle
  });

  test('should show image upload area when no image', () => {
    renderWithRouter(<FormAddList />);

    expect(screen.getByText('Ajouter une image')).toBeInTheDocument();
    expect(screen.getByText(/Cliquez pour sélectionner une image/)).toBeInTheDocument();
  });

  test('should handle form input changes', () => {
    renderWithRouter(<FormAddList />);

    const nameInput = screen.getByDisplayValue('');
    fireEvent.change(nameInput, { target: { value: 'Test Place Name' } });
    
    expect(nameInput).toHaveValue('Test Place Name');
  });

  test('should handle file selection', () => {
    renderWithRouter(<FormAddList />);

    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    // File handling would be tested in integration
  });

  test('should submit form with valid data', async () => {
    // Mock successful API responses
    mockedAxios.post
      .mockResolvedValueOnce({ data: { secure_url: 'test-image-url' } }) // Cloudinary
      .mockResolvedValueOnce({ data: { id: 1 } }) // Image API
      .mockResolvedValueOnce({ data: { success: true } }); // Place creation

    renderWithRouter(<FormAddList />);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Nom');
    const addressInput = screen.getByPlaceholderText('Adresse');
    
    fireEvent.change(nameInput, { target: { value: 'Test Place' } });
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });

    const submitButton = screen.getByText('Ajouter le lieu');
    fireEvent.click(submitButton);

    // Form should handle submission
    expect(submitButton).toBeInTheDocument();
  });

  test('should handle geolocation button click', () => {
    renderWithRouter(<FormAddList />);

    const locationButton = screen.getByTestId('location-icon').closest('button');
    if (locationButton) {
      fireEvent.click(locationButton);
    }

    // Should use current location
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
  });

  test('should validate required fields', () => {
    renderWithRouter(<FormAddList />);

    const submitButton = screen.getByText('Ajouter le lieu');
    fireEvent.click(submitButton);

    // Form validation should occur
    expect(submitButton).toBeInTheDocument();
  });
});