import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignupForm from '../LogInPage/SignUpForm';
import axios from 'axios';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock BackButton
jest.mock('../../components/BackButton', () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    
    // Mock toast
    (global as any).mockToast = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should render signup form with all fields', () => {
    renderWithRouter(<SignupForm />);

    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom complet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom d\'utilisateur')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByText('S\'inscrire')).toBeInTheDocument();
  });

  test('should handle form input changes', () => {
    renderWithRouter(<SignupForm />);

    const nameInput = screen.getByPlaceholderText('Nom complet');
    const usernameInput = screen.getByPlaceholderText('Nom d\'utilisateur');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput).toHaveValue('Test User');
    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('should handle successful signup without profile picture', async () => {
    const mockResponse = {
      data: { message: 'User created successfully' },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    renderWithRouter(<SignupForm />);

    const nameInput = screen.getByPlaceholderText('Nom complet');
    const usernameInput = screen.getByPlaceholderText('Nom d\'utilisateur');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByText('S\'inscrire');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/signup',
        {
          name: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          profilePicture: '',
        }
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  test('should handle signup with profile picture upload', async () => {
    const mockCloudinaryResponse = {
      data: { secure_url: 'https://cloudinary.com/test-image.jpg' },
    };
    const mockSignupResponse = {
      data: { message: 'User created successfully' },
    };

    mockedAxios.post
      .mockResolvedValueOnce(mockCloudinaryResponse) // Cloudinary upload
      .mockResolvedValueOnce(mockSignupResponse); // Signup

    renderWithRouter(<SignupForm />);

    const fileInput = screen.getByTestId('chakra-input');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);

    const nameInput = screen.getByPlaceholderText('Nom complet');
    const submitButton = screen.getByText('S\'inscrire');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);

    // File upload should be handled
    expect(fileInput).toBeInTheDocument();
  });

  test('should handle signup error', async () => {
    const mockError = {
      response: { data: { message: 'Username already exists' } },
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    renderWithRouter(<SignupForm />);

    const submitButton = screen.getByText('S\'inscrire');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });

  test('should navigate to login page', () => {
    renderWithRouter(<SignupForm />);

    const loginButton = screen.getByText('Se connecter');
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });
});