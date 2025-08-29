import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LogInPage/LogInForm';
import axios from 'axios';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockLogin = jest.fn();
const mockUseContext = jest.fn();
React.useContext = mockUseContext;

// Mock BackButton
jest.mock('../../components/BackButton', () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

// Mock Chakra icons
jest.mock('@chakra-ui/icons', () => ({
  ViewIcon: () => <span data-testid="view-icon">👁️</span>,
  ViewOffIcon: () => <span data-testid="view-off-icon">🙈</span>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    
    mockUseContext.mockReturnValue({
      login: mockLogin,
    });

    // Mock toast
    (global as any).mockToast = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should render login form with all fields', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText('Se connecter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom d\'utilisateur')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  test('should toggle password visibility', () => {
    renderWithRouter(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const toggleButton = screen.getByTestId('view-icon').closest('button');

    expect(passwordInput).toHaveAttribute('type', 'password');

    if (toggleButton) {
      fireEvent.click(toggleButton);
    }

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should handle successful login', async () => {
    const mockResponse = {
      data: { token: 'test-token' },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Nom d\'utilisateur');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByText('Connexion');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/login',
        {
          username: 'testuser',
          password: 'password123',
        }
      );
    });

    expect(mockLogin).toHaveBeenCalledWith('test-token');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('should handle login error', async () => {
    const mockError = {
      response: { data: { message: 'Invalid credentials' } },
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Nom d\'utilisateur');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByText('Connexion');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('should handle network error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Nom d\'utilisateur');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByText('Connexion');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });
  });

  test('should navigate to signup page', () => {
    renderWithRouter(<LoginForm />);

    const signupButton = screen.getByText('Créer un compte');
    fireEvent.click(signupButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  test('should validate empty form submission', () => {
    renderWithRouter(<LoginForm />);

    const submitButton = screen.getByText('Connexion');
    fireEvent.click(submitButton);

    // Should not call API with empty fields
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});